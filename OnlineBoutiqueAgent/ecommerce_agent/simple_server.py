"""
Simplified FastAPI server for E-commerce Agent
Directly uses product search functions without complex agent orchestration
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import sys
import os
import io
import base64
from datetime import datetime

# Add to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import just what we need
from agents.product_finder_agent.agent import search_products, get_product_details
from agents.export_agent.agent import generate_order_pdf
from tambo_ui_engine import TamboUIDecisionEngine

# Import database and auth
try:
    from database import User, Cart, Order, db
    from auth import hash_password, verify_password, create_access_token, decode_access_token
    MONGODB_ENABLED = True
    print("✅ MongoDB enabled - authentication and database features active")
except Exception as e:
    if "MONGODB_NOT_CONFIGURED" in str(e):
        print("⚠️ MongoDB disabled - using in-memory storage")
        print("   To enable database features, update MONGODB_URI in .env")
    else:
        print(f"⚠️ MongoDB disabled due to error: {e}")
    MONGODB_ENABLED = False

app = FastAPI(
    title="Cymbal Shops E-commerce API",
    description="Backend API with Tambo Generative UI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize
ui_engine = TamboUIDecisionEngine()
sessions: Dict[str, Dict] = {}


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None  # Added for authenticated users


class ChatResponse(BaseModel):
    agent_response: str
    ui_component: str
    ui_props: Dict[str, Any]
    ui_reason: Optional[str] = None
    context: Dict[str, Any]


class SignupRequest(BaseModel):
    email: str
    username: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    status: str
    token: str
    user: Dict[str, Any]
    message: str


app = FastAPI(
    title="Cymbal Shops E-commerce API",
    description="Backend API with Tambo Generative UI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize
ui_engine = TamboUIDecisionEngine()
sessions: Dict[str, Dict] = {}


def get_current_user(authorization: Optional[str] = None) -> Optional[dict]:
    """Get current user from authorization header"""
    if not MONGODB_ENABLED or not authorization:
        return None
    
    try:
        # Extract token from "Bearer <token>"
        if not authorization.startswith("Bearer "):
            return None
        
        token = authorization.replace("Bearer ", "")
        payload = decode_access_token(token)
        
        if not payload:
            return None
        
        user = User.find_by_id(payload.get("sub"))
        return user
    except:
        return None


@app.get("/")
async def root():
    return {
        "status": "running",
        "service": "Cymbal Shops E-commerce API",
        "version": "1.0.0",
        "mongodb_enabled": MONGODB_ENABLED
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "components": len(ui_engine.registered_components)
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, authorization: Optional[str] = Header(None)):
    """Process chat message and return UI component"""
    print('\n' + '='*100)
    print('📨 [BACKEND] /chat endpoint called')
    print('='*100)
    print(f'📝 [REQUEST] Message: "{request.message}"')
    print(f'🔑 [REQUEST] Session ID: {request.session_id}')
    print(f'🔐 [REQUEST] Authorization header: {authorization[:50] if authorization else "❌ None"}...')
    print(f'👤 [REQUEST] User ID: {request.user_id}')
    
    try:
        # Try to get user from authorization header OR from session_id (if it contains a token)
        user = None
        if MONGODB_ENABLED:
            print(f'💾 [AUTH] MongoDB enabled - checking authentication...')
            # First try authorization header
            if authorization:
                user = get_current_user(authorization)
            
            # If no user from header, try to decode session_id as token
            if not user and request.session_id and request.session_id.startswith('user_'):
                # Session ID format: user_{user_id}
                user_id = request.session_id.replace('user_', '')
                user = User.find_by_id(user_id)
        
        session_id = request.session_id or f"session_{hash(request.message)}"
        user_id = user["_id"] if user else None
        
        # Initialize session
        if session_id not in sessions:
            sessions[session_id] = {
                'products': [],
                'cart_items': [],
                'history': []
            }
        
        context = sessions[session_id]
        user_message = request.message.lower()
        
        # Check if user wants to login
        login_keywords = ['login', 'log in', 'sign in', 'signin']
        if any(keyword in user_message for keyword in login_keywords) and 'create' not in user_message and 'signup' not in user_message:
            return ChatResponse(
                agent_response="Please login to your account to continue shopping and checkout.",
                ui_component='LoginForm',
                ui_props={},
                ui_reason='User requested login',
                context=context
            )
        
        # Check if user wants to signup
        signup_keywords = ['signup', 'sign up', 'create account', 'register', 'new account']
        if any(keyword in user_message for keyword in signup_keywords):
            return ChatResponse(
                agent_response="Create your account to start shopping and save your cart!",
                ui_component='SignupForm',
                ui_props={},
                ui_reason='User requested signup',
                context=context
            )
        
        # Check if user wants to view order history
        order_keywords = ['order history', 'my orders', 'past orders', 'previous orders', 'show orders']
        print(f"🔍 CHECKING ORDER KEYWORDS in message: '{user_message}'")
        print(f"🔍 Keywords to check: {order_keywords}")
        keyword_match = any(keyword in user_message for keyword in order_keywords)
        print(f"🔍 Keyword match result: {keyword_match}")
        
        if keyword_match:
            print(f"✅ ORDER HISTORY REQUEST DETECTED!")
            print(f"📊 MongoDB enabled: {MONGODB_ENABLED}")
            print(f"🔑 Authorization header: {authorization[:50] if authorization else 'None'}...")
            
            if MONGODB_ENABLED:
                print(f"🔄 Getting current user from token...")
                user = get_current_user(authorization)
                print(f"👤 User retrieved: {user['email'] if user else 'None'}")
                print(f"👤 User ID: {user['_id'] if user else 'None'}")
                
                if not user:
                    print(f"❌ No user found - returning LoginForm")
                    return ChatResponse(
                        agent_response="You need to login to view your order history. Please login or create an account.",
                        ui_component='LoginForm',
                        ui_props={
                            'message': 'Login to view your order history'
                        },
                        ui_reason='Order history requires authentication',
                        context=context
                    )
                
                # Get user orders
                print(f"📥 Calling Order.get_user_orders for user_id: {user['_id']}")
                orders = Order.get_user_orders(user["_id"])
                print(f"📦 Raw orders count: {len(orders)}")
                print(f"📦 Orders type: {type(orders)}")
                
                for idx, order in enumerate(orders):
                    print(f"  📋 Order {idx + 1}:")
                    print(f"     - ID: {order['_id']}")
                    print(f"     - Items count: {len(order['items'])}")
                    print(f"     - Total: ${order['total']}")
                    print(f"     - Status: {order['status']}")
                    print(f"     - Created: {order['created_at']}")
                    print(f"     - Raw items: {order['items']}")
                
                print(f"🔄 Starting order formatting...")
                formatted_orders = []
                for order in orders:
                    # Ensure items have proper structure
                    formatted_items = []
                    for item in order.get('items', []):
                        formatted_items.append({
                            'id': item.get('id', ''),
                            'name': item.get('name', 'Unknown'),
                            'price': item.get('price', 0),
                            'quantity': item.get('quantity', 1),
                            'image': item.get('image', '')
                        })
                    
                    formatted_orders.append({
                        'orderId': order['_id'][:8],
                        'date': order['created_at'].strftime("%Y-%m-%d %H:%M:%S"),
                        'items': formatted_items,
                        'total': order['total'],
                        'status': order['status']
                    })
                
                print(f"✅ Formatted orders count: {len(formatted_orders)}")
                print(f"📊 Full formatted_orders array:")
                for idx, fo in enumerate(formatted_orders):
                    print(f"   Order {idx + 1}: {fo}")
                
                if orders:
                    total_items = sum(len(o['items']) for o in orders)
                    agent_response = f"Here are your {len(orders)} past order{'s' if len(orders) > 1 else ''}: {total_items} total items purchased."
                    print(f"✅ Agent response: {agent_response}")
                else:
                    agent_response = "You don't have any orders yet. Start shopping!"
                    print(f"⚠️ No orders - empty response")
                
                print(f"📤 RETURNING ChatResponse:")
                print(f"   - agent_response: {agent_response}")
                print(f"   - ui_component: OrderHistory")
                print(f"   - ui_props.orders length: {len(formatted_orders)}")
                print(f"   - ui_props: {{'orders': {formatted_orders}}}")
                
                return ChatResponse(
                    agent_response=agent_response,
                    ui_component='OrderHistory',
                    ui_props={
                        'orders': formatted_orders
                    },
                    ui_reason='Displaying order history',
                    context=context
                )
            else:
                orders = order_history.get(session_id, [])
                formatted_orders = []
                for order in orders:
                    formatted_orders.append({
                        'orderId': order['order_id'],
                        'date': order['date'],
                        'items': order['items'],
                        'total': order['total'],
                        'status': order['status']
                    })
                
                return ChatResponse(
                    agent_response=f"Here are your {len(formatted_orders)} past orders:" if orders else "You don't have any orders yet.",
                    ui_component='OrderHistory',
                    ui_props={
                        'orders': formatted_orders
                    },
                    ui_reason='Displaying order history',
                    context=context
                )
        
        # Check if user wants to view their profile
        profile_keywords = ['show my profile', 'view profile', 'my account', 'account details', 'profile page', 'my profile', 'view my profile', 'show profile']
        if any(keyword in user_message for keyword in profile_keywords):
            print(f"🔍 PROFILE REQUEST - MongoDB: {MONGODB_ENABLED}")
            if MONGODB_ENABLED:
                user = get_current_user(authorization)
                print(f"👤 User from token: {user['email'] if user else 'None'}")
                if not user:
                    return ChatResponse(
                        agent_response="You need to login to view your profile. Please login or create an account.",
                        ui_component='LoginForm',
                        ui_props={
                            'message': 'Login to view your profile'
                        },
                        ui_reason='Profile requires authentication',
                        context=context
                    )
                
                # Get user profile data
                try:
                    user_id = user["_id"]
                    
                    # Get cart
                    cart = Cart.get_or_create(user_id)
                    cart_items = cart.get('items', [])
                    
                    # Get orders
                    orders = Order.get_user_orders(user_id)
                    
                    # Format orders
                    formatted_orders = []
                    for order in orders:
                        formatted_orders.append({
                            'orderId': order['_id'][:8],
                            'date': order['created_at'].strftime("%Y-%m-%d %H:%M:%S"),
                            'items': order['items'],
                            'total': order['total'],
                            'status': order['status']
                        })
                    
                    # Format cart items
                    formatted_cart = []
                    for item in cart_items:
                        formatted_cart.append({
                            'id': item.get('id', ''),
                            'name': item.get('name', 'Product'),
                            'price': item.get('price', 0),
                            'quantity': item.get('quantity', 1),
                            'image': item.get('image', 'https://picsum.photos/seed/cart/100/100')
                        })
                    
                    profile_data = {
                        'user': {
                            'id': user['_id'],
                            'email': user['email'],
                            'username': user['username'],
                            'full_name': user.get('full_name', user['username']),
                            'phone': user.get('phone', ''),
                            'address': user.get('address', ''),
                            'created_at': user['created_at'].strftime("%Y-%m-%d %H:%M:%S") if 'created_at' in user else ''
                        },
                        'cart_items': formatted_cart,
                        'orders': formatted_orders,
                        'total_cart_items': sum(item['quantity'] for item in cart_items),
                        'total_orders': len(formatted_orders)
                    }
                    
                    print(f"📊 Profile data: User={user['email']}, Cart={len(cart_items)}, Orders={len(orders)}")
                    
                    return ChatResponse(
                        agent_response=f"Here's your profile, {user.get('full_name', user['username'])}! You have {len(cart_items)} items in your cart and {len(orders)} past orders.",
                        ui_component='UserProfile',
                        ui_props=profile_data,
                        ui_reason='Displaying user profile',
                        context=context
                    )
                except Exception as e:
                    print(f"❌ Error loading profile: {e}")
                    return ChatResponse(
                        agent_response="Sorry, there was an error loading your profile.",
                        ui_component='LoginForm',
                        ui_props={},
                        ui_reason='Profile error',
                        context=context
                    )
            else:
                return ChatResponse(
                    agent_response="Profile feature requires database connection. Please configure MongoDB.",
                    ui_component='LoginForm',
                    ui_props={},
                    ui_reason='MongoDB not configured',
                    context=context
                )
        
        # Check if user wants to view cart
        cart_keywords = ['show cart', 'my cart', 'view cart', 'see cart', 'cart items', 'what\'s in my cart', 'whats in my cart']
        if any(keyword in user_message for keyword in cart_keywords):
            if MONGODB_ENABLED:
                user = get_current_user(authorization)
                if not user:
                    return ChatResponse(
                        agent_response="Please login to view your cart.",
                        ui_component='LoginForm',
                        ui_props={},
                        ui_reason='Cart requires authentication',
                        context=context
                    )
                
                # Get user cart from MongoDB
                cart = Cart.get_or_create(user["_id"])
                cart_items = cart['items']
            else:
                # Get cart items from memory
                cart_items = global_cart.get(session_id, [])
            
            total = sum(item['price'] * item['quantity'] for item in cart_items)
            
            # Format for CheckoutWizard
            formatted_cart = []
            for item in cart_items:
                formatted_cart.append({
                    'id': item.get('id', ''),
                    'name': item.get('name', 'Product'),
                    'price': item.get('price', 0),
                    'quantity': item.get('quantity', 1),
                    'image': item.get('image', 'https://picsum.photos/seed/cart/100/100')
                })
            
            if cart_items:
                agent_response = f"Here's your cart with {sum(item['quantity'] for item in cart_items)} item(s) totaling ${total:.2f}"
            else:
                agent_response = "Your cart is empty. Browse products to add items!"
            
            return ChatResponse(
                agent_response=agent_response,
                ui_component='CheckoutWizard',
                ui_props={
                    'cartItems': formatted_cart,
                    'expressMode': False,
                    'shippingCost': 0
                },
                ui_reason='Displaying cart contents',
                context=context
            )
        
        # Otherwise, search products
        search_result = search_products(request.message)
        
        # Build response
        if search_result.get('status') == 'success':
            products = search_result.get('products', [])
            context['products'] = products
            
            if products:
                names = [p['name'] for p in products[:3]]
                agent_response = f"Here are some products I found: {', '.join(names)}"
                if len(products) > 3:
                    agent_response += f" and {len(products) - 3} more."
            else:
                agent_response = f"No products found matching '{request.message}'. Try 'sunglasses', 'shirts', or 'shoes'."
        else:
            agent_response = f"Error searching: {search_result.get('error_message', 'Unknown error')}"
            products = []
        
        # Format products for UI
        formatted_products = []
        for p in products:
            try:
                price_str = p.get('price', '$0')
                price_num = float(price_str.replace('$', '')) if '$' in price_str else 0
            except:
                price_num = 0
            
            # Use scraped image URL or fallback to placeholder
            product_id = p.get('id', 'default')
            image_url = p.get('image') or f'https://picsum.photos/seed/{product_id}/300/300'
            
            formatted_products.append({
                'id': product_id,
                'name': p.get('name', 'Product'),
                'price': price_num,
                'image': image_url,
                'description': p.get('description') or p.get('name', 'No description'),
                'category': 'Products',
                'rating': 4.5,
                'inStock': True
            })
        
        # Decide UI component
        ui_config = ui_engine.decide_ui_component(
            user_message=request.message,
            agent_response=agent_response,
            context=context
        )
        
        # Set products in props
        ui_config.props['products'] = formatted_products
        
        return ChatResponse(
            agent_response=agent_response,
            ui_component=ui_config.component_name,
            ui_props=ui_config.props,
            ui_reason=ui_config.reason,
            context=context
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/auth/signup", response_model=AuthResponse)
async def signup(request: SignupRequest):
    """Create a new user account"""
    if not MONGODB_ENABLED:
        raise HTTPException(status_code=503, detail="MongoDB not configured")
    
    try:
        # Check if user already exists
        if User.find_by_email(request.email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        if User.find_by_username(request.username):
            raise HTTPException(status_code=400, detail="Username already taken")
        
        # Create user
        hashed_pwd = hash_password(request.password)
        user = User.create(
            email=request.email,
            username=request.username,
            hashed_password=hashed_pwd
        )
        
        # Generate token
        token = create_access_token(user["_id"], user["email"])
        
        return AuthResponse(
            status="success",
            token=token,
            user={
                "id": user["_id"],
                "email": user["email"],
                "username": user["username"]
            },
            message=f"Welcome {user['username']}! Your account has been created."
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login to existing account"""
    if not MONGODB_ENABLED:
        raise HTTPException(status_code=503, detail="MongoDB not configured")
    
    try:
        # Find user
        user = User.find_by_email(request.email)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(request.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Generate token
        token = create_access_token(user["_id"], user["email"])
        
        return AuthResponse(
            status="success",
            token=token,
            user={
                "id": user["_id"],
                "email": user["email"],
                "username": user["username"]
            },
            message=f"Welcome back, {user['username']}!"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/auth/me")
async def get_me(authorization: Optional[str] = Header(None)):
    """Get current user info"""
    if not MONGODB_ENABLED:
        raise HTTPException(status_code=503, detail="MongoDB not configured")
    
    user = get_current_user(authorization)
    
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    return {
        "id": user["_id"],
        "email": user["email"],
        "username": user["username"]
    }


# ============================================================================
# PROFILE ENDPOINTS
# ============================================================================

@app.get("/profile")
async def get_profile(authorization: Optional[str] = Header(None)):
    """Get user profile with cart and order history"""
    if not MONGODB_ENABLED:
        raise HTTPException(status_code=503, detail="MongoDB not configured")
    
    user = get_current_user(authorization)
    
    if not user:
        raise HTTPException(status_code=401, detail="Please login to view your profile")
    
    try:
        user_id = user["_id"]
        
        # Get cart
        cart = Cart.get_or_create(user_id)
        cart_items = cart.get('items', [])
        
        # Get orders
        orders = Order.get_user_orders(user_id)
        
        # Format orders
        formatted_orders = []
        for order in orders:
            formatted_orders.append({
                'orderId': order['_id'][:8],
                'date': order['created_at'].strftime("%Y-%m-%d %H:%M:%S"),
                'items': order['items'],
                'total': order['total'],
                'status': order['status']
            })
        
        # Format cart items
        formatted_cart = []
        for item in cart_items:
            formatted_cart.append({
                'id': item.get('id', ''),
                'name': item.get('name', 'Product'),
                'price': item.get('price', 0),
                'quantity': item.get('quantity', 1),
                'image': item.get('image', 'https://picsum.photos/seed/cart/100/100')
            })
        
        return {
            'status': 'success',
            'user': {
                'id': user['_id'],
                'email': user['email'],
                'username': user['username'],
                'full_name': user.get('full_name', user['username']),
                'phone': user.get('phone', ''),
                'address': user.get('address', ''),
                'created_at': user['created_at'].strftime("%Y-%m-%d %H:%M:%S") if 'created_at' in user else ''
            },
            'cart_items': formatted_cart,
            'orders': formatted_orders,
            'total_cart_items': sum(item['quantity'] for item in cart_items),
            'total_orders': len(formatted_orders)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/profile/update")
async def update_profile(request: dict, authorization: Optional[str] = Header(None)):
    """Update user profile information"""
    if not MONGODB_ENABLED:
        raise HTTPException(status_code=503, detail="MongoDB not configured")
    
    user = get_current_user(authorization)
    
    if not user:
        raise HTTPException(status_code=401, detail="Please login to update your profile")
    
    try:
        user_id = user["_id"]
        updates = {}
        
        # Extract allowed fields from request
        if 'full_name' in request:
            updates['full_name'] = request['full_name']
        if 'email' in request:
            # Check if email already exists for another user
            existing_user = User.find_by_email(request['email'])
            if existing_user and existing_user['_id'] != user_id:
                raise HTTPException(status_code=400, detail="Email already in use by another account")
            updates['email'] = request['email']
        if 'phone' in request:
            updates['phone'] = request['phone']
        if 'address' in request:
            updates['address'] = request['address']
        
        if not updates:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        # Update user profile
        updated_user = User.update_profile(user_id, updates)
        
        if not updated_user:
            raise HTTPException(status_code=500, detail="Failed to update profile")
        
        return {
            'status': 'success',
            'message': 'Profile updated successfully',
            'user': {
                'id': updated_user['_id'],
                'email': updated_user['email'],
                'username': updated_user['username'],
                'full_name': updated_user.get('full_name', updated_user['username']),
                'phone': updated_user.get('phone', ''),
                'address': updated_user.get('address', '')
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/components")
async def list_components():
    return {
        "components": ui_engine.registered_components,
        "total": len(ui_engine.registered_components)
    }


# Global cart storage (fallback for non-MongoDB mode)
global_cart: Dict[str, List[Dict]] = {}

# Global order history (fallback for non-MongoDB mode)
order_history: Dict[str, List[Dict]] = {}


# ============================================================================
# CART ENDPOINTS
# ============================================================================

@app.post("/cart/add")
async def add_to_cart(request: dict, authorization: Optional[str] = Header(None)):
    """Add item(s) to cart"""
    try:
        product_id = request.get('product_id')
        quantity = request.get('quantity', 1)
        product_name = request.get('product_name', 'Product')
        price = request.get('price', 0)
        image = request.get('image', '')
        
        if MONGODB_ENABLED:
            # Get current user
            user = get_current_user(authorization)
            if not user:
                raise HTTPException(status_code=401, detail="Please login to add items to cart")
            
            user_id = user["_id"]
            
            # Add to MongoDB cart
            item = {
                'id': product_id,
                'name': product_name,
                'price': price,
                'image': image,
                'quantity': quantity
            }
            cart = Cart.add_item(user_id, item)
            
            return {
                'status': 'success',
                'cart': cart['items'],
                'total_items': sum(item['quantity'] for item in cart['items']),
                'message': f'Added {product_name} to your cart'
            }
        else:
            # Fallback to in-memory cart
            session_id = request.get('session_id', 'default')
            
            if session_id not in global_cart:
                global_cart[session_id] = []
            
            # Check if product already in cart
            existing_item = next((item for item in global_cart[session_id] if item['id'] == product_id), None)
            
            if existing_item:
                existing_item['quantity'] += quantity
            else:
                global_cart[session_id].append({
                    'id': product_id,
                    'name': product_name,
                    'price': price,
                    'image': image,
                    'quantity': quantity
                })
            
            return {
                'status': 'success',
                'cart': global_cart[session_id],
                'total_items': sum(item['quantity'] for item in global_cart[session_id])
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cart/remove")
async def remove_from_cart(request: dict, authorization: Optional[str] = Header(None)):
    """Remove item from cart"""
    try:
        product_id = request.get('product_id')
        
        if MONGODB_ENABLED:
            user = get_current_user(authorization)
            if not user:
                raise HTTPException(status_code=401, detail="Please login to modify cart")
            
            user_id = user["_id"]
            cart = Cart.remove_item(user_id, product_id)
            
            return {
                'status': 'success',
                'cart': cart['items'],
                'total_items': sum(item['quantity'] for item in cart['items'])
            }
        else:
            session_id = request.get('session_id', 'default')
            
            if session_id in global_cart:
                global_cart[session_id] = [item for item in global_cart[session_id] if item['id'] != product_id]
            
            return {
            'status': 'success',
            'cart': global_cart.get(session_id, [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cart/update")
async def update_cart_quantity(request: dict):
    """Update item quantity in cart"""
    try:
        session_id = request.get('session_id', 'default')
        product_id = request.get('product_id')
        quantity = request.get('quantity', 1)
        
        if session_id in global_cart:
            item = next((item for item in global_cart[session_id] if item['id'] == product_id), None)
            if item:
                if quantity <= 0:
                    global_cart[session_id].remove(item)
                else:
                    item['quantity'] = quantity
        
        return {
            'status': 'success',
            'cart': global_cart.get(session_id, [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cart/{session_id}")
async def get_cart(session_id: str, authorization: Optional[str] = Header(None)):
    """Get cart contents with UI component"""
    if MONGODB_ENABLED:
        user = get_current_user(authorization)
        if not user:
            return {
                'status': 'error',
                'cart': [],
                'total_items': 0,
                'total_price': 0,
                'message': 'Please login to view your cart',
                'ui_component': 'LoginForm',
                'ui_props': {}
            }
        
        user_id = user["_id"]
        cart = Cart.get_or_create(user_id)
        cart_items = cart['items']
    else:
        cart_items = global_cart.get(session_id, [])
    
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    
    # Format as CheckoutWizard component data
    formatted_cart = []
    for item in cart_items:
        formatted_cart.append({
            'id': item.get('id', ''),
            'name': item.get('name', 'Product'),
            'price': item.get('price', 0),
            'quantity': item.get('quantity', 1),
            'image': item.get('image', 'https://picsum.photos/seed/cart/100/100')
        })
    
    return {
        'status': 'success',
        'cart': cart_items,
        'total_items': sum(item['quantity'] for item in cart_items),
        'total_price': total,
        'ui_component': 'CheckoutWizard',
        'ui_props': {
            'cartItems': formatted_cart,
            'expressMode': False,
            'shippingCost': 0
        }
    }


@app.post("/recommend")
async def recommend_products(request: dict):
    """Get product recommendations based on preferences"""
    try:
        query = request.get('message', '')
        session_id = request.get('session_id', 'default')
        
        # Get user's cart for context
        cart_items = global_cart.get(session_id, [])
        
        # Search for products matching the query
        search_result = search_products(query)
        products = search_result.get('products', [])
        
        # Format recommendations
        recommendations = []
        for p in products[:5]:  # Top 5 recommendations
            try:
                price_str = p.get('price', '$0')
                price_num = float(price_str.replace('$', '')) if '$' in price_str else 0
            except:
                price_num = 0
            
            product_id = p.get('id', 'default')
            image_url = p.get('image') or f'https://picsum.photos/seed/{product_id}/300/300'
            
            recommendations.append({
                'id': product_id,
                'name': p.get('name', 'Product'),
                'price': price_num,
                'image': image_url,
                'description': p.get('description') or p.get('name', 'No description'),
                'rating': 4.5,
                'reason': f"Matches your search for {query}"
            })
        
        return {
            'status': 'success',
            'recommendations': recommendations,
            'message': f"Found {len(recommendations)} recommendations based on your preferences"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/checkout")
async def checkout(request: dict, authorization: Optional[str] = Header(None)):
    """Process checkout - requires authentication"""
    try:
        shipping_info = request.get('shipping_info', {})
        
        if MONGODB_ENABLED:
            # Require authentication for checkout
            user = get_current_user(authorization)
            if not user:
                return {
                    'status': 'error',
                    'message': 'Please login or create an account to checkout',
                    'ui_component': 'LoginForm',
                    'ui_props': {
                        'message': 'You need to login to checkout. Please login or create an account.'
                    }
                }
            
            user_id = user["_id"]
            
            # Get user's cart
            cart = Cart.get_or_create(user_id)
            cart_items = cart['items']
            
            if not cart_items:
                return {
                    'status': 'error',
                    'message': 'Cart is empty'
                }
            
            total = sum(item['price'] * item['quantity'] for item in cart_items)
            
            # Create order in database
            order = Order.create(
                user_id=user_id,
                items=cart_items,
                shipping_info=shipping_info,
                total=total
            )
            
            # Clear cart
            Cart.clear(user_id)
            
            return {
                'status': 'success',
                'order': {
                    'order_id': order['_id'],
                    'items': order['items'],
                    'total': order['total'],
                    'shipping_info': order['shipping_info'],
                    'status': order['status'],
                    'date': order['created_at'].strftime("%Y-%m-%d %H:%M:%S")
                },
                'message': f'Order {order["_id"][:8]} placed successfully!'
            }
        
        else:
            # Fallback to in-memory mode
            session_id = request.get('session_id', 'default')
            
            cart_items = global_cart.get(session_id, [])
            if not cart_items:
                return {
                    'status': 'error',
                    'message': 'Cart is empty'
                }
            
            total = sum(item['price'] * item['quantity'] for item in cart_items)
            
            # Create order
            order_id = f"ORD-{abs(hash(session_id + str(len(cart_items))))}"[-8:]
            
            order = {
                'order_id': order_id,
                'items': cart_items.copy(),
                'total': total,
                'shipping_info': shipping_info,
                'status': 'confirmed',
                'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            
            # Save to order history
            if session_id not in order_history:
                order_history[session_id] = []
            order_history[session_id].append(order)
            
            # Clear cart after checkout
            global_cart[session_id] = []
            
            return {
                'status': 'success',
                'order': order,
                'message': f'Order {order_id} placed successfully!'
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/orders/{session_id}")
async def get_orders(session_id: str, authorization: Optional[str] = Header(None)):
    """Get order history for a user"""
    print(f"\n{'='*80}")
    print(f"📥 GET /orders/{session_id} endpoint called")
    print(f"🔑 Authorization header: {authorization[:50] if authorization else 'None'}...")
    print(f"📊 MongoDB enabled: {MONGODB_ENABLED}")
    print(f"{'='*80}\n")
    
    try:
        if MONGODB_ENABLED:
            print(f"🔄 Getting current user from authorization token...")
            user = get_current_user(authorization)
            print(f"👤 User retrieved: {user['email'] if user else 'None'}")
            print(f"👤 User ID: {user['_id'] if user else 'None'}")
            
            if not user:
                print(f"❌ No user found - returning error response")
                return {
                    'status': 'error',
                    'orders': [],
                    'total_orders': 0,
                    'message': 'Please login to view order history',
                    'ui_component': 'LoginForm',
                    'ui_props': {}
                }
            
            user_id = user["_id"]
            print(f"📥 Fetching orders for user_id: {user_id}")
            orders = Order.get_user_orders(user_id)
            print(f"📦 Raw orders retrieved: {len(orders)}")
            
            for idx, order in enumerate(orders):
                print(f"  📋 Raw Order {idx + 1}: ID={order['_id']}, Items={len(order.get('items', []))}, Total=${order.get('total', 0)}")
            
            # Format for UI
            print(f"🔄 Formatting orders for UI...")
            formatted_orders = []
            for order in orders:
                formatted_orders.append({
                    'orderId': order['_id'][:8],
                    'date': order['created_at'].strftime("%Y-%m-%d %H:%M:%S"),
                    'items': order['items'],
                    'total': order['total'],
                    'status': order['status'],
                    'shipping_info': order.get('shipping_info', {})
                })
            
            return {
                'status': 'success',
                'orders': formatted_orders,
                'total_orders': len(formatted_orders),
                'ui_component': 'OrderHistory',
                'ui_props': {
                    'orders': formatted_orders
                }
            }
        
        else:
            # Fallback to in-memory mode
            orders = order_history.get(session_id, [])
            
            formatted_orders = []
            for order in orders:
                formatted_orders.append({
                    'orderId': order['order_id'],
                    'date': order['date'],
                    'items': order['items'],
                    'total': order['total'],
                    'status': order['status'],
                    'shipping_info': order.get('shipping_info', {})
                })
            return {
                'status': 'success',
                'orders': formatted_orders,
                'total_orders': len(formatted_orders),
                'ui_component': 'OrderHistory',
                'ui_props': {
                    'orders': formatted_orders
                }
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export/pdf")
async def export_order_pdf(request: dict, authorization: str = Header(None)):
    """Generate PDF for order using existing export_agent"""
    try:
        session_id = request.get('session_id', 'default')
        
        print(f"📄 EXPORT PDF - Session: {session_id}")
        print(f"🔑 Authorization header: {authorization[:20] if authorization else 'None'}...")
        print(f"🔧 MONGODB_ENABLED: {MONGODB_ENABLED}")
        
        orders = []
        
        if MONGODB_ENABLED:
            # Get orders from MongoDB
            user = get_current_user(authorization)
            if not user:
                print("❌ User not authenticated!")
                raise HTTPException(status_code=401, detail='Please login to export orders')
            
            print(f"✅ User authenticated: {user.get('email')}")
            orders = Order.get_user_orders(user["_id"])
            print(f"📋 MongoDB orders found: {len(orders)}")
        else:
            # Fallback to in-memory
            orders = order_history.get(session_id, [])
            print(f"📋 In-memory orders found: {len(orders)}")
        
        if not orders:
            print("❌ No orders found!")
            raise HTTPException(status_code=404, detail='No orders found to export')
        
        # Get last order
        order = orders[-1]
        print(f"📦 Exporting order: {order}")
        
        # Format items for PDF (export_agent expects specific structure)
        formatted_items = []
        for item in order.get('items', []):
            formatted_items.append({
                'name': item.get('name', 'Unknown'),
                'price': f"${item.get('price', 0):.2f}",  # String format with $
                'quantity': item.get('quantity', 1),
                'url': item.get('image', 'N/A')  # Use image URL as product URL
            })
        
        # Format shipping address as single string
        shipping = order.get('shipping_info', {})
        shipping_address = f"{shipping.get('name', 'N/A')}, {shipping.get('address', 'N/A')}, {shipping.get('city', 'N/A')} {shipping.get('zip', 'N/A')}"
        
        # Get order ID (MongoDB uses _id, in-memory uses order_id)
        order_id = order.get('order_id') or order.get('_id', 'N/A')
        
        # Format order data to match export_agent expectations
        order_data = {
            'order_number': order_id,
            'items': formatted_items,
            'total_items': len(formatted_items),
            'shipping_address': shipping_address,
            'payment_method': 'Credit Card',
            'status': order.get('status', 'confirmed')
        }
        
        print(f"✅ Formatted order data: {order_data}")
        
        # Use existing export_agent function
        pdf_result = generate_order_pdf(order_data, session_id)
        
        print(f"📄 PDF generation result: {pdf_result.get('status')}")
        
        if pdf_result['status'] == 'success':
            # Return PDF as downloadable response
            pdf_bytes = base64.b64decode(pdf_result['pdf_base64'])
            
            print(f"✅ PDF generated successfully! Size: {len(pdf_bytes)} bytes")
            
            return Response(
                content=pdf_bytes,
                media_type='application/pdf',
                headers={
                    'Content-Disposition': f'attachment; filename="order_{order_data["order_number"]}.pdf"'
                }
            )
        else:
            print(f"❌ PDF generation failed: {pdf_result.get('error_message')}")
            raise HTTPException(status_code=500, detail=pdf_result.get('error_message', 'PDF generation failed'))
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Export error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    print("🚀 Starting Cymbal Shops E-commerce API Server...")
    print("📍 Server: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    print()
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
