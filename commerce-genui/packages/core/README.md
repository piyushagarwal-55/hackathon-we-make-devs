# Commerce GenUI - Core Package

**Generative UI SDK for E-commerce Applications**

Built on top of Tambo AI, Commerce GenUI provides an intelligent decision engine that converts natural language conversations into dynamic UI component selections.

**⚡ Technical Approach:** Uses deterministic pattern matching by default (fast, reliable, debuggable) with optional AI-assisted classification for edge cases. Production-first design.

## 🚀 Quick Start

```python
from commerce_genui import CommerceGenUI

# Initialize SDK
sdk = CommerceGenUI()

# Make a UI decision
decision = sdk.decide_ui(
    user_message="Show me cheap running shoes",
    agent_response="Found 15 products under $100",
    context={"products": [...]}
)

print(f"Component: {decision.component}")  # "BudgetSlider"
print(f"Reason: {decision.reason}")        # "User is budget-conscious..."
print(f"Props: {decision.data}")           # {"minPrice": 0, "maxPrice": 100, ...}
```

## 📦 Installation

```bash
pip install commerce-genui
```

## 🎯 Core Features

### 1. Intent Detection
Automatically detects user intent from natural language:

```python
intent = sdk.detect_intent(
    user_message="Compare these laptops",
    agent_response="Here are 3 options..."
)
# Returns: CommerceIntent.COMPARE_PRODUCTS
```

### 2. Component Selection
Selects the best UI component for the intent:

```python
component = sdk.select_component(
    intent=CommerceIntent.COMPARE_PRODUCTS,
    context={"products": [...]}
)
# Returns: "ComparisonTable"
```

### 3. Props Builder
Automatically builds props from context:

```python
props = sdk.build_props(
    component="ProductGrid",
    context={"products": [...]}
)
# Returns: {"products": [...], "columns": 4}
```

### 4. Full Decision Pipeline
Or use the all-in-one decision function:

```python
decision = sdk.decide_ui(
    user_message="Show me laptops under $800",
    context={"products": [...]
})

# UIDecision(
#   intent=CommerceIntent.FILTER_BY_PRICE,
#   component="BudgetSlider",
#   reason="User is budget-conscious based on: 'Show me laptops under $800'",
#   data={"minPrice": 0, "maxPrice": 800, "productCount": 15},
#   confidence=0.95,
#   alternatives=["DealBadgePanel"]
# )
```

## 🧩 Plugin Architecture

Register custom components:

```python
from commerce_genui import CommerceIntent

sdk.register_component(
    name="FlashDealPanel",
    description="Shows flash sales with countdown timers",
    intents=[CommerceIntent.VIEW_DEALS],
    props_builder=lambda ctx: {
        "deals": ctx.get("flash_deals", []),
        "timeLeft": "2h 30m"
    },
    priority=20  # Higher priority than default DealBadgePanel
)
```

Now when users mention "deals" or "flash sale", your custom component will be selected!

## 🎨 Supported Intents

Commerce GenUI comes with built-in support for:

- `BROWSE_PRODUCTS` - Product discovery
- `SEARCH_PRODUCTS` - Product search
- `FILTER_BY_PRICE` - Budget filtering
- `COMPARE_PRODUCTS` - Side-by-side comparison
- `VIEW_CART` - Shopping cart
- `CHECKOUT` - Purchase flow
- `EXPRESS_CHECKOUT` - Fast checkout
- `VIEW_PROFILE` - User account
- `VIEW_ORDER_HISTORY` - Past orders
- `TRACK_ORDER` - Order tracking
- `VIEW_DEALS` - Special offers
- `RECOMMEND_BUNDLE` - Product bundles
- `VIRTUAL_TRYON` - Product visualization

**Add your own:**

```python
from commerce_genui import CommerceIntent

# Define custom intent
class CustomIntent(CommerceIntent):
    WISHLIST = "WISHLIST"
    GIFT_FINDER = "GIFT_FINDER"

sdk.add_intent_pattern(
    keywords=["wishlist", "save for later"],
    intent=CustomIntent.WISHLIST,
    components=["WishlistPanel"],
    priority=10
)
```

## 📊 Default Components

The SDK knows about these components out of the box:

- `ProductGrid` - Product listing
- `ComparisonTable` - Product comparison
- `BudgetSlider` - Price range filter
- `CheckoutWizard` - Multi-step checkout
- `UserProfile` - Account management
- `OrderHistory` - Order tracking
- `DealBadgePanel` - Special deals
- `BundleBuilder` - Product bundles
- `TryOnStudio` - Virtual try-on

## 🔧 Advanced Usage

### Custom Props Builder

```python
def my_props_builder(context):
    products = context.get("products", [])
    return {
        "products": products,
        "sortedBy": "popularity",
        "filters": context.get("active_filters", {}),
        "totalCount": len(products)
    }

sdk.register_component(
    name="SmartProductGrid",
    description="Enhanced product grid with AI sorting",
    intents=[CommerceIntent.BROWSE_PRODUCTS],
    props_builder=my_props_builder,
    priority=5
)
```

### Context-Aware Decisions

```python
# Different components based on cart state
decision1 = sdk.decide_ui(
    user_message="checkout",
    context={"cart_items": []}  # Empty cart
)
# Returns: ProductGrid (nothing to checkout)

decision2 = sdk.decide_ui(
    user_message="checkout",
    context={"cart_items": [{"id": 1, "name": "Shoes"}]}
)
# Returns: CheckoutWizard (has items)
```

## 🎯 Explainability

Every decision includes a human-readable explanation:

```python
decision = sdk.decide_ui(
    user_message="Compare the top 3 laptops"
)

print(decision.reason)
# "User wants to compare products side by side"

print(decision.alternatives)
# ["ProductGrid", "DetailedList"]  # Other components that could work
```

This is perfect for debugging and showing judges why the AI made each decision!

## 📚 API Reference

### `CommerceGenUI`

Main SDK class.

**Methods:**
- `decide_ui(user_message, agent_response, context)` → `UIDecision`
- `detect_intent(user_message, agent_response, context)` → `CommerceIntent`
- `select_component(intent, context)` → `str`
- `build_props(component, context)` → `Dict`
- `register_component(name, description, intents, props_builder, priority)`
- `add_intent_pattern(keywords, intent, components, priority)`

### `UIDecision`

Decision output with full information.

**Fields:**
- `intent: CommerceIntent` - Detected intent
- `component: str` - Component to render
- `reason: str` - Explanation
- `data: Dict` - Props for component
- `confidence: float` - Confidence score (0-1)
- `alternatives: List[str]` - Alternative components

### `CommerceIntent`

Enum of standard commerce intents.

See "Supported Intents" section above.

## 🧪 Testing

```python
import pytest
from commerce_genui import CommerceGenUI, CommerceIntent

def test_budget_intent():
    sdk = CommerceGenUI()
    decision = sdk.decide_ui(
        user_message="Show me cheap options",
        context={"products": [...]}
    )
    assert decision.intent == CommerceIntent.FILTER_BY_PRICE
    assert decision.component == "BudgetSlider"
```

## 🤝 Contributing

We welcome contributions! The SDK is designed to be extensible.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Packages

- `@commerce-genui/react` - React hooks and provider
- `@commerce-genui/components` - Pre-built UI components
- `@commerce-genui/types` - TypeScript type definitions

---

**Built with ❤️ by the ShopSage Team**

For Tambo AI Hackathon - "The UI Strikes Back"
