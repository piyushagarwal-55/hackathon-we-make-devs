"""
Simplified FastAPI server for E-commerce Agent
Directly uses product search functions without complex agent orchestration
"""

from fastapi import FastAPI, HTTPException
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


class ChatResponse(BaseModel):
    agent_response: str
    ui_component: str
    ui_props: Dict[str, Any]
    ui_reason: Optional[str] = None
    context: Dict[str, Any]


@app.get("/")
async def root():
    return {
        "status": "running",
        "service": "Cymbal Shops E-commerce API",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "components": len(ui_engine.registered_components)
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process chat message and return UI component"""
    try:
        session_id = request.session_id or f"session_{hash(request.message)}"
        
        # Initialize session
        if session_id not in sessions:
            sessions[session_id] = {
                'products': [],
                'cart_items': [],
                'history': []
            }
        
        context = sessions[session_id]
        user_message = request.message
        
        # Search products
        search_result = search_products(user_message)
        
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
                agent_response = f"No products found matching '{user_message}'. Try 'sunglasses', 'shirts', or 'shoes'."
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
            user_message=user_message,
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


@app.get("/components")
async def list_components():
    return {
        "components": ui_engine.registered_components,
        "total": len(ui_engine.registered_components)
    }


# Global cart storage (persistent across sessions)
global_cart: Dict[str, List[Dict]] = {}

# Global order history (persistent across chats, cleared on server restart)
order_history: Dict[str, List[Dict]] = {}


@app.post("/cart/add")
async def add_to_cart(request: dict):
    """Add item(s) to cart"""
    try:
        session_id = request.get('session_id', 'default')
        product_id = request.get('product_id')
        quantity = request.get('quantity', 1)
        product_name = request.get('product_name', 'Product')
        price = request.get('price', 0)
        image = request.get('image', '')
        
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/cart/remove")
async def remove_from_cart(request: dict):
    """Remove item from cart"""
    try:
        session_id = request.get('session_id', 'default')
        product_id = request.get('product_id')
        
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
async def get_cart(session_id: str):
    """Get cart contents"""
    cart_items = global_cart.get(session_id, [])
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    
    return {
        'status': 'success',
        'cart': cart_items,
        'total_items': sum(item['quantity'] for item in cart_items),
        'total_price': total
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
async def checkout(request: dict):
    """Process checkout"""
    try:
        session_id = request.get('session_id', 'default')
        shipping_info = request.get('shipping_info', {})
        
        print(f"🛒 CHECKOUT - Session: {session_id}")
        print(f"📦 Cart items: {global_cart.get(session_id, [])}")
        
        cart_items = global_cart.get(session_id, [])
        if not cart_items:
            print("❌ Cart is empty!")
            return {
                'status': 'error',
                'message': 'Cart is empty'
            }
        
        total = sum(item['price'] * item['quantity'] for item in cart_items)
        
        # Create order
        order_id = f"ORD-{abs(hash(session_id + str(len(cart_items))))}"[-8:]
        
        order = {
            'order_id': order_id,
            'items': cart_items.copy(),  # Make a copy
            'total': total,
            'shipping_info': shipping_info,
            'status': 'confirmed',
            'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Save to order history
        if session_id not in order_history:
            order_history[session_id] = []
        order_history[session_id].append(order)
        
        print(f"✅ Order {order_id} saved! Total orders: {len(order_history[session_id])}")
        print(f"📋 Order history: {order_history}")
        
        # Clear cart after checkout
        global_cart[session_id] = []
        
        return {
            'status': 'success',
            'order': order,
            'message': f'Order {order_id} placed successfully!'
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/orders/{session_id}")
async def get_orders(session_id: str):
    """Get order history for export"""
    try:
        print(f"📊 GET ORDERS - Session: {session_id}")
        print(f"📋 Order history: {order_history}")
        
        orders = order_history.get(session_id, [])
        print(f"✅ Found {len(orders)} orders for session {session_id}")
        
        # Format for export
        export_data = {
            'total_orders': len(orders),
            'orders': orders,
            'export_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return export_data
    except Exception as e:
        print(f"❌ Error getting orders: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/export/pdf")
async def export_order_pdf(request: dict):
    """Generate PDF for order using existing export_agent"""
    try:
        session_id = request.get('session_id', 'default')
        
        print(f"📄 EXPORT PDF - Session: {session_id}")
        print(f"📋 Order history: {order_history}")
        
        orders = order_history.get(session_id, [])
        
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
        
        # Format order data to match export_agent expectations
        order_data = {
            'order_number': order.get('order_id', 'N/A'),
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
