"""
Minimal Commerce GenUI Example - Backend
Demonstrates the SDK in action with a simple product catalog
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

# Add parent directory to path to import commerce_genui
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../packages/core')))

from commerce_genui import CommerceGenUI

app = FastAPI(title="Commerce GenUI Example")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Commerce GenUI SDK
sdk = CommerceGenUI()

# Mock product database
PRODUCTS = [
    {
        "id": "1",
        "name": "Running Shoes - Nike Air",
        "price": 89.99,
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        "description": "Lightweight running shoes with air cushioning",
        "category": "shoes",
        "features": [
            {"key": "color", "value": "Red"},
            {"key": "size", "value": "10"}
        ],
        "rating": 4.5,
        "reviews": 128,
        "inStock": True
    },
    {
        "id": "2",
        "name": "Running Shoes - Adidas Ultra",
        "price": 74.99,
        "image": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400",
        "description": "Ultra boost technology for maximum comfort",
        "category": "shoes",
        "features": [
            {"key": "color", "value": "Blue"},
            {"key": "size", "value": "10"}
        ],
        "rating": 4.7,
        "reviews": 95,
        "inStock": True,
        "discount": 15
    },
    {
        "id": "3",
        "name": "Sports Socks (3-Pack)",
        "price": 14.99,
        "image": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400",
        "description": "Moisture-wicking athletic socks",
        "category": "accessories",
        "features": [
            {"key": "color", "value": "White"},
            {"key": "material", "value": "Cotton"}
        ],
        "rating": 4.2,
        "reviews": 56,
        "inStock": True
    },
    {
        "id": "4",
        "name": "Wireless Headphones",
        "price": 129.99,
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "description": "Premium sound quality with noise cancellation",
        "category": "electronics",
        "features": [
            {"key": "color", "value": "Black"},
            {"key": "battery", "value": "30 hours"}
        ],
        "rating": 4.8,
        "reviews": 234,
        "inStock": True
    },
    {
        "id": "5",
        "name": "Laptop Backpack",
        "price": 49.99,
        "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "description": "Water-resistant backpack with laptop compartment",
        "category": "accessories",
        "features": [
            {"key": "color", "value": "Gray"},
            {"key": "capacity", "value": "20L"}
        ],
        "rating": 4.4,
        "reviews": 78,
        "inStock": True
    }
]


class ChatRequest(BaseModel):
    message: str
    context: dict = {}


@app.get("/")
async def root():
    return {
        "message": "Commerce GenUI Example API",
        "docs": "/docs"
    }


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Main endpoint - receives user message, returns UI decision
    """
    
    # Simple product search
    products = search_products(request.message, request.context.get("filters"))
    
    # Build context
    context = {
        **request.context,
        "products": products
    }
    
    # Let SDK decide which UI to show
    decision = sdk.decide_ui(
        user_message=request.message,
        agent_response=f"Found {len(products)} products for you!",
        context=context
    )
    
    return {
        "agent_response": f"Found {len(products)} products matching your criteria!",
        "ui_component": decision.component,
        "ui_props": decision.data,
        "ui_reason": decision.reason,
        "context": context
    }


def search_products(query: str, filters: dict = None) -> list:
    """Simple product search with keyword matching"""
    query_lower = query.lower()
    results = PRODUCTS.copy()
    
    # Keyword search
    if any(keyword in query_lower for keyword in ["shoe", "shoes", "running"]):
        results = [p for p in results if p["category"] == "shoes"]
    elif any(keyword in query_lower for keyword in ["headphone", "audio", "music"]):
        results = [p for p in results if p["category"] == "electronics"]
    elif any(keyword in query_lower for keyword in ["bag", "backpack"]):
        results = [p for p in results if "backpack" in p["name"].lower()]
    
    # Price filtering
    if filters:
        if "max_price" in filters:
            results = [p for p in results if p["price"] <= filters["max_price"]]
        if "min_price" in filters:
            results = [p for p in results if p["price"] >= filters["min_price"]]
        if "category" in filters:
            results = [p for p in results if p["category"] == filters["category"]]
    
    return results


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Commerce GenUI Example Backend...")
    print("📝 API Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
