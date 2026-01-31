# 🚀 Running ShopSage with Real Product Data

## Overview
Your Tambo frontend now connects to the **real E-commerce Agent backend** that scrapes product data from Cymbal Shops (https://cymbal-shops.retail.cymbal.dev).

## Architecture
```
User Browser
    ↓
Frontend (Next.js + Tambo UI)
    ↓
API Route (/api/agent)
    ↓
FastAPI Server (port 8000)
    ↓
E-commerce Agent (Google ADK)
    ↓
Product Scraper → Cymbal Shops
```

## Setup Instructions

### 1. Backend Setup (Python Agent)

#### Install Dependencies
```bash
cd "d:\ai bharat prof\OnlineBoutiqueAgent\ecommerce_agent"
pip install -r requirements.txt
```

This installs:
- Google ADK (agent framework)
- FastAPI + Uvicorn (API server)
- BeautifulSoup4 (web scraping)
- Pydantic (data validation)

#### Configure Environment
Make sure you have `.env` file with:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

#### Start the Backend Server
```bash
cd "d:\ai bharat prof\OnlineBoutiqueAgent\ecommerce_agent"
python api_server.py
```

You should see:
```
🚀 Starting E-commerce Agent API Server...
📍 Server will run at: http://localhost:8000
📖 API Docs available at: http://localhost:8000/docs
🎨 Tambo UI Integration: ENABLED
```

**Test the backend:**
```bash
# Check health
curl http://localhost:8000/health

# Test chat
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show me sunglasses"}'
```

### 2. Frontend Setup (Next.js + Tambo)

#### Install Dependencies (if not done)
```bash
cd "d:\ai bharat prof\frontend"
bun install
```

#### Start the Frontend
```bash
cd "d:\ai bharat prof\frontend"
bun dev
```

Frontend runs at: **http://localhost:3000**

## How It Works

### 1. **User Types Message**
```
"show me sunglasses"
```

### 2. **Frontend Sends to Backend**
```typescript
// /api/agent/route.ts
POST /api/agent
→ fetch('http://localhost:8000/chat', {
    body: { message: "show me sunglasses" }
  })
```

### 3. **Backend Processes with ADK Agent**
```python
# api_server.py → tambo_integrated_agent.py
1. Agent scrapes Cymbal Shops for sunglasses
2. Finds real products with images, prices
3. UI Engine decides: ProductGrid
4. Returns structured response
```

### 4. **Frontend Renders Dynamic UI**
```typescript
// Tambo receives:
{
  component: "ProductGrid",
  props: {
    products: [
      {
        id: "OLJCESPC7Z",
        name: "Wayfare Retro Sunglasses",
        price: "$19.99",
        image: "https://cymbal-shops.retail.cymbal.dev/static/..."
      }
    ]
  }
}
```

### 5. **UI Morphs Based on Intent**

| User Says | Component Rendered | Why |
|-----------|-------------------|-----|
| "show me sunglasses" | ProductGrid | Default browsing |
| "cheap sunglasses" | BudgetSlider | Budget mentioned |
| "compare these two" | ComparisonTable | Comparison intent |
| "let me try this on" | TryOnStudio | Virtual try-on |
| "checkout" | CheckoutWizard | Purchase intent |

## Data Flow Example

### Request:
```json
{
  "message": "show me sunglasses"
}
```

### Backend Response:
```json
{
  "agent_response": "Here are some stylish sunglasses...",
  "ui_component": "ProductGrid",
  "ui_props": {
    "products": [
      {
        "id": "OLJCESPC7Z",
        "name": "Aviator Classic",
        "price": "$19.99",
        "image": "https://cymbal-shops.retail.cymbal.dev/static/img/products/sunglasses-1.jpg",
        "rating": 4.5,
        "inStock": true
      }
    ],
    "title": "Sunglasses Collection"
  },
  "ui_reason": "User browsing products, showing grid view"
}
```

### Frontend Renders:
✅ Real product images from Cymbal Shops  
✅ Actual prices scraped from website  
✅ Dynamic UI component (ProductGrid)  
✅ Smooth morphing between components  

## Testing the Integration

### Test Script
```bash
# Terminal 1 - Backend
cd "d:\ai bharat prof\OnlineBoutiqueAgent\ecommerce_agent"
python api_server.py

# Terminal 2 - Frontend
cd "d:\ai bharat prof\frontend"
bun dev

# Terminal 3 - Test
curl http://localhost:8000/health
```

### Browser Test
1. Open http://localhost:3000/chat
2. Type: "show me sunglasses"
3. See real products from Cymbal Shops
4. Type: "show me cheap options"
5. Watch UI morph to BudgetSlider
6. Type: "compare the top 2"
7. Watch UI morph to ComparisonTable

## Troubleshooting

### Backend Not Starting
```bash
# Check dependencies
pip list | grep fastapi
pip list | grep google-adk

# Reinstall
pip install -r requirements.txt --force-reinstall
```

### Frontend Can't Connect
```bash
# Check .env.local
cat .env.local | grep AGENT_BACKEND

# Should show:
AGENT_BACKEND_URL=http://localhost:8000

# Test backend directly
curl http://localhost:8000/health
```

### No Products Showing
```bash
# Test scraper directly
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "show me all products"}'
```

### CORS Errors
Make sure `api_server.py` has:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Next Steps

1. ✅ **Backend Running** → Products scraped from Cymbal Shops
2. ✅ **Frontend Connected** → Real data displayed
3. 🎥 **Record Demo** → Show all 5 UI mutations
4. 📤 **Submit to Hackathon** → Upload video + code

## API Documentation

Once backend is running, visit:
**http://localhost:8000/docs**

Interactive API documentation with:
- All endpoints
- Request/response schemas
- Try it out feature

## Product Sources

### Cymbal Shops
Base URL: https://cymbal-shops.retail.cymbal.dev

Product categories scraped:
- Sunglasses
- Shirts
- Shoes
- Accessories

All images, prices, and product data are **REAL** from this demo e-commerce site.

## Performance

- Backend response time: ~2-3 seconds (includes web scraping)
- Frontend rendering: ~100ms (Tambo component rendering)
- Total UX: ~3 seconds from user message to UI display

## Success Criteria

✅ User types "show me sunglasses"  
✅ Backend scrapes Cymbal Shops  
✅ Returns real products with images  
✅ Frontend renders ProductGrid  
✅ User sees actual product data (not placeholders)  
✅ UI morphs on intent change  

---

**You're now running ShopSage with REAL product data from Cymbal Shops! 🎉**
