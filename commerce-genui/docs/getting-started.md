# Getting Started with Commerce GenUI

This guide will help you build your first e-commerce app with generative UI in **under 10 minutes**.

## Prerequisites

- Python 3.9+ (backend)
- Node.js 16+ (frontend)
- Familiarity with FastAPI and React
- Tambo AI API key ([get one here](https://tambo.co))

---

## Step 1: Install Commerce GenUI

### Backend (Python)

```bash
pip install commerce-genui
```

### Frontend (React)

```bash
npm install @commerce-genui/react @commerce-genui/components @tambo-ai/react
```

---

## Step 2: Create Backend Server

Create `server.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from commerce_genui import CommerceGenUI

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Commerce GenUI SDK
sdk = CommerceGenUI()

class ChatRequest(BaseModel):
    message: str
    context: dict = {}

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Main endpoint - receives user message, returns UI decision
    """
    
    # Simple product search (replace with your actual search logic)
    products = search_products(request.message)
    
    # Add products to context
    context = {**request.context, "products": products}
    
    # Let SDK decide which UI to show
    decision = sdk.decide_ui(
        user_message=request.message,
        agent_response=f"Found {len(products)} products",
        context=context
    )
    
    return {
        "agent_response": f"Found {len(products)} products for you!",
        "ui_component": decision.component,
        "ui_props": decision.data,
        "ui_reason": decision.reason,  # Explainability
        "context": context
    }


def search_products(query: str) -> list:
    """Simple product search - replace with your actual logic"""
    # Mock data for demo
    return [
        {
            "id": "1",
            "name": "Running Shoes",
            "price": 89.99,
            "image": "https://picsum.photos/200/200?random=1",
            "features": [
                {"key": "color", "value": "Blue"},
                {"key": "size", "value": "10"}
            ]
        },
        {
            "id": "2",
            "name": "Sports Socks",
            "price": 14.99,
            "image": "https://picsum.photos/200/200?random=2",
            "features": [
                {"key": "color", "value": "White"},
                {"key": "material", "value": "Cotton"}
            ]
        }
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**Run it:**
```bash
python server.py
```

Server running at http://localhost:8000

---

## Step 3: Create React Frontend

Create `App.tsx`:

```tsx
import React from 'react';
import { TamboProvider, useThread } from '@tambo-ai/react';
import * as CommerceComponents from '@commerce-genui/components';

function ChatInterface() {
  const { messages, sendMessage } = useThread();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Commerce App</h1>
      
      {/* Message thread */}
      <div className="space-y-4 mb-8">
        {messages.map((msg, i) => (
          <div key={i} className="p-4 bg-gray-50 rounded-lg">
            <p className="font-semibold">
              {msg.role === 'user' ? 'You' : 'AI'}
            </p>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Try: Show me running shoes under $100"
          className="flex-1 px-4 py-2 border rounded-lg"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              sendMessage((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = '';
            }
          }}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TamboProvider
      apiKey={process.env.REACT_APP_TAMBO_API_KEY!}
      components={CommerceComponents}
      agentBackendUrl="http://localhost:8000"
    >
      <ChatInterface />
    </TamboProvider>
  );
}
```

Create `.env`:
```bash
REACT_APP_TAMBO_API_KEY=your_tambo_api_key_here
```

**Run it:**
```bash
npm start
```

App running at http://localhost:3000

---

## Step 4: Test It Out!

Try these messages:

1. **"Show me running shoes"**
   - SDK shows: `ProductGrid`
   - Reason: "Showing products based on: 'Show me running shoes'"

2. **"Show cheap options under $50"**
   - UI morphs to: `BudgetSlider`
   - Reason: "User is budget-conscious"

3. **"Compare them"**
   - UI morphs to: `ComparisonTable`
   - Reason: "User wants to compare products side by side"

**🎉 You just built a generative UI commerce app in 5 minutes!**

---

## What Just Happened?

1. User types natural language message
2. Backend receives message
3. **Commerce GenUI SDK analyzes intent** ⭐
4. **SDK selects best UI component** ⭐
5. **SDK generates props from context** ⭐
6. Tambo renders the component
7. User sees perfect UI automatically

**Zero hardcoded if/else statements. Pure AI-driven UI!**

---

## Next Steps

### 1. Add More Components

```python
# Backend: Register custom component
sdk.register_component(
    name="WishlistPanel",
    description="User's saved items",
    intents=[CommerceIntent.BROWSE_PRODUCTS],
    props_builder=lambda ctx: {"items": ctx.get("wishlist", [])},
    priority=10
)
```

```tsx
// Frontend: Import your custom component
import { WishlistPanel } from './components/WishlistPanel';

const components = {
  ...CommerceComponents,
  WishlistPanel
};
```

### 2. Add Cart Functionality

```python
@app.post("/cart/add")
async def add_to_cart(product_id: str):
    # Your cart logic
    return {"status": "added"}
```

Update context:
```python
context = {
    "products": products,
    "cart_items": get_user_cart(),  # Add cart
}
```

Now when user says "show cart", SDK automatically renders `CheckoutWizard`!

### 3. Add User Authentication

```python
from commerce_genui import CommerceIntent

# Profile intent
user_data = get_current_user()
context = {
    **context,
    "user": user_data,
    "orders": get_user_orders(user_data["id"])
}

# When user says "my profile", SDK renders UserProfile
```

### 4. Add Custom Intents

```python
from commerce_genui import CommerceIntent

# Define custom intent
class MyIntent(CommerceIntent):
    GIFT_FINDER = "GIFT_FINDER"

# Register pattern
sdk.add_intent_pattern(
    keywords=["gift", "present", "birthday"],
    intent=MyIntent.GIFT_FINDER,
    components=["GiftFinderWizard"],
    priority=15
)
```

---

## Common Patterns

### Pattern 1: Product Search with Filters

```python
def search_products(query: str, filters: dict = None):
    # Your search logic
    results = db.search(query)
    
    if filters:
        if "max_price" in filters:
            results = [p for p in results if p["price"] <= filters["max_price"]]
    
    return results

# In chat endpoint:
products = search_products(
    query=request.message,
    filters=request.context.get("filters")
)
```

### Pattern 2: Multi-Step Checkout

```python
# SDK automatically handles this!
decision = sdk.decide_ui(
    user_message="checkout",
    context={
        "cart_items": get_cart(),  # SDK detects cart and shows CheckoutWizard
    }
)

# If user says "fast checkout" or "express":
decision = sdk.decide_ui(
    user_message="checkout fast",
    context={"cart_items": get_cart()}
)
# SDK sets expressMode=True automatically!
```

### Pattern 3: Personalized Recommendations

```python
context = {
    "products": products,
    "user": user_data,
    "browsing_history": get_history(user_id),
}

# SDK uses all context to make smarter decisions
decision = sdk.decide_ui(
    user_message="show me something",
    context=context
)
```

---

## Debugging Tips

### Enable Verbose Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)

decision = sdk.decide_ui(...)
print(f"Intent: {decision.intent}")
print(f"Component: {decision.component}")
print(f"Reason: {decision.reason}")
print(f"Confidence: {decision.confidence}")
print(f"Alternatives: {decision.alternatives}")
```

### Check What SDK Sees

```python
# Test intent detection
intent = sdk.detect_intent("show me cheap laptops")
print(intent)  # CommerceIntent.FILTER_BY_PRICE

# Test component selection
component = sdk.select_component(intent, context)
print(component)  # "BudgetSlider"

# Test props building
props = sdk.build_props(component, context)
print(props)  # {"minPrice": 0, "maxPrice": 800, ...}
```

---

## Performance Tips

1. **Cache product data** - Don't search database on every message
2. **Use context wisely** - Only pass what's needed
3. **Lazy load components** - Code-split React components
4. **Optimize props** - Don't send huge data objects to frontend

---

## Production Checklist

- [ ] Add authentication and authorization
- [ ] Implement real product search (database/API)
- [ ] Add cart persistence (database/session)
- [ ] Set up error handling
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Add logging and monitoring
- [ ] Deploy backend (Railway, Render, AWS)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Set up environment variables
- [ ] Add tests

---

## Example Apps

Check out complete examples in `examples/`:

- **`minimal-shop/`** - Bare minimum setup (this guide)
- **`full-featured/`** - ShopSage with all features
- **`custom-components/`** - How to add your own components

---

## Get Help

- **Documentation**: [docs/](../docs/)
- **API Reference**: [api-reference.md](api-reference.md)
- **Discord**: [Join community](#)
- **GitHub Issues**: [Report bugs](#)

---

## What's Next?

Now that you have a basic app working, explore:

1. **[Component Guide](components.md)** - Learn about all 10+ components
2. **[Intent System](intents.md)** - Deep dive into intent detection
3. **[API Reference](api-reference.md)** - Complete API docs
4. **[Advanced Patterns](advanced.md)** - Production patterns
5. **[ShopSage Source](../examples/full-featured/)** - See full implementation

---

**Congratulations! You've built your first Generative UI commerce app!** 🎉

May the Components Be With You! ⚡
