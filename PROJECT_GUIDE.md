# 🛍️ ShopSage - Complete Project Guide

## The AI E-commerce Platform with Generative UI

**Project Name:** ShopSage (formerly Cymbal Shops AI Agent)  
**Hackathon:** "The UI Strikes Back" - GKE Hackathon 2025  
**Tech Stack:** Next.js, Python, FastAPI, Google Gemini AI, Tambo SDK, MediaPipe

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Features & Capabilities](#features--capabilities)
5. [Technical Implementation](#technical-implementation)
6. [User Flows](#user-flows)
7. [Setup & Installation](#setup--installation)
8. [API Documentation](#api-documentation)
9. [Deployment](#deployment)
10. [Future Roadmap](#future-roadmap)

---

## 🎯 Project Overview

### What is ShopSage?

ShopSage is an **AI-powered e-commerce platform** that revolutionizes online shopping through:

- **Conversational Commerce**: Shop using natural language instead of traditional UI
- **Generative UI**: AI dynamically decides which UI components to render
- **Intelligent Agents**: 5 specialized AI agents handle different shopping tasks
- **Real-time Try-On**: Computer vision-powered virtual try-on for eyewear
- **Seamless Experience**: Chat, browse, compare, try-on, and checkout in one flow

### Key Innovation: Generative UI

Unlike traditional e-commerce where users navigate fixed pages, ShopSage **morphs the interface** based on user intent:

- User says "show me cheap options" → Interface transforms to BudgetSlider
- User says "compare them" → Interface transforms to ComparisonTable
- User says "try it on" → Interface transforms to TryOnStudio

This is **true generative UI** - the AI doesn't just respond, it **reshapes your entire interface**.

### Target Users

- **Shoppers**: Anyone who wants a faster, more intuitive shopping experience
- **Developers**: Teams building AI-powered e-commerce platforms
- **Businesses**: E-commerce companies wanting to integrate AI agents

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                     http://localhost:3000                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ WebSocket / HTTP
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Next.js 15 + React 19 + TypeScript                       │ │
│  │  • Tambo SDK Integration                                  │ │
│  │  • 10 Dynamic UI Components                               │ │
│  │  • Real-time Chat Interface                               │ │
│  │  • Authentication & Session Management                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ REST API (JSON)
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  FastAPI Server (Python)                                  │ │
│  │  • Agent Orchestration                                     │ │
│  │  • Tambo UI Decision Engine                               │ │
│  │  • Session Management                                      │ │
│  │  • Database Integration (MongoDB)                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AI AGENTS LAYER                                          │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  1. Product Finder Agent (Gemini 2.5 Flash)         │ │ │
│  │  │  2. Product Recommendation Agent                     │ │ │
│  │  │  3. Order Placement Agent                            │ │ │
│  │  │  4. Virtual Try-On Agent (MediaPipe + OpenCV)        │ │ │
│  │  │  5. Export Data Agent (PDF Generation)              │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Web Scraping / API Calls
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│  • Cymbal Shops (Product Catalog)                               │
│  • Google Gemini API (AI Intelligence)                          │
│  • MongoDB Atlas (Data Storage)                                 │
│  • MediaPipe (Face Detection)                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
User Input → Frontend Chat → API Route → Backend Agent Router
                                              ↓
                                    ┌─────────┴─────────┐
                                    │   Agent Layer     │
                                    │  (Process Intent) │
                                    └─────────┬─────────┘
                                              ↓
                                    ┌─────────┴─────────┐
                                    │  Tambo UI Engine  │
                                    │ (Decide Component)│
                                    └─────────┬─────────┘
                                              ↓
Backend Response: {
    agent_response: "Found 12 sunglasses",
    ui_component: "ProductGrid",
    ui_props: { products: [...] }
}
                                              ↓
Frontend Tambo Renderer → Dynamic UI Render → User Sees Result
```

---

## 🔧 Core Components

### 1. Commerce GenUI SDK

**Location:** `commerce-genui/`

#### What It Is
A **reusable generative UI SDK** that provides the intelligence layer between AI agents and UI components.

#### Key Features
- **10 Pre-built E-commerce Components**
- **Deterministic Pattern Matching** (fast, predictable)
- **Optional AI-Assisted Intent Classification** (for complex cases)
- **Type-Safe with Zod Schemas**
- **Framework Agnostic** (works with any frontend)

#### Components Included

1. **ProductGrid** - Display products in grid layout
   - Props: `products[]`, `columns`, `showAddToCart`
   - Use case: Browse products, search results

2. **BudgetSlider** - Price range filtering
   - Props: `minPrice`, `maxPrice`, `currentRange`, `matchingProducts`
   - Use case: Filter by budget, find deals

3. **ComparisonTable** - Side-by-side product comparison
   - Props: `products[]`, `features[]`, `highlightBest`
   - Use case: Compare specifications, prices, ratings

4. **TryOnStudio** - Virtual try-on interface
   - Props: `productImage`, `enableCamera`, `instructions`
   - Use case: Try sunglasses, clothes, accessories

5. **CheckoutWizard** - Multi-step checkout flow
   - Props: `cartItems[]`, `currentStep`, `expressMode`
   - Use case: Complete purchase, shipping info

6. **OutfitBoard** - Outfit builder/visualizer
   - Props: `baseProduct`, `suggestions[]`, `totalPrice`
   - Use case: Build complete outfits, styling

7. **BundleBuilder** - Create product bundles
   - Props: `baseProduct`, `addOns[]`, `discount`
   - Use case: Bundle deals, accessories

8. **CartOptimizer** - Smart cart recommendations
   - Props: `cartItems[]`, `savings[]`, `suggestions`
   - Use case: Optimize cart, save money

9. **DealPanel** - Flash deals and promotions
   - Props: `deals[]`, `timeRemaining`, `urgencyLevel`
   - Use case: Limited-time offers, sales

10. **PriceChart** - Price history and trends
    - Props: `priceHistory[]`, `currentPrice`, `trend`
    - Use case: Price tracking, best time to buy

#### SDK Architecture

```python
# Core SDK (packages/core/src/core.py)
class CommerceGenUI:
    def __init__(self):
        self.components = {}  # Registered components
        self.rules = []       # Decision rules
        
    def register_component(self, name, schema):
        """Register a new UI component"""
        
    def decide_ui(self, user_message, agent_response, context):
        """Decide which component to render"""
        # 1. Pattern matching (fast path)
        # 2. Context analysis
        # 3. AI-assisted classification (if needed)
        return {
            "component_name": "ProductGrid",
            "props": {...},
            "reason": "User wants to browse products"
        }
```

#### Installation & Usage

```bash
# Install SDK
pip install -e packages/core

# Use in your backend
from commerce_genui import CommerceGenUI

sdk = CommerceGenUI()
decision = sdk.decide_ui(
    user_message="show me cheap laptops",
    agent_response="Found 5 laptops under $500",
    context={"budget": 500}
)
```

---

### 2. Frontend (Next.js Application)

**Location:** `frontend/`

#### Technology Stack
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **UI Components:** shadcn/ui + custom components
- **AI Integration:** Tambo SDK
- **Package Manager:** Bun (fast alternative to npm)

#### Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page
│   │   ├── chat/              # Chat interface
│   │   │   └── page.tsx
│   │   └── api/               # API routes
│   │       └── agent/         # Backend proxy
│   │           └── route.ts
│   │
│   ├── components/            # UI Components
│   │   ├── ui/               # Base components (shadcn)
│   │   ├── chat/             # Chat-specific components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageList.tsx
│   │   │   └── InputBox.tsx
│   │   │
│   │   └── tambo/            # Tambo-rendered components
│   │       ├── ProductGrid.tsx
│   │       ├── BudgetSlider.tsx
│   │       ├── ComparisonTable.tsx
│   │       ├── TryOnStudio.tsx
│   │       ├── CheckoutWizard.tsx
│   │       └── ... (10 total)
│   │
│   ├── contexts/             # React Context
│   │   ├── AuthContext.tsx  # User authentication
│   │   └── CartContext.tsx  # Shopping cart state
│   │
│   ├── services/            # API clients
│   │   └── agentService.ts # Backend API calls
│   │
│   └── lib/                # Utilities
│       ├── tambo.ts        # Tambo SDK initialization
│       └── utils.ts        # Helper functions
│
├── public/                 # Static assets
├── package.json           # Dependencies
├── tsconfig.json         # TypeScript config
└── tailwind.config.ts    # Tailwind config
```

#### Key Files

**1. Tambo Configuration** (`src/lib/tambo.ts`)
```typescript
import { TamboClient } from '@tambo/core';
import { z } from 'zod';

// Initialize Tambo
export const tambo = new TamboClient({
  apiKey: process.env.NEXT_PUBLIC_TAMBO_API_KEY!,
  environment: 'development'
});

// Component schemas
export const productGridSchema = z.object({
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    image: z.string(),
    rating: z.number().optional()
  })),
  columns: z.number().default(3),
  showAddToCart: z.boolean().default(true)
});

// Register components
export const components = [
  {
    name: 'ProductGrid',
    description: 'Display products in a grid layout',
    component: ProductGrid,
    propsSchema: productGridSchema
  },
  // ... 9 more components
];
```

**2. Chat Interface** (`src/app/chat/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { TamboRenderer } from '@tambo/react';
import { components } from '@/lib/tambo';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleSendMessage = async (message: string) => {
    // Send to backend
    const response = await fetch('/api/agent', {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    
    // Update UI with AI decision
    setMessages([...messages, {
      user: message,
      agent: data.agent_response
    }]);
    
    setCurrentComponent({
      name: data.ui_component,
      props: data.ui_props
    });
  };

  return (
    <div className="flex h-screen">
      {/* Chat messages */}
      <div className="w-1/3 border-r">
        <MessageList messages={messages} />
        <InputBox onSend={handleSendMessage} />
      </div>
      
      {/* Dynamic UI */}
      <div className="w-2/3">
        <TamboRenderer
          componentName={currentComponent?.name}
          props={currentComponent?.props}
          components={components}
        />
      </div>
    </div>
  );
}
```

**3. API Route** (`src/app/api/agent/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, session_id } = await req.json();
  
  // Forward to Python backend
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_AGENT_BACKEND_URL}/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id })
    }
  );
  
  const data = await response.json();
  
  return NextResponse.json(data);
}
```

#### Authentication Flow

```
1. User opens app → Check for existing session
2. Click "Login/Signup" → Show LoginForm component
3. Enter credentials → POST /auth/login
4. Backend validates → Returns JWT token
5. Store token in localStorage
6. All subsequent requests include: Authorization: Bearer <token>
7. Backend middleware validates token
8. User data available in context
```

#### Component Rendering Flow

```
User types message
    ↓
ChatInput captures text
    ↓
handleSendMessage() called
    ↓
POST /api/agent with message
    ↓
API route forwards to backend
    ↓
Backend returns: {
    agent_response: "...",
    ui_component: "ProductGrid",
    ui_props: {...}
}
    ↓
Frontend receives response
    ↓
Update messages state (chat history)
    ↓
Update currentComponent state
    ↓
TamboRenderer re-renders
    ↓
New component appears instantly
```

---

### 3. Backend (OnlineBoutiqueAgent)

**Location:** `OnlineBoutiqueAgent/ecommerce_agent/`

#### Technology Stack
- **Framework:** FastAPI (Python 3.10+)
- **AI:** Google Gemini 2.5 Flash
- **Computer Vision:** MediaPipe, OpenCV
- **Database:** MongoDB Atlas
- **Web Scraping:** BeautifulSoup, Requests
- **PDF Generation:** ReportLab
- **Background Removal:** rembg

#### Project Structure

```
OnlineBoutiqueAgent/ecommerce_agent/
├── agents/                          # AI Agent Modules
│   ├── product_finder_agent/
│   │   └── agent.py                # Search & scrape products
│   ├── product_recommendation_agent/
│   │   └── agent.py                # AI recommendations
│   ├── order_placement_agent/
│   │   └── agent.py                # Cart & checkout
│   ├── virtual_tryon_agent/
│   │   ├── gemini_placer.py       # AI placement
│   │   ├── mediapipe_face_detector.py  # Face detection
│   │   └── sunglasses_fixed.png   # Normalized asset
│   └── export_agent/
│       └── agent.py                # PDF generation
│
├── simple_server.py                # Main FastAPI server
├── tambo_ui_engine.py             # UI decision engine
├── database.py                     # MongoDB models
├── auth.py                         # JWT authentication
├── requirements.txt                # Python dependencies
└── .env                           # Environment variables
```

#### Main Server (`simple_server.py`)

**Key Endpoints:**

```python
from fastapi import FastAPI, HTTPException, Header, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Cymbal Shops E-commerce API",
    version="1.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ============== MAIN CHAT ENDPOINT ==============
@app.post("/chat")
async def chat(request: ChatRequest, 
               authorization: Optional[str] = Header(None)):
    """
    Main chat endpoint - handles all user messages
    
    Flow:
    1. Parse user message
    2. Route to appropriate agent
    3. Get agent response
    4. Call UI decision engine
    5. Return response + UI component
    """
    user_message = request.message.lower()
    session_id = request.session_id or generate_session_id()
    
    # Initialize session context
    if session_id not in sessions:
        sessions[session_id] = {
            'products': [],
            'cart_items': [],
            'history': []
        }
    
    context = sessions[session_id]
    
    # Special intents (login, signup, profile, etc.)
    if 'login' in user_message:
        return ChatResponse(
            agent_response="Please login to continue",
            ui_component='LoginForm',
            ui_props={},
            context=context
        )
    
    # Main flow: Search products
    search_result = search_products(request.message)
    
    if search_result['status'] == 'success':
        products = search_result['products']
        context['products'] = products
        agent_response = f"Found {len(products)} products"
    else:
        agent_response = "No products found"
        products = []
    
    # Format for UI
    formatted_products = [
        {
            'id': p['id'],
            'name': p['name'],
            'price': float(p['price'].replace('$', '')),
            'image': p.get('image', 'https://placeholder.com/300'),
            'rating': 4.5,
            'inStock': True
        }
        for p in products
    ]
    
    # Decide UI component
    ui_config = ui_engine.decide_ui_component(
        user_message=request.message,
        agent_response=agent_response,
        context=context
    )
    
    ui_config.props['products'] = formatted_products
    
    return ChatResponse(
        agent_response=agent_response,
        ui_component=ui_config.component_name,
        ui_props=ui_config.props,
        ui_reason=ui_config.reason,
        context=context
    )

# ============== AUTHENTICATION ==============
@app.post("/auth/signup")
async def signup(request: SignupRequest):
    """Create new user account"""
    # Check if user exists
    if User.find_by_email(request.email):
        raise HTTPException(400, "Email already registered")
    
    # Hash password
    hashed_pwd = hash_password(request.password)
    
    # Create user
    user = User.create(
        email=request.email,
        username=request.username,
        hashed_password=hashed_pwd
    )
    
    # Generate JWT
    token = create_access_token(user["_id"], user["email"])
    
    return AuthResponse(
        status="success",
        token=token,
        user={"id": user["_id"], "email": user["email"]}
    )

@app.post("/auth/login")
async def login(request: LoginRequest):
    """Login existing user"""
    user = User.find_by_email(request.email)
    
    if not user or not verify_password(request.password, user["password"]):
        raise HTTPException(401, "Invalid credentials")
    
    token = create_access_token(user["_id"], user["email"])
    
    return AuthResponse(
        status="success",
        token=token,
        user={"id": user["_id"], "email": user["email"]}
    )

# ============== CART MANAGEMENT ==============
@app.post("/cart/add")
async def add_to_cart(request: dict, 
                      authorization: Optional[str] = Header(None)):
    """Add item to cart"""
    user = get_current_user(authorization)
    
    if not user:
        raise HTTPException(401, "Please login")
    
    item = {
        'id': request['product_id'],
        'name': request['product_name'],
        'price': request['price'],
        'quantity': request.get('quantity', 1),
        'image': request.get('image', '')
    }
    
    cart = Cart.add_item(user["_id"], item)
    
    return {
        'status': 'success',
        'cart': cart['items'],
        'total_items': sum(item['quantity'] for item in cart['items'])
    }

@app.get("/cart/{session_id}")
async def get_cart(session_id: str, 
                   authorization: Optional[str] = Header(None)):
    """Get cart contents"""
    user = get_current_user(authorization)
    
    if user:
        cart = Cart.get_or_create(user["_id"])
        cart_items = cart['items']
    else:
        cart_items = global_cart.get(session_id, [])
    
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    
    return {
        'status': 'success',
        'cart': cart_items,
        'total_price': total,
        'ui_component': 'CheckoutWizard',
        'ui_props': {
            'cartItems': cart_items,
            'expressMode': False
        }
    }

# ============== CHECKOUT ==============
@app.post("/checkout")
async def checkout(request: dict, 
                   authorization: Optional[str] = Header(None)):
    """Process checkout"""
    user = get_current_user(authorization)
    
    if not user:
        return {
            'status': 'error',
            'message': 'Please login to checkout',
            'ui_component': 'LoginForm'
        }
    
    cart = Cart.get_or_create(user["_id"])
    
    if not cart['items']:
        raise HTTPException(400, "Cart is empty")
    
    total = sum(item['price'] * item['quantity'] for item in cart['items'])
    
    # Create order
    order = Order.create(
        user_id=user["_id"],
        items=cart['items'],
        shipping_info=request.get('shipping_info', {}),
        total=total
    )
    
    # Clear cart
    Cart.clear(user["_id"])
    
    return {
        'status': 'success',
        'order': {
            'order_id': order['_id'],
            'total': order['total'],
            'status': order['status']
        }
    }

# ============== VIRTUAL TRY-ON ==============
@app.post("/virtual-tryon")
async def virtual_tryon(
    user_image: UploadFile = File(...),
    product_id: str = Form(...)
):
    """
    Virtual try-on endpoint
    
    Process:
    1. Load user image
    2. Fetch product from Cymbal Shops
    3. Use pre-normalized sunglasses_fixed.png
    4. Detect face landmarks (MediaPipe)
    5. Calculate placement (deterministic geometry)
    6. Overlay product on face
    7. Return result image
    """
    # Read user image
    user_image_bytes = await user_image.read()
    
    # Get product
    product_url = f"https://cymbal-shops.retail.cymbal.dev/product/{product_id}"
    response = requests.get(product_url)
    soup = BeautifulSoup(response.content, 'html.parser')
    product_name = soup.find('h2').get_text(strip=True)
    
    # Check if eyewear
    is_eyewear = any(k in product_name.lower() 
                     for k in ['glasses', 'sunglasses'])
    
    if is_eyewear:
        # Load pre-normalized asset
        glasses_path = os.path.join(
            os.path.dirname(__file__),
            'agents/virtual_tryon_agent/sunglasses_fixed.png'
        )
        with open(glasses_path, 'rb') as f:
            product_image_clean = f.read()
    
    # Detect face
    from agents.virtual_tryon_agent.mediapipe_face_detector import MediaPipeFaceDetector
    
    detector = MediaPipeFaceDetector()
    eye_data = detector.detect_eyes(user_image_bytes)
    
    if not eye_data:
        raise HTTPException(400, "No face detected")
    
    # Calculate placement (deterministic)
    nose_x, nose_y = eye_data['nose_bridge']
    eye_distance = eye_data['eye_distance']
    angle = eye_data['angle']
    
    # Calibrated constants
    WIDTH_MULTIPLIER = 1.9
    X_OFFSET = -18
    Y_OFFSET = -22
    
    # Calculate size
    ideal_width = eye_distance * WIDTH_MULTIPLIER
    product_img = Image.open(io.BytesIO(product_image_clean))
    scale = ideal_width / product_img.width
    
    # Calculate position
    final_x = nose_x + X_OFFSET
    final_y = nose_y + Y_OFFSET
    
    placement = {
        'x': final_x,
        'y': final_y,
        'scale': scale,
        'rotation': int(angle)
    }
    
    # Overlay
    from agents.virtual_tryon_agent.gemini_placer import GeminiPlacer
    
    final_image = GeminiPlacer.overlay_object(
        background_image_bytes=user_image_bytes,
        object_image_bytes=glasses_path,
        placement=placement
    )
    
    # Convert to base64
    buffer = io.BytesIO()
    final_image.save(buffer, 'PNG')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    
    return {
        "status": "success",
        "result_image": image_base64,
        "product_name": product_name,
        "placement": placement
    }

# ============== PDF EXPORT ==============
@app.post("/export/pdf")
async def export_order_pdf(request: dict, 
                           authorization: str = Header(None)):
    """Generate PDF for order"""
    user = get_current_user(authorization)
    
    if not user:
        raise HTTPException(401, "Please login")
    
    orders = Order.get_user_orders(user["_id"])
    
    if not orders:
        raise HTTPException(404, "No orders found")
    
    # Get last order
    order = orders[-1]
    
    # Format for PDF
    order_data = {
        'order_number': order['_id'],
        'items': [
            {
                'name': item['name'],
                'price': f"${item['price']:.2f}",
                'quantity': item['quantity']
            }
            for item in order['items']
        ],
        'shipping_address': format_address(order['shipping_info']),
        'status': order['status']
    }
    
    # Generate PDF
    from agents.export_agent.agent import generate_order_pdf
    pdf_result = generate_order_pdf(order_data, user["_id"])
    
    if pdf_result['status'] == 'success':
        pdf_bytes = base64.b64decode(pdf_result['pdf_base64'])
        
        return Response(
            content=pdf_bytes,
            media_type='application/pdf',
            headers={
                'Content-Disposition': f'attachment; filename="order_{order["_id"]}.pdf"'
            }
        )
    else:
        raise HTTPException(500, "PDF generation failed")
```

#### Tambo UI Decision Engine (`tambo_ui_engine.py`)

```python
class TamboUIDecisionEngine:
    """
    Intelligent UI component selection engine
    Uses pattern matching + context analysis
    """
    
    def __init__(self):
        self.registered_components = [
            "ProductGrid",
            "BudgetSlider",
            "ComparisonTable",
            "TryOnStudio",
            "CheckoutWizard",
            "OutfitBoard",
            "BundleBuilder",
            "CartOptimizer",
            "DealPanel",
            "PriceChart"
        ]
        
        # Decision rules (priority order)
        self.rules = [
            # 1. Intent-based (highest priority)
            {
                'keywords': ['login', 'sign in', 'sign up'],
                'component': 'LoginForm',
                'priority': 100
            },
            {
                'keywords': ['try on', 'wear', 'how would it look'],
                'component': 'TryOnStudio',
                'priority': 95
            },
            {
                'keywords': ['checkout', 'buy now', 'purchase'],
                'component': 'CheckoutWizard',
                'priority': 90
            },
            {
                'keywords': ['compare', 'vs', 'difference'],
                'component': 'ComparisonTable',
                'priority': 85
            },
            # 2. Filter-based
            {
                'keywords': ['cheap', 'budget', 'under', 'price range'],
                'component': 'BudgetSlider',
                'priority': 80
            },
            # 3. Visualization
            {
                'keywords': ['outfit', 'style', 'match', 'goes with'],
                'component': 'OutfitBoard',
                'priority': 75
            },
            {
                'keywords': ['bundle', 'package', 'together'],
                'component': 'BundleBuilder',
                'priority': 70
            },
            # 4. Default (show products)
            {
                'keywords': ['show', 'find', 'search', 'get', 'products'],
                'component': 'ProductGrid',
                'priority': 50
            }
        ]
    
    def decide_ui_component(self, user_message: str, 
                           agent_response: str, 
                           context: dict) -> UIConfig:
        """
        Main decision logic
        
        Args:
            user_message: User's input text
            agent_response: Agent's response text
            context: Session context (cart, products, etc.)
            
        Returns:
            UIConfig with component name, props, and reason
        """
        user_lower = user_message.lower()
        
        # Apply rules in priority order
        for rule in sorted(self.rules, key=lambda x: x['priority'], reverse=True):
            if any(keyword in user_lower for keyword in rule['keywords']):
                component_name = rule['component']
                
                # Generate props based on component
                props = self._generate_props(
                    component_name, 
                    context
                )
                
                return UIConfig(
                    component_name=component_name,
                    props=props,
                    reason=f"User intent detected: {rule['keywords'][0]}"
                )
        
        # Fallback
        return UIConfig(
            component_name='ProductGrid',
            props={'products': context.get('products', [])},
            reason='Default view'
        )
    
    def _generate_props(self, component_name: str, 
                       context: dict) -> dict:
        """Generate component-specific props"""
        
        if component_name == 'ProductGrid':
            return {
                'products': context.get('products', []),
                'columns': 3,
                'showAddToCart': True
            }
        
        elif component_name == 'BudgetSlider':
            products = context.get('products', [])
            prices = [float(p['price'].replace('$', '')) 
                     for p in products if 'price' in p]
            return {
                'minPrice': min(prices) if prices else 0,
                'maxPrice': max(prices) if prices else 100,
                'currentRange': [min(prices), max(prices)],
                'matchingProducts': len(products)
            }
        
        elif component_name == 'ComparisonTable':
            products = context.get('products', [])[:3]
            return {
                'products': products,
                'features': ['price', 'rating', 'category'],
                'highlightBest': True
            }
        
        elif component_name == 'CheckoutWizard':
            cart_items = context.get('cart_items', [])
            return {
                'cartItems': cart_items,
                'currentStep': 'review',
                'expressMode': False,
                'shippingCost': 0
            }
        
        # ... more component prop generators
        
        return {}
```

#### Database Models (`database.py`)

```python
from pymongo import MongoClient
from datetime import datetime
import os

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
client = MongoClient(MONGODB_URI)
db = client["shopsage"]

class User:
    """User model"""
    
    @staticmethod
    def create(email: str, username: str, hashed_password: str):
        """Create new user"""
        user_doc = {
            "email": email,
            "username": username,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "full_name": "",
            "phone": "",
            "address": ""
        }
        
        result = db.users.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        return user_doc
    
    @staticmethod
    def find_by_email(email: str):
        """Find user by email"""
        user = db.users.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])
        return user
    
    @staticmethod
    def find_by_id(user_id: str):
        """Find user by ID"""
        from bson import ObjectId
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
        return user

class Cart:
    """Shopping cart model"""
    
    @staticmethod
    def get_or_create(user_id: str):
        """Get or create cart for user"""
        cart = db.carts.find_one({"user_id": user_id})
        
        if not cart:
            cart = {
                "user_id": user_id,
                "items": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            db.carts.insert_one(cart)
        
        cart["_id"] = str(cart["_id"])
        return cart
    
    @staticmethod
    def add_item(user_id: str, item: dict):
        """Add item to cart"""
        cart = Cart.get_or_create(user_id)
        
        # Check if item exists
        existing_item = next(
            (i for i in cart['items'] if i['id'] == item['id']),
            None
        )
        
        if existing_item:
            # Update quantity
            db.carts.update_one(
                {"user_id": user_id, "items.id": item['id']},
                {"$inc": {"items.$.quantity": item['quantity']}}
            )
        else:
            # Add new item
            db.carts.update_one(
                {"user_id": user_id},
                {"$push": {"items": item}}
            )
        
        return Cart.get_or_create(user_id)
    
    @staticmethod
    def clear(user_id: str):
        """Clear cart"""
        db.carts.update_one(
            {"user_id": user_id},
            {"$set": {"items": []}}
        )

class Order:
    """Order model"""
    
    @staticmethod
    def create(user_id: str, items: list, 
               shipping_info: dict, total: float):
        """Create new order"""
        order_doc = {
            "user_id": user_id,
            "items": items,
            "shipping_info": shipping_info,
            "total": total,
            "status": "confirmed",
            "created_at": datetime.utcnow()
        }
        
        result = db.orders.insert_one(order_doc)
        order_doc["_id"] = str(result.inserted_id)
        return order_doc
    
    @staticmethod
    def get_user_orders(user_id: str):
        """Get all orders for user"""
        orders = list(db.orders.find({"user_id": user_id}))
        
        for order in orders:
            order["_id"] = str(order["_id"])
        
        return orders
```

#### Authentication (`auth.py`)

```python
import bcrypt
import jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
TOKEN_EXPIRY_HOURS = 24

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(
        password.encode('utf-8'), 
        hashed.encode('utf-8')
    )

def create_access_token(user_id: str, email: str) -> str:
    """Create JWT access token"""
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRY_HOURS),
        "iat": datetime.utcnow()
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_access_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
```

---

## 🎨 Features & Capabilities

### 1. Conversational Product Search

**How it works:**
```
User: "Show me sunglasses"
    ↓
Product Finder Agent activates
    ↓
Scrapes Cymbal Shops catalog
    ↓
Returns: [
    { id: "OLJCESPC7Z", name: "Aviator Classic", price: "$19.99", ... },
    { id: "LS4PSXUNUM", name: "Wayframe Bold", price: "$24.99", ... }
]
    ↓
UI Engine decides: ProductGrid
    ↓
Tambo renders grid of product cards
```

**Key Features:**
- Natural language search
- Real-time web scraping
- Image extraction
- Price parsing
- Stock availability

### 2. Budget-Aware Shopping (🔥 UI Morphing Moment #1)

**Trigger:** User mentions price/budget
**Examples:** "show me cheap options", "under $50", "budget products"

**What happens:**
```
User: "show me cheap options"
    ↓
UI Engine detects "cheap" keyword
    ↓
Analyzes product prices in context
    ↓
Decides to render BudgetSlider
    ↓
⚡ UI MORPHS from ProductGrid to BudgetSlider
    ↓
User sees: Interactive price range slider with:
  • Min/max price bounds
  • Current range selector
  • Live product count
  • Quick presets ($0-$25, $25-$50, etc.)
```

**Component Props:**
```typescript
{
  minPrice: 0,
  maxPrice: 100,
  currentRange: [0, 50],
  matchingProducts: 8,
  products: [...],
  currency: "USD"
}
```

### 3. Product Comparison (🔥 UI Morphing Moment #2)

**Trigger:** User wants to compare
**Examples:** "compare them", "which is better", "show differences"

**What happens:**
```
User: "compare the top 3"
    ↓
UI Engine detects "compare"
    ↓
Extracts top 3 products from context
    ↓
Decides to render ComparisonTable
    ↓
⚡ UI MORPHS from ProductGrid to ComparisonTable
    ↓
User sees: Side-by-side comparison with:
  • Product images
  • Specs in rows (price, rating, features)
  • Highlighted "best" values
  • "Add to cart" buttons
```

**Component Props:**
```typescript
{
  products: [product1, product2, product3],
  features: ['price', 'rating', 'color', 'material'],
  highlightBest: true,
  allowAddToCart: true
}
```

### 4. Virtual Try-On (🔥 UI Morphing Moment #3)

**Trigger:** User wants to try product
**Examples:** "try it on", "how would it look on me", "let me see"

**Technology Stack:**
- **Face Detection:** MediaPipe Face Mesh (468 landmarks)
- **Image Processing:** OpenCV, Pillow
- **Placement:** Deterministic geometry (no AI guessing)
- **Assets:** Pre-normalized product images

**Process:**

```
1. USER ACTION
   User clicks "Try On" or says "try it on"
   
2. FRONTEND
   Opens camera or file upload
   Captures user photo
   
3. BACKEND REQUEST
   POST /virtual-tryon
   Body: { user_image: File, product_id: "OLJCESPC7Z" }
   
4. IMAGE UPSCALING (Fix #1)
   Original: 321×240px → Upscaled: 800×600px
   Why: MediaPipe needs larger images for accurate landmarks
   Result: Eye distance 120-180px instead of 21px
   
5. FACE DETECTION (MediaPipe)
   Detects 468 facial landmarks
   Key points:
     • Left eye: landmarks 33, 133
     • Right eye: landmarks 263, 362
     • Nose bridge: landmark 168 (CRITICAL anchor)
     
6. COORDINATE EXTRACTION
   left_eye_center = ((lx1 + lx2)/2, (ly1 + ly2)/2)
   right_eye_center = ((rx1 + rx2)/2, (ry1 + ry2)/2)
   nose_bridge = (nx, ny)
   
7. GEOMETRY CALCULATION
   eye_distance = sqrt((rx - lx)² + (ry - ly)²)
   face_angle = arctan2(ry - ly, rx - lx)
   
8. ANGLE CLAMPING (Fix: rotation stability)
   if |angle| < 10°:
       angle = 0
   
   Why: Small angles (<10°) are noise, not real head tilt
   Humans wear glasses straight even with slight asymmetry
   
9. SIZE CALCULATION (Fix: width scaling)
   WIDTH_MULTIPLIER = 1.9
   ideal_width = eye_distance × 1.9
   scale = ideal_width / product_width
   
   Why: Ratio 1.9 matches aviator sunglasses proportions
   Human IPD ≈ 63mm, Frame width ≈ 120mm → 1.9x
   
10. POSITION CALCULATION (Fix: offset calibration)
    X_OFFSET = -18  (shift left for optical center)
    Y_OFFSET = -22  (move up, glasses sit above bridge)
    
    final_x = nose_x + X_OFFSET
    final_y = nose_y + Y_OFFSET
    
    Why: MediaPipe nose bridge is lower than actual glasses
    Product PNG optical center may be off-center
    
11. PLACEMENT OBJECT
    placement = {
        'x': final_x,
        'y': final_y,
        'scale': scale,
        'rotation': angle
    }
    
12. OVERLAY
    Load normalized asset (sunglasses_fixed.png)
    Resize by scale factor
    Rotate by angle (only if >10°)
    Paste at (final_x, final_y) with transparency
    
13. RESULT
    Returns base64-encoded PNG
    Frontend displays overlaid image
    User sees themselves wearing the product!
```

**Calibration Constants:**
```python
# Production values (tuned for sunglasses_fixed.png)
WIDTH_MULTIPLIER = 1.9   # Glasses width = eye_distance × 1.9
X_OFFSET = -18           # Shift left 18px (optical center)
Y_OFFSET = -22           # Move up 22px (above nose bridge)
ANGLE_THRESHOLD = 10     # Clamp angles < 10° to zero
```

**Why Deterministic > AI:**
```
Gemini Placement (❌):
- Guesses position based on image
- Inconsistent results
- Slow (API call)
- Costs money per request

Deterministic Geometry (✅):
- Precise landmark-based math
- Consistent every time
- Fast (runs on CPU)
- Free (no API calls)
- Production-quality AR
```

### 5. Smart Shopping Cart

**Features:**
- Add items via chat: "add 3 sunglasses"
- Add items via button click
- Persistent across sessions (if logged in)
- Real-time total calculation
- Quantity management

**Cart Flow:**
```
1. ADD TO CART
   User: "add aviator sunglasses to cart"
   Backend: Parses product name, finds match, adds to cart
   OR
   User: Clicks "Add to Cart" button
   Frontend: Sends product_id to backend
   
2. BACKEND STORAGE
   If logged in:
     → Store in MongoDB (Cart collection)
     → Persistent across devices
   If not logged in:
     → Store in session memory
     → Lost on server restart
     
3. CART UPDATING
   POST /cart/add
   {
     "product_id": "OLJCESPC7Z",
     "product_name": "Aviator Classic",
     "price": 19.99,
     "quantity": 1,
     "image": "https://..."
   }
   
4. VIEW CART
   User: "show my cart"
   Backend: Retrieves cart items
   UI Engine: Decides CheckoutWizard
   Frontend: Renders cart summary with:
     • Item list (name, price, quantity)
     • Subtotal
     • Shipping cost
     • Total
     • "Proceed to Checkout" button
```

### 6. Intelligent Checkout (🔥 UI Morphing Moment #4)

**Trigger:** User wants to complete purchase
**Examples:** "checkout", "buy now", "complete order"

**Special: Express Mode**
```
User: "checkout fast" or "express checkout"
    ↓
UI Engine detects "fast"/"express"
    ↓
Sets: expressMode = true
    ↓
CheckoutWizard skips to final step
    ↓
User sees: One-page checkout (no multi-step wizard)
```

**Checkout Process:**
```
1. REVIEW CART
   Step 1 of 3: Review items
   • Product list
   • Edit quantities
   • Remove items
   
2. SHIPPING INFO
   Step 2 of 3: Enter address
   Natural language supported:
   "Ship to John Doe, 123 Main St, New York 10001"
   Backend extracts:
     • name: "John Doe"
     • address: "123 Main St"
     • city: "New York"
     • zip: "10001"
     
3. PAYMENT (Simulated)
   Step 3 of 3: Payment method
   • Credit card form (demo only)
   • "Place Order" button
   
4. ORDER CREATION
   POST /checkout
   {
     "shipping_info": {...},
     "payment_method": "Credit Card"
   }
   
   Backend:
   • Creates Order document in MongoDB
   • Clears cart
   • Generates order ID
   • Returns confirmation
   
5. CONFIRMATION
   UI shows:
   • Order number
   • Expected delivery
   • "Download PDF" button
```

### 7. Order History & Profile

**Features:**
- View past orders
- Download order PDFs
- Update profile info
- Track order status

**Flow:**
```
User: "show my orders"
    ↓
Check if authenticated
    ↓
If not logged in:
  → Show LoginForm
If logged in:
  → Fetch from MongoDB
  → Format orders
  → Render OrderHistory component
    ↓
User sees:
  • List of past orders
  • Order details (items, total, date)
  • Status (confirmed, shipped, delivered)
  • "Download PDF" buttons
```

### 8. PDF Export (Professional Invoices)

**Technology:** ReportLab (Python PDF library)

**Process:**
```
1. USER ACTION
   Clicks "Export PDF" button
   
2. BACKEND
   POST /export/pdf
   { "order_id": "673f8a2b..." }
   
3. PDF GENERATION
   Uses ReportLab to create professional invoice:
   • Company header (Cymbal Shops logo)
   • Order number & date
   • Customer info (name, address)
   • Item table (name, qty, price, subtotal)
   • Totals (subtotal, shipping, tax, grand total)
   • Footer (thank you message, support)
   
4. RETURN PDF
   Response: PDF file (application/pdf)
   Headers: Content-Disposition: attachment
   
5. FRONTEND
   Browser downloads file: "order_673f8a2b.pdf"
   User can print/save
```

### 9. Product Recommendations

**AI-Powered:** Uses Gemini to analyze preferences

**Trigger Examples:**
- "recommend something"
- "what else should I buy"
- "suggestions based on my cart"

**Process:**
```
1. ANALYZE CONTEXT
   Cart items: [sunglasses, belt]
   Browse history: [shoes, watches]
   
2. GEMINI PROMPT
   "Based on customer cart: sunglasses ($20), belt ($15),
   and browse history: shoes, watches,
   recommend 3-5 complementary products from Cymbal Shops"
   
3. AI RESPONSE
   "Recommended products:
   1. Classic Watch ($50) - matches belt style
   2. Leather Wallet ($25) - complements accessories
   3. Canvas Sneakers ($35) - casual style match"
   
4. PRODUCT SEARCH
   Backend searches for each recommended item
   Fetches real products from Cymbal Shops
   
5. UI RENDER
   Component: ProductGrid
   Props: { products: [...], reason: "AI Recommendations" }
```

### 10. Outfit Builder (🔥 UI Morphing Moment #5)

**Trigger:** User wants complete outfit
**Examples:** "build an outfit", "what goes with this", "style suggestion"

**What happens:**
```
User: "what goes with these sunglasses"
    ↓
UI Engine detects "goes with"
    ↓
Takes current product as base
    ↓
AI generates outfit suggestions
    ↓
⚡ UI MORPHS to OutfitBoard
    ↓
User sees: Visual outfit board with:
  • Base product (center)
  • Suggested items (around it)
  • Total outfit price
  • "Add All to Cart" button
```

---

## 🛠️ Technical Implementation

### Virtual Try-On Deep Dive

#### Problem Statement
Traditional virtual try-on solutions:
- Expensive (GPU required)
- Slow (diffusion models take 10-30 seconds)
- Inaccurate (AI hallucinates placement)
- Complex (requires ML expertise)

**Our Solution:** CPU-based deterministic geometry
- Fast (< 1 second)
- Accurate (professional AR quality)
- Free (no API costs)
- Simple (no ML training needed)

#### MediaPipe Face Mesh

**What it does:**
Detects 468 facial landmarks in real-time

**Key landmarks for eyewear:**
```python
LEFT_EYE_OUTER = 33    # Left eye outer corner
LEFT_EYE_INNER = 133   # Left eye inner corner
RIGHT_EYE_OUTER = 263  # Right eye outer corner
RIGHT_EYE_INNER = 362  # Right eye inner corner
NOSE_BRIDGE = 168      # Nose bridge (anchor point)
NOSE_TIP = 6           # Nose tip
```

**Landmark extraction:**
```python
def get_landmark(idx):
    landmark = face_landmarks.landmark[idx]
    x_coord = int(landmark.x * w)
    y_coord = int(landmark.y * h)
    # Clamp to prevent out-of-bounds
    x_coord = max(0, min(x_coord, w - 1))
    y_coord = max(0, min(y_coord, h - 1))
    return (x_coord, y_coord)

left_outer = get_landmark(33)
left_inner = get_landmark(133)
right_outer = get_landmark(263)
right_inner = get_landmark(362)
nose_bridge = get_landmark(168)

# Calculate eye centers
left_eye = (
    (left_outer[0] + left_inner[0]) // 2,
    (left_outer[1] + left_inner[1]) // 2
)
right_eye = (
    (right_outer[0] + right_inner[0]) // 2,
    (right_outer[1] + right_inner[1]) // 2
)
```

#### Image Upscaling (Critical Fix)

**Problem:** Small images produce poor landmarks
- 321×240px image → 21px eye distance
- Landmarks too close together
- Inaccurate placement

**Solution:** Upscale before processing
```python
h, w = img.shape[:2]

if w < 800:
    scale = 800 / w
    img = cv2.resize(img, None, fx=scale, fy=scale, 
                     interpolation=cv2.INTER_LINEAR)
    h, w = img.shape[:2]
```

**Result:**
- 321×240px → 800×600px upscale
- Eye distance: 21px → 130px (6x improvement!)
- Much more accurate landmarks

#### Geometry Calculations

**Eye Distance:**
```python
eye_dx = right_eye[0] - left_eye[0]
eye_dy = right_eye[1] - left_eye[1]
eye_distance = sqrt(eye_dx² + eye_dy²)
```

**Face Angle:**
```python
angle = arctan2(eye_dy, eye_dx)  # In radians
angle_degrees = degrees(angle)    # Convert to degrees
```

**Angle Clamping:**
```python
# Small angles are noise, not real tilt
if abs(angle_degrees) < 10:
    angle_degrees = 0
```

Why 10°?
- < 10°: Camera noise, facial asymmetry, expression
- \> 10°: Actual head tilt (ROLL)
- Humans wear glasses straight unless clearly tilted

**Glasses Sizing:**
```python
# Human proportions:
# IPD (interpupillary distance) ≈ 63mm
# Sunglasses frame width ≈ 120mm
# Ratio: 120 / 63 ≈ 1.9

WIDTH_MULTIPLIER = 1.9
ideal_width = eye_distance * WIDTH_MULTIPLIER
scale = ideal_width / product_width

# Example:
# eye_distance = 145px
# product_width = 276px
# ideal_width = 145 × 1.9 = 275.5px
# scale = 275.5 / 276 ≈ 1.0
```

**Position Offsets:**
```python
# Calibrated for sunglasses_fixed.png
X_OFFSET = -18  # Shift left
Y_OFFSET = -22  # Move up

final_x = nose_x + X_OFFSET
final_y = nose_y + Y_OFFSET
```

Why these offsets?
- **X_OFFSET (-18):** Product PNG optical center is right-heavy
- **Y_OFFSET (-22):** MediaPipe nose bridge is lower than actual glasses position

#### Overlay Process

```python
from PIL import Image

# Load normalized product
product_img = Image.open("sunglasses_fixed.png").convert("RGBA")

# Resize
new_width = int(product_width * scale)
new_height = int(product_height * scale)
product_resized = product_img.resize(
    (new_width, new_height),
    Image.Resampling.LANCZOS
)

# Rotate (only if significant tilt)
if angle != 0:
    product_rotated = product_resized.rotate(
        -angle,  # Negative for PIL
        expand=True,
        resample=Image.Resampling.BICUBIC
    )
else:
    product_rotated = product_resized

# Calculate top-left corner from center
top_left_x = final_x - product_rotated.width // 2
top_left_y = final_y - product_rotated.height // 2

# Paste with alpha channel (transparency)
user_img = Image.open(user_image).convert("RGBA")
user_img.paste(product_rotated, (top_left_x, top_left_y), product_rotated)

# Convert to RGB
result = user_img.convert("RGB")
```

#### Asset Normalization

**Problem:** Raw product photos have issues
- Tilted (5-8° off horizontal)
- Background clutter
- Off-center framing
- Perspective distortion

**Solution:** Pre-process assets once
```bash
# 1. Open in image editor
# 2. Rotate to horizontal (measure angle carefully)
# 3. Remove background (use rembg or manual)
# 4. Center frame in canvas
# 5. Save as PNG with transparency
# 6. Name: sunglasses_fixed.png
```

**Result:** Perfect normalized asset
- ✅ Horizontal orientation
- ✅ Transparent background (RGBA)
- ✅ Centered framing
- ✅ No perspective distortion
- ✅ Ready for overlay

**Production tip:** Create normalized assets for all products upfront
- One-time manual work
- Runtime code is simple
- No rotation/correction needed
- Consistent results

---

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  username: "johndoe",
  password: "$2b$12$...",  // bcrypt hash
  full_name: "John Doe",
  phone: "+1-555-0123",
  address: "123 Main St, New York, NY 10001",
  created_at: ISODate("2025-01-15T10:30:00Z")
}
```

#### Carts Collection
```javascript
{
  _id: ObjectId("..."),
  user_id: "user_id_here",
  items: [
    {
      id: "OLJCESPC7Z",
      name: "Aviator Classic",
      price: 19.99,
      quantity: 2,
      image: "https://..."
    },
    {
      id: "LS4PSXUNUM",
      name: "Wayframe Bold",
      price: 24.99,
      quantity: 1,
      image: "https://..."
    }
  ],
  created_at: ISODate("2025-01-15T10:35:00Z"),
  updated_at: ISODate("2025-01-15T10:40:00Z")
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId("..."),
  user_id: "user_id_here",
  items: [
    {
      id: "OLJCESPC7Z",
      name: "Aviator Classic",
      price: 19.99,
      quantity: 2
    }
  ],
  shipping_info: {
    name: "John Doe",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "+1-555-0123"
  },
  total: 39.98,
  status: "confirmed",  // "confirmed", "shipped", "delivered"
  created_at: ISODate("2025-01-15T10:45:00Z")
}
```

---

## 📖 User Flows

### Flow 1: First-Time User Journey

```
1. USER OPENS APP
   → Lands on homepage
   → Sees: Chat interface + welcome message
   
2. USER ASKS QUESTION
   "show me sunglasses"
   
3. PRODUCT DISCOVERY
   → Backend scrapes Cymbal Shops
   → Returns 12 sunglasses
   → UI renders ProductGrid
   → User sees: Grid of product cards
   
4. FILTER BY BUDGET
   "show me cheap options"
   → ⚡ UI MORPHS to BudgetSlider
   → User adjusts slider to $0-$25
   → 5 products match
   
5. COMPARE PRODUCTS
   "compare top 3"
   → ⚡ UI MORPHS to ComparisonTable
   → User sees: Side-by-side specs
   → Picks favorite
   
6. TRY ON
   "try the first one on"
   → ⚡ UI MORPHS to TryOnStudio
   → User uploads photo
   → Sees: Themselves wearing sunglasses
   → Loves it!
   
7. ADD TO CART
   "add it to my cart"
   → Backend: Adds product to session cart
   → Shows: "Added! Cart: 1 item"
   
8. CHECKOUT
   "checkout"
   → System: "Please login to checkout"
   → UI shows: LoginForm
   
9. CREATE ACCOUNT
   User enters:
     • Email: john@example.com
     • Username: johndoe
     • Password: ••••••••
   → Backend creates account
   → Returns JWT token
   → Now logged in!
   
10. COMPLETE CHECKOUT
    → ⚡ UI MORPHS to CheckoutWizard
    → Step 1: Review cart
    → Step 2: Enter shipping
      "Ship to John Doe, 123 Main St, NYC 10001"
    → Step 3: Payment (demo)
    → Click "Place Order"
    
11. ORDER CONFIRMATION
    → Order created in database
    → Shows: Order #abc123
    → "Download PDF" button
    
12. DOWNLOAD INVOICE
    → Clicks button
    → Downloads professional PDF
    → can print/save
```

### Flow 2: Returning User Journey

```
1. USER RETURNS
   → Opens app
   → Already logged in (JWT stored)
   
2. VIEW PROFILE
   "show my profile"
   → UI shows: UserProfile component
   → Displays:
     • User info
     • Cart items: 1
     • Past orders: 3
     
3. VIEW ORDERS
   "show my orders"
   → ⚡ UI MORPHS to OrderHistory
   → User sees: List of 3 past orders
   → Each with: Date, items, total, status
   
4. REORDER
   Clicks "Reorder" on past order
   → Adds items back to cart
   → Ready to checkout again
   
5. BROWSE NEW PRODUCTS
   "show me shirts"
   → New search starts
   → ProductGrid updates
   
6. BUILD OUTFIT
   "what goes with this shirt"
   → ⚡ UI MORPHS to OutfitBoard
   → AI suggests: Pants, shoes, watch
   → Shows: Complete outfit visualization
   → Total: $95
   
7. ADD OUTFIT
   "add all to cart"
   → Adds 4 items
   → Cart now: 5 items
   
8. EXPRESS CHECKOUT
   "checkout fast"
   → ⚡ UI MORPHS to CheckoutWizard (express mode)
   → One-page checkout
   → Uses saved address
   → One click: "Place Order"
   → Done in 10 seconds!
```

### Flow 3: Virtual Try-On Journey

```
1. BROWSE EYEWEAR
   "show me sunglasses"
   → ProductGrid displays 12 options
   
2. SELECT PRODUCT
   Clicks on "Aviator Classic"
   → Product details appear
   → "Try On" button visible
   
3. OPEN TRY-ON
   Clicks "Try On"
   → ⚡ UI MORPHS to TryOnStudio
   → Shows: Camera/upload options
   
4. UPLOAD PHOTO
   User uploads selfie
   → File: me.jpg (321×240px)
   
5. BACKEND PROCESSING
   a. Image upscaling
      321×240px → 800×600px
      
   b. Face detection
      MediaPipe finds 468 landmarks
      Extracts: eyes, nose bridge
      
   c. Geometry calculation
      eye_distance = 145px
      angle = -3° (clamped to 0°)
      
   d. Size calculation
      ideal_width = 145 × 1.9 = 275.5px
      scale = 275.5 / 276 = 0.998
      
   e. Position calculation
      nose_x = 427px
      nose_y = 300px
      final_x = 427 + (-18) = 409px
      final_y = 300 + (-22) = 278px
      
   f. Overlay
      Load sunglasses_fixed.png
      Resize by scale
      No rotation (angle = 0)
      Paste at (409, 278)
      
   g. Return result
      Base64-encoded PNG
      
6. DISPLAY RESULT
   Frontend shows: User wearing sunglasses
   User reaction: "Wow, it fits perfectly!"
   
7. TRY DIFFERENT ANGLES
   "Can I try with a tilted head?"
   → User uploads new photo (head tilted 15°)
   → System detects angle = 15°
   → Glasses rotate to match
   → Perfect alignment again!
   
8. SATISFIED
   "I love it, add to cart"
   → Product added
   → Continues shopping
```

---

## 🚀 Setup & Installation

### Prerequisites

```bash
# Required software
- Python 3.10 or higher
- Node.js 18+ or Bun
- MongoDB (local or Atlas)
- Git

# API Keys needed
- Google Gemini API key (free tier available)
- Tambo API key (for frontend)
```

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/shopsage.git
cd shopsage
```

#### 2. Backend Setup

```bash
# Navigate to backend
cd OnlineBoutiqueAgent/ecommerce_agent

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "GOOGLE_API_KEY=your_gemini_api_key_here" > .env
echo "GEMINI_API_KEY=your_gemini_api_key_here" >> .env
echo "MONGODB_URI=mongodb://localhost:27017" >> .env
echo "JWT_SECRET_KEY=your_secret_key_here" >> .env

# Run server
python simple_server.py
```

Expected output:
```
🚀 Starting Cymbal Shops E-commerce API Server...
📍 Server: http://localhost:8000
📖 Docs: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

#### 3. Frontend Setup

```bash
# New terminal
cd frontend

# Install dependencies (using bun)
bun install
# Or with npm
npm install

# Create .env.local
echo "NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key_here" > .env.local
echo "NEXT_PUBLIC_AGENT_BACKEND_URL=http://localhost:8000" >> .env.local

# Run development server
bun dev
# Or with npm
npm run dev
```

Expected output:
```
  ▲ Next.js 15.0.0
  - Local:        http://localhost:3000
  - Ready in 1.2s
```

#### 4. MongoDB Setup (Optional)

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath /path/to/data
```

**Option B: MongoDB Atlas (Cloud)**
```bash
# 1. Create account at https://cloud.mongodb.com
# 2. Create cluster (free tier)
# 3. Get connection string
# 4. Update .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopsage
```

#### 5. Verify Installation

```bash
# Test backend
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "components": 10
}

# Test frontend
# Open browser: http://localhost:3000
# Should see chat interface
```

### Quick Start Scripts

We provide convenience scripts for easy startup:

**Windows (`start-backend.ps1`):**
```powershell
# Start backend server
cd "d:\ai bharat prof\OnlineBoutiqueAgent\ecommerce_agent"
& "D:/ai bharat prof/.venv/Scripts/python.exe" simple_server.py
```

**Windows (`start-frontend.ps1`):**
```powershell
# Start frontend server
cd "d:\ai bharat prof\frontend"
bun dev
```

**Usage:**
```powershell
# Terminal 1
.\start-backend.ps1

# Terminal 2
.\start-frontend.ps1
```

### Environment Variables Reference

**Backend (`.env`):**
```bash
# AI
GOOGLE_API_KEY=your_gemini_api_key          # Required
GEMINI_API_KEY=your_gemini_api_key          # Fallback

# Database
MONGODB_URI=mongodb://localhost:27017       # Optional (in-memory fallback)

# Authentication
JWT_SECRET_KEY=your_secret_key              # Required for auth

# Server
PORT=8000                                   # Optional (default: 8000)
```

**Frontend (`.env.local`):**
```bash
# Tambo
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_key    # Required

# Backend
NEXT_PUBLIC_AGENT_BACKEND_URL=http://localhost:8000  # Required

# Optional
NEXT_PUBLIC_DEBUG=false                     # Debug mode
```

### Troubleshooting

**Problem:** Backend won't start
```bash
# Check Python version
python --version  # Should be 3.10+

# Check dependencies
pip list

# Reinstall
pip install -r requirements.txt --force-reinstall
```

**Problem:** Frontend build errors
```bash
# Clear cache
rm -rf node_modules .next
bun install
# Or
npm install

# Check Node version
node --version  # Should be 18+
```

**Problem:** MongoDB connection failed
```bash
# Check if MongoDB is running
# Windows
services.msc  # Look for MongoDB

# Mac/Linux
systemctl status mongod

# Or use in-memory mode (no authentication)
# Backend will work without MongoDB
```

**Problem:** Virtual try-on fails
```bash
# Install MediaPipe
pip install mediapipe

# Install OpenCV
pip install opencv-python

# Check if models exist
ls OnlineBoutiqueAgent/ecommerce_agent/agents/virtual_tryon_agent/
# Should see: sunglasses_fixed.png
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/auth/signup`
Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "message": "Welcome johndoe! Your account has been created."
}
```

#### POST `/auth/login`
Login existing user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJI...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "message": "Welcome back, johndoe!"
}
```

#### GET `/auth/me`
Get current user info

**Headers:**
```
Authorization: Bearer eyJhbGciOiJI...
```

**Response:**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "johndoe"
}
```

### Chat Endpoint

#### POST `/chat`
Main conversational interface

**Request:**
```json
{
  "message": "show me sunglasses under $30",
  "session_id": "session_abc123"
}
```

**Response:**
```json
{
  "agent_response": "Found 8 sunglasses under $30",
  "ui_component": "ProductGrid",
  "ui_props": {
    "products": [
      {
        "id": "OLJCESPC7Z",
        "name": "Aviator Classic",
        "price": 19.99,
        "image": "https://...",
        "rating": 4.5,
        "inStock": true
      }
    ],
    "columns": 3,
    "showAddToCart": true
  },
  "ui_reason": "User wants to browse products",
  "context": {
    "products": [...],
    "cart_items": [],
    "history": [...]
  }
}
```

### Cart Endpoints

#### POST `/cart/add`
Add item to cart

**Headers:**
```
Authorization: Bearer eyJhbGciOiJI...
```

**Request:**
```json
{
  "product_id": "OLJCESPC7Z",
  "product_name": "Aviator Classic",
  "price": 19.99,
  "quantity": 2,
  "image": "https://..."
}
```

**Response:**
```json
{
  "status": "success",
  "cart": [
    {
      "id": "OLJCESPC7Z",
      "name": "Aviator Classic",
      "price": 19.99,
      "quantity": 2,
      "image": "https://..."
    }
  ],
  "total_items": 2,
  "message": "Added Aviator Classic to your cart"
}
```

#### POST `/cart/remove`
Remove item from cart

**Request:**
```json
{
  "product_id": "OLJCESPC7Z"
}
```

**Response:**
```json
{
  "status": "success",
  "cart": [],
  "total_items": 0
}
```

#### GET `/cart/{session_id}`
Get cart contents

**Response:**
```json
{
  "status": "success",
  "cart": [...],
  "total_items": 2,
  "total_price": 39.98,
  "ui_component": "CheckoutWizard",
  "ui_props": {
    "cartItems": [...],
    "expressMode": false,
    "shippingCost": 0
  }
}
```

### Order Endpoints

#### POST `/checkout`
Complete checkout

**Headers:**
```
Authorization: Bearer eyJhbGciOiJI...
```

**Request:**
```json
{
  "shipping_info": {
    "name": "John Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "phone": "+1-555-0123"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "order": {
    "order_id": "673f8a2b...",
    "items": [...],
    "total": 39.98,
    "shipping_info": {...},
    "status": "confirmed",
    "date": "2025-01-15T10:45:00Z"
  },
  "message": "Order 673f8a2b placed successfully!"
}
```

#### GET `/orders/{session_id}`
Get order history

**Headers:**
```
Authorization: Bearer eyJhbGciOiJI...
```

**Response:**
```json
{
  "status": "success",
  "orders": [
    {
      "orderId": "673f8a2b",
      "date": "2025-01-15 10:45:00",
      "items": [...],
      "total": 39.98,
      "status": "confirmed",
      "shipping_info": {...}
    }
  ],
  "total_orders": 1,
  "ui_component": "OrderHistory",
  "ui_props": {
    "orders": [...]
  }
}
```

#### POST `/export/pdf`
Export order as PDF

**Headers:**
```
Authorization: Bearer eyJhbGciOiJI...
```

**Request:**
```json
{
  "order_id": "673f8a2b...",
  "session_id": "session_abc123"
}
```

**Response:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="order_673f8a2b.pdf"

[PDF binary data]
```

### Virtual Try-On Endpoint

#### POST `/virtual-tryon`
Try on eyewear

**Request (multipart/form-data):**
```
user_image: [File]  (JPEG/PNG)
product_id: "OLJCESPC7Z"
```

**Response:**
```json
{
  "status": "success",
  "result_image": "data:image/png;base64,iVBORw0KG...",
  "product_name": "Aviator Classic",
  "method_used": "MediaPipe Face Detection + Deterministic Geometry",
  "placement": {
    "x": 409,
    "y": 278,
    "scale": 0.998,
    "rotation": 0
  }
}
```

---

## 🚀 Deployment

### Production Checklist

**Backend:**
- [ ] Set production environment variables
- [ ] Configure MongoDB Atlas (cloud database)
- [ ] Set up JWT secret (strong random key)
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up error logging (Sentry)
- [ ] Enable rate limiting
- [ ] Configure file upload limits
- [ ] Set up backup strategy

**Frontend:**
- [ ] Build production bundle (`bun run build`)
- [ ] Configure environment variables
- [ ] Set up CDN for static assets
- [ ] Enable caching
- [ ] Configure analytics
- [ ] Set up error tracking
- [ ] Optimize images
- [ ] Enable compression

### Deployment Options

#### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_TAMBO_API_KEY
vercel env add NEXT_PUBLIC_AGENT_BACKEND_URL
```

**Backend on Railway:**
```bash
# 1. Create account at https://railway.app
# 2. New project → Deploy from GitHub
# 3. Select repository
# 4. Set root directory: OnlineBoutiqueAgent/ecommerce_agent
# 5. Add environment variables:
#    - GOOGLE_API_KEY
#    - MONGODB_URI
#    - JWT_SECRET_KEY
# 6. Deploy
```

#### Option 2: Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "simple_server:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json bun.lockb ./
RUN npm install -g bun && bun install

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'

services:
  backend:
    build: ./OnlineBoutiqueAgent/ecommerce_agent
    ports:
      - "8000:8000"
    environment:
      - GOOGLE_API_KEY=${GOOGLE_API_KEY}
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_TAMBO_API_KEY=${NEXT_PUBLIC_TAMBO_API_KEY}
      - NEXT_PUBLIC_AGENT_BACKEND_URL=http://backend:8000
    depends_on:
      - backend

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

**Deploy:**
```bash
docker-compose up -d
```

#### Option 3: Cloud Providers

**AWS:**
- Frontend: S3 + CloudFront
- Backend: EC2 or Elastic Beanstalk
- Database: DocumentDB (MongoDB compatible)

**Google Cloud:**
- Frontend: Firebase Hosting
- Backend: Cloud Run
- Database: Firestore

**Azure:**
- Frontend: Static Web Apps
- Backend: App Service
- Database: Cosmos DB

---

## 🔮 Future Roadmap

### Phase 1: Enhanced Virtual Try-On (Q1 2025)

- [ ] **Multiple Categories:** Expand beyond sunglasses
  - Hats (detect head shape)
  - Watches (detect wrist)
  - Jewelry (detect ears, neck)
  - Clothing (full-body detection)

- [ ] **Realistic Effects:**
  - Lens transparency (see eyes through glasses)
  - Frame shadows (depth perception)
  - Reflections on lenses
  - Skin tone adaptation

- [ ] **Advanced Poses:**
  - Side-facing detection
  - 3/4 view support
  - Multiple angles in one session

- [ ] **3D Models:**
  - Integrate 3D product models
  - Real-time rotation
  - Different viewing angles

### Phase 2: AI Enhancements (Q2 2025)

- [ ] **Personalized Shopping:**
  - Learn user preferences
  - Remember style choices
  - Predictive recommendations

- [ ] **Voice Shopping:**
  - Voice commands
  - Speech-to-text integration
  - Natural conversation

- [ ] **Visual Search:**
  - Upload photo → find similar products
  - "Find me this shirt"
  - Style matching

- [ ] **Smart Bundles:**
  - AI-generated outfit combinations
  - Seasonal recommendations
  - Trend analysis

### Phase 3: Social Features (Q3 2025)

- [ ] **Share & Review:**
  - Share try-on photos
  - Social media integration
  - User reviews

- [ ] **Live Shopping:**
  - Virtual shopping with friends
  - Real-time collaboration
  - Group decisions

- [ ] **Influencer Integration:**
  - Celebrity style recommendations
  - Influencer collections
  - Styling tips

### Phase 4: Business Features (Q4 2025)

- [ ] **Multi-Vendor Support:**
  - Connect multiple stores
  - Unified catalog
  - Cross-store search

- [ ] **Analytics Dashboard:**
  - User behavior tracking
  - Conversion metrics
  - A/B testing

- [ ] **Inventory Management:**
  - Real-time stock updates
  - Automated reordering
  - Supplier integration

- [ ] **Payment Integration:**
  - Stripe/PayPal
  - Multiple currencies
  - Subscription support

### Phase 5: SDK Improvements

- [ ] **Framework Support:**
  - Vue.js integration
  - Svelte integration
  - Angular support

- [ ] **Language Support:**
  - Multilingual UI
  - RTL support
  - Locale-specific formatting

- [ ] **Performance:**
  - Component lazy loading
  - Edge caching
  - CDN optimization

---

## 📚 Resources

### Documentation
- [Architecture Guide](ARCHITECTURE.md)
- [API Reference](OnlineBoutiqueAgent/README.md)
- [Frontend Guide](frontend/README.md)
- [SDK Documentation](commerce-genui/README.md)

### External Links
- [Tambo AI](https://tambo.co)
- [Google Gemini](https://ai.google.dev)
- [MediaPipe](https://mediapipe.dev)
- [Cymbal Shops](https://cymbal-shops.retail.cymbal.dev)

### Community
- GitHub Issues: [Report bugs](https://github.com/yourrepo/issues)
- Discussions: [Ask questions](https://github.com/yourrepo/discussions)
- Discord: [Join community](#)

---

## 🎓 Learning Resources

### For Developers

**Understanding Generative UI:**
1. Read: [Tambo Documentation](https://docs.tambo.co)
2. Watch: [Generative UI Explained](#)
3. Practice: Run `examples/quick_demo.py`

**Virtual Try-On Deep Dive:**
1. Read: MediaPipe Face Mesh [Guide](https://google.github.io/mediapipe/solutions/face_mesh)
2. Experiment: `agents/virtual_tryon_agent/`
3. Tune: Calibration constants

**AI Agent Design:**
1. Read: [Agent Architecture](ARCHITECTURE.md)
2. Study: `tambo_ui_engine.py`
3. Extend: Add new agents

### For Businesses

**Integration Guide:**
1. Review product catalog structure
2. Set up backend API
3. Customize UI components
4. Configure branding

**Deployment Guide:**
1. Choose hosting platform
2. Configure environment
3. Set up monitoring
4. Launch!

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas we need help:**
- UI component design
- New category support (virtual try-on)
- Performance optimization
- Bug fixes
- Documentation improvements

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini** for AI intelligence
- **Tambo** for generative UI framework
- **MediaPipe** for computer vision
- **Cymbal Shops** for demo product catalog
- **GKE Hackathon** for the opportunity

---

## 📞 Support

**Need help?**
- 📧 Email: support@shopsage.dev
- 💬 Discord: [Join server](#)
- 🐛 Issues: [GitHub Issues](https://github.com/yourrepo/issues)
- 📖 Docs: [Full Documentation](#)

---

**Built with ❤️ for "The UI Strikes Back" Hackathon 2025**

*Transform your e-commerce experience with AI-powered generative UI.*
