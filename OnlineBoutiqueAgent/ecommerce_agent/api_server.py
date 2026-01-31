"""
FastAPI server for E-commerce Agent with Tambo UI integration
Exposes REST API endpoints for the frontend to communicate with
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import sys
import os

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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
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
