# Minimal Shop Example

A simple e-commerce app demonstrating Commerce GenUI SDK in action.

## What This Demo Shows

✅ **Intent Detection** - Type natural language, SDK detects intent  
✅ **Component Selection** - SDK automatically picks the right UI  
✅ **Props Generation** - SDK builds component props from context  
✅ **Explainability** - Every decision has a clear reason  

## Quick Start

### 1. Start Backend

```bash
cd backend
pip install -r requirements.txt
python server.py
```

Backend runs at http://localhost:8000

### 2. Test with curl

```bash
# Browse products
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me running shoes"}'

# Response:
{
  "ui_component": "ProductGrid",
  "ui_reason": "Showing products based on: 'Show me running shoes'",
  "ui_props": {
    "products": [...]
  }
}

# Filter by price
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show cheap options under $50"}'

# Response:
{
  "ui_component": "BudgetSlider",
  "ui_reason": "User is budget-conscious based on: 'Show cheap options under $50'",
  "ui_props": {
    "minPrice": 0,
    "maxPrice": 50,
    "productCount": 3
  }
}

# Compare products
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Compare them", "context": {"products": [...]}}'

# Response:
{
  "ui_component": "ComparisonTable",
  "ui_reason": "User wants to compare products side by side",
  "ui_props": {
    "products": [...]
  }
}
```

## Try These Messages

| Message | Expected Component | Reason |
|---------|-------------------|---------|
| "Show me running shoes" | `ProductGrid` | Product browsing |
| "Show cheap options under $50" | `BudgetSlider` | Price filtering |
| "Compare them" | `ComparisonTable` | Product comparison |
| "Show my cart" | `CartSummary` | Cart viewing |
| "Checkout" | `CheckoutWizard` | Purchase flow |

## How It Works

1. **User sends message** → "Show me cheap laptops"
2. **Backend searches products** → Finds 5 laptops
3. **SDK analyzes intent** → Detects `FILTER_BY_PRICE`
4. **SDK selects component** → Chooses `BudgetSlider`
5. **SDK builds props** → `{minPrice: 0, maxPrice: 800, products: [...]}`
6. **Frontend renders UI** → Interactive price slider appears!

## Code Walkthrough

### Backend (server.py)

```python
from commerce_genui import CommerceGenUI

sdk = CommerceGenUI()

@app.post("/chat")
async def chat(request: ChatRequest):
    # Search products
    products = search_products(request.message)
    
    # SDK decides UI
    decision = sdk.decide_ui(
        user_message=request.message,
        agent_response="Found products!",
        context={"products": products}
    )
    
    return {
        "ui_component": decision.component,
        "ui_props": decision.data,
        "ui_reason": decision.reason
    }
```

**That's it!** SDK handles all the intelligence.

### Frontend (React - not included in minimal example)

```tsx
import { useCommerceGenUI } from '@commerce-genui/react';

function Chat() {
  const { sendMessage, decision } = useCommerceGenUI();
  
  return (
    <button onClick={() => sendMessage("Show products")}>
      Search
    </button>
  );
}
```

## Next Steps

1. **Add more products** - Edit `PRODUCTS` in `server.py`
2. **Custom intents** - Use `sdk.add_intent_pattern()`
3. **Custom components** - Use `sdk.register_component()`
4. **Add frontend** - Use `@commerce-genui/react`

## Full Example

For a complete implementation with frontend, see:
- `../full-featured/` - ShopSage reference app

## Documentation

- [Getting Started](../../docs/getting-started.md)
- [API Reference](../../docs/api-reference.md)
- [Main README](../../README.md)
