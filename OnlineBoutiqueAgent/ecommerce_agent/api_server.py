"""
FastAPI server for E-commerce Agent with Tambo UI integration
Exposes REST API endpoints for the frontend to communicate with
"""

from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import sys
import os
import base64
from io import BytesIO

# Add parent directory to path to fix imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now import the agent components
from ecommerce_agent.agents.product_finder_agent.agent import search_products
from ecommerce_agent.tambo_ui_engine import TamboUIDecisionEngine

app = FastAPI(
    title="E-commerce Agent API",
    description="Backend API for Cymbal Shops Agent with Tambo Generative UI",
    version="1.0.0"
)

# Enable CORS for frontend
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize UI engine
ui_engine = TamboUIDecisionEngine()

# Simple session storage (in production, use Redis or database)
sessions = {}


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
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "E-commerce Agent API",
        "version": "1.0.0",
        "tambo_ui": "enabled"
    }


@app.get("/health")
async def health_check():ui_engine.registered_components)
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint
    Processes user message and returns agent response + UI component config
    """
    try:
        session_id = request.session_id or f"session_{id(request)}"
        user_message = request.message.lower()
        
        # Initialize session context if needed
        if session_id not in sessions:
            sessions[session_id] = {
                'products': [],
                'cart_items': [],
                'history': []
            }
        
        context = sessions[session_id]
        
        # Search for products
        search_result = search_products(user_message)
        
        # Build agent response
        if search_result.get('status') == 'success':
            products = search_result.get('products', [])
            context['products'] = products
            
            if products:
                product_names = ', '.join([p['name'] for p in products[:3]])
                agent_response = f"Here are some {user_message} I found: {product_names}"
                if len(products) > 3:
                    agent_response += f" and {len(products) - 3} more."
            else:
                agent_response = f"I couldn't find any products matching '{user_message}'. Try a different search term."
        else:
            agent_response = f"Sorry, I encountered an error: {search_result.get('error_message', 'Unknown error')}"
            products = []
        
        # Add to history
        context['histoui_engine.registered_components,
        "total": len(ui_engine.registered_components)
    }


@app.post("/reset-session")
async def reset_session(session_id: str):
    """Reset a conversation session"""
    try:
        if session_id in sessions:
            sessions[session_id] = {
                'products': [],
                'cart_items': [],
                'history': []
                formatted_products.append({
                'id': p.get('id', ''),
                'name': p.get('name', 'Product'),
                'price': float(p.get('price', '$0').replace('$', '')) if isinstance(p.get('price'), str) else 0,
                'image': p.get('url', '') + '/image' if p.get('url') else '',
                'rating': 4.5,  # Default rating
                'inStock': True
            })
        
        # Update props with formatted products
        if ui_config.component_name == 'ProductGrid':
            ui_config.props['products'] = formatted_products
        
        return ChatResponse(
            agent_response=agent_response,
            ui_component=ui_config.component_name,
            ui_props=ui_config.props,
            ui_reason=ui_config.reason,
            context=context
        return ChatResponse(
            agent_response=result['agent_response'],
            ui_component=result['ui_component'],
            ui_props=result['ui_props'],
            ui_reason=result.get('ui_reason'),
            context=result.get('context', {})
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}"
        )


@app.get("/components")
async def list_components():
    """List all registered UI components"""
    return {
        "components": tambo_agent.ui_engine.registered_components,
        "total": len(tambo_agent.ui_engine.registered_components)
    }


@app.post("/reset-session")
async def reset_session(session_id: str):
    """Reset a conversation session"""
    try:
        # Clear context
        tambo_agent.context = {
            'products': [],
            'cart_items': [],
            'selected_product': None,
            'last_search': None
        }
        return {"status": "success", "message": f"Session {session_id} reset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/virtual-tryon")
async def virtual_tryon(
    user_image: UploadFile = File(...),
    product_id: str = Form(...)
):
    """
    Virtual try-on endpoint
    Accepts user image and product ID, returns AI-generated try-on image
    """
    try:
        # Import modules needed for virtual try-on
        from ecommerce_agent.agents.virtual_tryon_agent.gemini_placer import GeminiPlacer
        from ecommerce_agent.agents.virtual_tryon_agent.eye_detector import EyeDetector
        import google.generativeai as genai
        from PIL import Image
        import requests
        
        # Read user image
        user_image_bytes = await user_image.read()
        
        # Get product details from Cymbal Shops
        product_url = f"https://cymbal-shops.retail.cymbal.dev/product/{product_id}"
        response = requests.get(product_url)
        response.raise_for_status()
        
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        product_name = soup.find('h2').get_text(strip=True) if soup.find('h2') else "Product"
        image_elem = soup.find('img', class_='product-image')
        product_image_url = f"https://cymbal-shops.retail.cymbal.dev{image_elem['src']}" if image_elem else None
        
        if not product_image_url:
            raise HTTPException(status_code=404, detail="Product image not found")
        
        # Get product image
        product_response = requests.get(product_image_url)
        product_response.raise_for_status()
        product_image_bytes = product_response.content
        
        # Determine if it's eyewear
        product_name_lower = product_name.lower()
        is_eyewear = any(keyword in product_name_lower for keyword in ['glasses', 'sunglasses', 'eyewear'])
        
        # Set context hint
        if is_eyewear:
            context_hint = "This is eyewear (glasses/sunglasses). It should be placed on the person's face, centered on the nose bridge."
        else:
            context_hint = f"This is {product_name}. Place it appropriately on the person."
        
        # Initialize Gemini
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel('models/gemini-2.5-flash')
        placer = GeminiPlacer(gemini_model)
        
        # Get product dimensions
        product_img = Image.open(BytesIO(product_image_bytes))
        object_dimensions = product_img.size
        
        # For eyewear, use eye detection
        eye_data = None
        if is_eyewear:
            try:
                eye_detector = EyeDetector()
                eye_data = eye_detector.detect_eyes(user_image_bytes)
                print(f"✓ Eyes detected: {eye_data}" if eye_data else "✗ No eyes detected")
            except Exception as e:
                print(f"Eye detection failed: {e}")
        
        # Get placement from Gemini
        placement = placer.get_object_placement(
            background_image_bytes=user_image_bytes,
            object_description=product_name,
            context_hint=context_hint,
            eye_data=eye_data,
            object_dimensions=object_dimensions
        )
        
        # Save product image temporarily
        temp_product_path = f"/tmp/product_{os.getpid()}.png"
        product_img.save(temp_product_path)
        
        # Overlay object
        final_image = GeminiPlacer.overlay_object(
            background_image_bytes=user_image_bytes,
            object_image_bytes=temp_product_path,
            placement=placement
        )
        
        # Clean up
        os.remove(temp_product_path)
        
        # Convert to base64
        buffer = BytesIO()
        final_image.save(buffer, 'PNG')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        
        return {
            "status": "success",
            "result_image": image_base64,
            "product_name": product_name,
            "method_used": "Gemini Placer with Computer Vision" if eye_data else "Gemini Placer",
            "placement": placement
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Virtual try-on error: {e}")
        raise HTTPException(status_code=500, detail=f"Virtual try-on failed: {str(e)}")


if __name__ == "__main__":
    print("🚀 Starting E-commerce Agent API Server...")
    print("📍 Server will run at: http://localhost:8000")
    print("📖 API Docs available at: http://localhost:8000/docs")
    print("🎨 Tambo UI Integration: ENABLED")
    print()
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
