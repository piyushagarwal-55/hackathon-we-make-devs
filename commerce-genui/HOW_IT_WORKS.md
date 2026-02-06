# Commerce GenUI SDK - Complete Technical Explanation

**How It Works | What Users Do | Difference from Tambo**

---

## 🧠 Mental Model: What IS the SDK?

**Think of it like this:**

```
┌─────────────────────────────────────────────────────────┐
│  Your Frontend (React/Next.js)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ CartPage │  │ ProductGrid│  │ Checkout │  ← YOU build│
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                        ↑
                        │ "Show CartPage with these props"
                        │
┌─────────────────────────────────────────────────────────┐
│  Your Backend (FastAPI/Flask/Express)                   │
│                                                          │
│  User: "What's in my cart?"                             │
│    ↓                                                     │
│  [Agent]: "You have 3 items"  ← YOU build               │
│    ↓                                                     │
│  [Commerce GenUI SDK]: ← WE provide                     │
│    Analyzes: "cart" keyword                             │
│    Decides: Show "CartPage" component                   │
│    Builds props: {items: [...], total: 299.99}          │
│    ↓                                                     │
│  Returns: {                                             │
│    component: "CartPage",                               │
│    props: {...},                                        │
│    reason: "User wants to view cart"                    │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
```

**The SDK is a DECISION MAKER, not a component library.**

---

## 📦 What the SDK Actually Is

### NOT a Server
```python
# ❌ You DON'T do this:
curl http://commerce-genui-server.com/decide

# ✅ You DO this:
from commerce_genui import CommerceGenUI
sdk = CommerceGenUI()
```

**It's a Python package** - like `requests` or `pydantic`. You import it into YOUR backend.

---

### NOT a Component Library
```typescript
// ❌ SDK doesn't provide these:
import { CartPage, ProductGrid } from 'commerce-genui'

// ✅ YOU provide these:
// your-project/components/CartPage.tsx
// your-project/components/ProductGrid.tsx
```

**You build the components.** SDK just tells you which one to show.

---

### IS a Decision Engine
```python
# What the SDK does:
decision = sdk.decide_ui(
    user_message="Show me cheap laptops",  # User input
    agent_response="Found 12 products",    # Your agent's response
    context={"products": [...]}            # Your data
)

# SDK returns:
{
    "component": "BudgetSlider",           # Which component to show
    "props": {                              # What data to pass to it
        "minPrice": 0,
        "maxPrice": 500,
        "products": [...]
    },
    "reason": "User is budget-conscious"   # Why this choice
}
```

**SDK = Pattern matcher + Component selector + Props builder**

---

## 🔧 How the SDK Works (Step by Step)

### Step 1: Pattern Matching (Intent Detection)

```python
# Inside the SDK (decision_engine.py):

def detect_intent(self, user_message: str) -> CommerceIntent:
    """Find which intent matches the message"""
    
    message_lower = user_message.lower()
    
    # Check all registered patterns
    for pattern in self.intent_patterns:
        for keyword in pattern.keywords:
            if keyword in message_lower:
                return pattern.intent  # Found it!
    
    return CommerceIntent.BROWSE_PRODUCTS  # Default fallback
```

**Example:**
```python
"Show me cheap laptops" 
→ Contains "cheap" 
→ Matches FILTER_BY_PRICE pattern
→ Returns CommerceIntent.FILTER_BY_PRICE
```

---

### Step 2: Component Selection

```python
# Inside the SDK:

def select_component(self, intent: CommerceIntent, context: dict) -> str:
    """Pick the best component for this intent"""
    
    # Get components registered for this intent
    candidates = self.registry.get_for_intent(intent)
    
    # Check context for special cases
    if context.get('cart_items') and intent == CommerceIntent.CHECKOUT:
        return "CheckoutWizard"
    
    if len(context.get('products', [])) > 20:
        return "ProductGrid"  # Many products = grid view
    
    # Return highest priority component
    return candidates[0].name if candidates else "ProductGrid"
```

**Example:**
```python
Intent: FILTER_BY_PRICE
Context: {"products": [12 items]}
→ Registry lookup: [BudgetSlider, PriceFilter]
→ BudgetSlider has higher priority
→ Returns "BudgetSlider"
```

---

### Step 3: Props Building

```python
# Inside the SDK:

def build_props(self, component: str, context: dict, user_message: str) -> dict:
    """Generate props for the component"""
    
    # Check if component has custom props builder
    component_config = self.registry.get_component(component)
    if component_config.props_builder:
        return component_config.props_builder(context)
    
    # Otherwise use default builders
    if component == "BudgetSlider":
        products = context.get("products", [])
        prices = [p.get("price", 0) for p in products]
        
        return {
            "minPrice": min(prices) if prices else 0,
            "maxPrice": max(prices) if prices else 1000,
            "productCount": len(products),
            "products": products
        }
```

**Example:**
```python
Component: "BudgetSlider"
Context: {"products": [{"price": 299}, {"price": 499}]}
→ Extract prices: [299, 499]
→ Build props: {minPrice: 299, maxPrice: 499, productCount: 2, products: [...]}
→ Returns props
```

---

### Step 4: Explainability

```python
# Inside the SDK:

def get_selection_reason(self, intent: CommerceIntent, component: str, user_message: str) -> str:
    """Explain WHY this component was chosen"""
    
    if intent == CommerceIntent.FILTER_BY_PRICE:
        # Extract price-related words
        if "cheap" in user_message.lower():
            return f"User is budget-conscious based on: '{user_message}'"
        elif "under $" in user_message.lower():
            return f"User specified price limit in: '{user_message}'"
    
    if intent == CommerceIntent.COMPARE_PRODUCTS:
        return "User wants to compare products side by side"
    
    return f"Best match for intent: {intent.value}"
```

---

## 🎮 How Demo Scripts Work (Without Server)

### Why Demo Works Without Running Server:

```python
# demo_script.py

import sys
sys.path.insert(0, 'packages/core')  # Add SDK to Python path

from commerce_genui import CommerceGenUI  # Import directly!

sdk = CommerceGenUI()  # Create instance IN THIS SCRIPT

# Use it:
decision = sdk.decide_ui("Show me cheap laptops", "Found 12", {...})
print(decision.component)  # Works!
```

**How this works:**

1. **Local Import** - We installed SDK locally: `pip install -e packages/core`
2. **Direct Usage** - SDK is just a Python class, no server needed
3. **In-Process** - Everything runs in the same Python process

**It's like using any Python library:**
```python
import requests  # No requests server needed
response = requests.get("https://...")  # Just works
```

---

## 👤 What Users Need to Do (Integration Guide)

### Option A: Backend Integration (Recommended)

**Step 1: Install SDK**
```bash
pip install commerce-genui
```

**Step 2: Use in Your Backend**
```python
# your-backend/api.py
from fastapi import FastAPI
from commerce_genui import CommerceGenUI

app = FastAPI()
sdk = CommerceGenUI()

@app.post("/chat")
async def chat(message: str, context: dict):
    # 1. Your agent processes message
    agent_response = your_agent.respond(message)
    
    # 2. SDK decides which UI to show
    decision = sdk.decide_ui(
        user_message=message,
        agent_response=agent_response,
        context=context  # Your products, cart, user data, etc.
    )
    
    # 3. Return to frontend
    return {
        "message": agent_response,
        "ui_component": decision.component,  # "CartPage"
        "ui_props": decision.data            # {items: [...]}
    }
```

**Step 3: Create Components in Frontend**
```typescript
// your-frontend/components/CartPage.tsx
export function CartPage({ items, total }) {
  return (
    <div>
      <h1>Your Cart</h1>
      {items.map(item => (
        <div key={item.id}>{item.name} - ${item.price}</div>
      ))}
      <p>Total: ${total}</p>
    </div>
  )
}
```

**Step 4: Connect Backend to Frontend**
```typescript
// your-frontend/App.tsx
import { CartPage } from './components/CartPage'
import { ProductGrid } from './components/ProductGrid'

const components = {
  CartPage,
  ProductGrid,
  // ... all your components
}

function App() {
  const [response, setResponse] = useState(null)
  
  async function sendMessage(message) {
    const res = await fetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context: {...} })
    })
    const data = await res.json()
    setResponse(data)
  }
  
  // Render the component SDK chose
  const Component = components[response?.ui_component]
  
  return (
    <div>
      {Component && <Component {...response.ui_props} />}
    </div>
  )
}
```

---

### Option B: Frontend-Only (Alternative)

**If you want to use SDK in TypeScript:**
```typescript
// Future: @commerce-genui/core (not built yet)
import { CommerceGenUI } from '@commerce-genui/core'

const sdk = new CommerceGenUI()

const decision = sdk.decideUI(
  "Show me cheap laptops",
  "Found 12 products",
  { products: [...] }
)

// decision.component = "BudgetSlider"
// decision.props = {...}
```

**Note:** TypeScript SDK is on roadmap (not built for hackathon)

---

## 🆚 Tambo vs Commerce GenUI SDK

### Tambo AI (Parent Platform)

**What it is:**
- Full platform for building generative UI applications
- Provides infrastructure, hosting, SDKs, UI components
- Multi-language, multi-domain support
- Complete end-to-end solution

**Features:**
```
┌─────────────────────────────────────┐
│         TAMBO PLATFORM              │
├─────────────────────────────────────┤
│ • Chat infrastructure               │
│ • UI rendering engine               │
│ • Component library                 │
│ • Backend hosting                   │
│ • Agent orchestration               │
│ • Multiple domains (shopping, docs, │
│   travel, finance, etc.)            │
└─────────────────────────────────────┘
```

**Use when:** You want everything pre-built

---

### Commerce GenUI SDK (Our Contribution)

**What it is:**
- **Specialized decision engine for e-commerce only**
- Extracted from our OnlineBoutiqueAgent experience
- Reusable across ANY e-commerce app
- Just the decision logic (not full platform)

**Features:**
```
┌─────────────────────────────────────┐
│    COMMERCE GENUI SDK               │
├─────────────────────────────────────┤
│ • Intent detection (patterns)       │
│ • Component selection               │
│ • Props generation                  │
│ • Explainability                    │
│ • Plugin architecture               │
│ • E-commerce domain ONLY            │
└─────────────────────────────────────┘
```

**Use when:** You want control over your stack

---

### Side-by-Side Comparison

| Feature | Tambo Platform | Commerce GenUI SDK |
|---------|----------------|-------------------|
| **Scope** | Full platform | Decision engine only |
| **Domains** | All (shopping, docs, travel) | E-commerce only |
| **Components** | Provided | You build them |
| **Backend** | Hosted for you | You host it |
| **Integration** | Use Tambo's stack | Use YOUR stack |
| **Customization** | Tambo's way | Your way |
| **Control** | Less (opinionated) | More (flexible) |
| **Setup Time** | Fast (pre-built) | Medium (DIY) |
| **Dependency** | Locked to Tambo | Independent |
| **Best For** | Rapid prototyping | Production control |

---

### How They Work Together

**Commerce GenUI is BUILT ON Tambo concepts:**

```
┌─────────────────────────────────────────────────┐
│           TAMBO PLATFORM                        │
│  (Provides concepts, patterns, inspiration)     │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ We learned from Tambo │
        │ • Generative UI idea  │
        │ • Intent detection    │
        │ • Component selection │
        └───────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│      COMMERCE GENUI SDK                         │
│  (Extracted, specialized, reusable)             │
│  • E-commerce domain only                       │
│  • Pattern-based (not LLM)                      │
│  • Minimal dependencies                         │
│  • Works with ANY backend                       │
└─────────────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │ You build on top of:  │
        │ • Your components     │
        │ • Your backend        │
        │ • Your agent          │
        │ • Your database       │
        └───────────────────────┘
```

**Relationship:**
- **Tambo** = Parent framework (inspiration)
- **Commerce GenUI** = Specialized SDK (extraction)
- **Your App** = Integration (implementation)

---

## 🎯 Real-World Example (Cart Component)

### You Ask: "Does user create CartPage component?"

**YES! Here's exactly how:**

### Step 1: You Create the Component
```typescript
// your-app/components/CartPage.tsx
export function CartPage({ items, total, onCheckout }) {
  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} />
              <h3>{item.name}</h3>
              <p>${item.price} x {item.quantity}</p>
            </div>
          ))}
          
          <div className="total">
            <h2>Total: ${total}</h2>
            <button onClick={onCheckout}>Checkout</button>
          </div>
        </>
      )}
    </div>
  )
}
```

**YOU design this however you want!** SDK doesn't care about styling, framework, etc.

---

### Step 2: SDK Decides When to Show It
```python
# your-backend/api.py

@app.post("/chat")
async def chat(message: str):
    # User says: "What's in my cart?"
    
    # 1. Your database call
    cart_items = database.get_cart(user_id)
    
    # 2. SDK decides
    decision = sdk.decide_ui(
        user_message=message,           # "What's in my cart?"
        agent_response="You have 3 items",
        context={
            "cart_items": cart_items,    # Your data
            "cart_total": sum(item.price * item.qty for item in cart_items)
        }
    )
    
    # SDK returns:
    # {
    #   component: "CartPage",  ← SDK chose this!
    #   props: {
    #     items: [...],          ← SDK built these!
    #     total: 299.99
    #   },
    #   reason: "User wants to view cart"
    # }
    
    return decision
```

---

### Step 3: Frontend Renders It
```typescript
// your-app/ChatInterface.tsx

const response = await fetch('/chat', {
  method: 'POST',
  body: JSON.stringify({ message: "What's in my cart?" })
})

const { component, props } = await response.json()

// component = "CartPage"
// props = { items: [...], total: 299.99 }

// Map component name to actual component
const Component = componentRegistry[component]  // CartPage component

// Render it with SDK-provided props
return <Component {...props} />  // <CartPage items={[...]} total={299.99} />
```

---

## 🔄 Complete Flow (End to End)

```
USER                FRONTEND              BACKEND              SDK              DATABASE
  │                    │                     │                  │                   │
  │ "Show my cart"     │                     │                  │                   │
  ├──────────────────→ │                     │                  │                   │
  │                    │ POST /chat          │                  │                   │
  │                    ├───────────────────→ │                  │                   │
  │                    │                     │ get_cart(user)   │                   │
  │                    │                     ├────────────────────────────────────→ │
  │                    │                     │ ← cart_items     │                   │
  │                    │                     │                  │                   │
  │                    │                     │ decide_ui(...)   │                   │
  │                    │                     ├────────────────→ │                   │
  │                    │                     │                  │ 1. Detect intent  │
  │                    │                     │                  │    "VIEW_CART"    │
  │                    │                     │                  │                   │
  │                    │                     │                  │ 2. Select component
  │                    │                     │                  │    "CartPage"     │
  │                    │                     │                  │                   │
  │                    │                     │                  │ 3. Build props    │
  │                    │                     │                  │    {items, total} │
  │                    │                     │                  │                   │
  │                    │                     │ ← UIDecision     │                   │
  │                    │                     │ {                │                   │
  │                    │                     │   component: "CartPage",             │
  │                    │                     │   props: {...}   │                   │
  │                    │                     │ }                │                   │
  │                    │ ← Response          │                  │                   │
  │                    │ {                   │                  │                   │
  │                    │   component,        │                  │                   │
  │                    │   props             │                  │                   │
  │                    │ }                   │                  │                   │
  │                    │                     │                  │                   │
  │                    │ 4. Render CartPage  │                  │                   │
  │ ← CartPage shown   │    with props       │                  │                   │
  │    (3 items,       │                     │                  │                   │
  │     $299.99)       │                     │                  │                   │
```

---

## 📝 Summary: What You Need to Understand

### What SDK Does:
✅ Detects intent from user message (pattern matching)  
✅ Selects appropriate component name ("CartPage", "ProductGrid")  
✅ Builds props for that component  
✅ Explains why it made that choice  

### What SDK Does NOT Do:
❌ Doesn't provide React/Vue components (you build them)  
❌ Doesn't run as a separate server (it's a library)  
❌ Doesn't store data (you provide context)  
❌ Doesn't process payments (your backend does that)  

### What Users Do:
1. **Install SDK**: `pip install commerce-genui`
2. **Create Components**: Build CartPage, ProductGrid, etc. in your frontend
3. **Use SDK in Backend**: Import and call `sdk.decide_ui()`
4. **Render in Frontend**: Map component name to actual component

### Difference from Tambo:
- **Tambo** = Full platform (everything provided)
- **Commerce GenUI** = Decision engine only (you provide components)
- **Advantage** = You control your stack, SDK just helps with decisions

---

**Think of SDK as a SMART ROUTER:**
- User says something → SDK routes to right component
- Like React Router, but AI-powered for commerce UIs

---

**Any questions? This is the complete mental model!** 🎓
