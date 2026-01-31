# ShopSage Architecture - The UI Strikes Back Edition

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                            │
│                     http://localhost:3000                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js + Tambo)                    │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │              Tambo Renderer (Dynamic UI)                     ││
│ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   ││
│ │  │Product │ │Budget  │ │Compare │ │TryOn   │ │Checkout│   ││
│ │  │Grid    │ │Slider  │ │Table   │ │Studio  │ │Wizard  │   ││
│ │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   ││
│ │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   ││
│ │  │Outfit  │ │Bundle  │ │Cart    │ │Deal    │ │Price   │   ││
│ │  │Board   │ │Builder │ │Optim.  │ │Panel   │ │Chart   │   ││
│ │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│              Component Registration (tambo.ts)                   │
│         [10 components registered with Zod schemas]              │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Request
                         │ { message: "Show cheap options" }
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│            BACKEND (Python + Google ADK + Tambo Engine)          │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │                  ADK Web Runner (Port 8000)                  ││
│ │                                                              ││
│ │  ┌──────────────────────────────────────────────────────┐  ││
│ │  │         Tambo Integrated Agent Wrapper               │  ││
│ │  │  (tambo_integrated_agent.py)                         │  ││
│ │  │                                                       │  ││
│ │  │  1. Receives user message                            │  ││
│ │  │  2. Routes to appropriate agent                      │  ││
│ │  │  3. Gets agent response                              │  ││
│ │  │  4. Calls Tambo UI Decision Engine                   │  ││
│ │  │  5. Returns: agent_response + ui_component + props   │  ││
│ │  └──────────────────────────────────────────────────────┘  ││
│ │                           │                                  ││
│ │                           ▼                                  ││
│ │  ┌──────────────────────────────────────────────────────┐  ││
│ │  │       Ecommerce Root Agent (agent.py)                │  ││
│ │  │     Gemini 2.5 Flash-Lite                            │  ││
│ │  │                                                       │  ││
│ │  │  Orchestrates 5 specialized agents:                  │  ││
│ │  │  ┌────────────────────────────────────────────────┐  │  ││
│ │  │  │ 🔍 Product Finder Agent                        │  │  ││
│ │  │  │    - Search products on Cymbal Shops           │  │  ││
│ │  │  │    - Get product details                       │  │  ││
│ │  │  │    - Web scraping (BeautifulSoup)              │  │  ││
│ │  │  └────────────────────────────────────────────────┘  │  ││
│ │  │  ┌────────────────────────────────────────────────┐  │  ││
│ │  │  │ 💡 Product Recommendation Agent                │  │  ││
│ │  │  │    - Browse all products                       │  │  ││
│ │  │  │    - Personalized recommendations              │  │  ││
│ │  │  │    - Category-based suggestions                │  │  ││
│ │  │  └────────────────────────────────────────────────┘  │  ││
│ │  │  ┌────────────────────────────────────────────────┐  │  ││
│ │  │  │ 🛒 Order Placement Agent                       │  │  ││
│ │  │  │    - Add/remove from cart                      │  │  ││
│ │  │  │    - View cart & calculate totals              │  │  ││
│ │  │  │    - Simulate checkout                         │  │  ││
│ │  │  └────────────────────────────────────────────────┘  │  ││
│ │  │  ┌────────────────────────────────────────────────┐  │  ││
│ │  │  │ ✨ Virtual Try-On Agent                        │  │  ││
│ │  │  │    - Process user images                       │  │  ││
│ │  │  │    - Generate AI try-on results                │  │  ││
│ │  │  │    - Style recommendations                     │  │  ││
│ │  │  └────────────────────────────────────────────────┘  │  ││
│ │  │  ┌────────────────────────────────────────────────┐  │  ││
│ │  │  │ 📄 Export Data Agent                           │  │  ││
│ │  │  │    - Generate order PDFs                       │  │  ││
│ │  │  │    - Export order confirmations                │  │  ││
│ │  │  │    - Professional formatting                   │  │  ││
│ │  │  └────────────────────────────────────────────────┘  │  ││
│ │  └──────────────────────────────────────────────────────┘  ││
│ │                           │                                  ││
│ │                           ▼                                  ││
│ │  ┌──────────────────────────────────────────────────────┐  ││
│ │  │    Tambo UI Decision Engine (tambo_ui_engine.py)    │  ││
│ │  │                                                       │  ││
│ │  │  Intent Detection:                                   │  ││
│ │  │  • Analyzes user message keywords                    │  ││
│ │  │  • Examines agent response content                   │  ││
│ │  │  • Considers current context (cart, products)        │  ││
│ │  │                                                       │  ││
│ │  │  Component Selection:                                │  ││
│ │  │  • Maps intent → component                           │  ││
│ │  │  • Applies priority rules                            │  ││
│ │  │  • Handles special cases (express mode, etc.)        │  ││
│ │  │                                                       │  ││
│ │  │  Prop Generation:                                    │  ││
│ │  │  • Extracts data from context                        │  ││
│ │  │  • Formats for component schema                      │  ││
│ │  │  • Adds metadata (reason, etc.)                      │  ││
│ │  └──────────────────────────────────────────────────────┘  ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                   │
│                  External Data Sources:                          │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  🏪 Cymbal Shops (cymbal-shops.retail.cymbal.dev)      │   │
│   │     - Live product catalog                             │   │
│   │     - Real-time price data                             │   │
│   │     - Product images & details                         │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

```

## 📊 Data Flow: Complete User Journey

```
Step 1: DISCOVERY
   User: "Show me shirts"
   ↓
   Product Finder Agent → Scrapes Cymbal Shops → Returns 12 shirts
   ↓
   UI Engine: Detects "show" → Selects ProductGrid
   ↓
   Frontend: Renders 3x4 grid of shirt cards
   ↓
   User sees: Product images, prices, ratings, "Add to Cart" buttons

Step 2: BUDGET FILTERING ⚡ 
   User: "Show cheap options"
   ↓
   UI Engine: Detects "cheap" → Selects BudgetSlider
   ↓
   Frontend: UI MORPHS to dual-range slider
   ↓
   Slider Props: { minPrice: 0, maxPrice: 100, matchingProducts: 8 }
   ↓
   User sees: Interactive slider, quick presets, product count

Step 3: COMPARISON ⚡
   User: "Compare the top 3"
   ↓
   UI Engine: Detects "compare" → Selects ComparisonTable
   ↓
   Frontend: UI MORPHS to side-by-side table
   ↓
   Table Props: { products: [3 shirts], features: [...] }
   ↓
   User sees: Feature-by-feature comparison, prices, "Select" buttons

Step 4: VISUALIZATION ⚡
   User: "Let me try this blue one on"
   ↓
   Virtual Try-On Agent activates
   ↓
   UI Engine: Detects "try on" → Selects TryOnStudio
   ↓
   Frontend: UI MORPHS to try-on interface
   ↓
   Studio Props: { product: {...}, tips: [...] }
   ↓
   User sees: Upload area, product preview, AI generation button

Step 5: BUNDLING ⚡
   User: "Add pants to make a bundle"
   ↓
   Product Recommendation Agent → Suggests matching pants
   ↓
   UI Engine: Detects "bundle" → Selects BundleBuilder
   ↓
   Frontend: UI MORPHS to bundle interface
   ↓
   Builder Props: { mainProduct: shirt, suggestedItems: [4 pants], discount: 15 }
   ↓
   User sees: Main item + suggestions, savings calculator

Step 6: EXPRESS CHECKOUT ⚡
   User: "Checkout fast"
   ↓
   Order Placement Agent → Prepares cart
   ↓
   UI Engine: Detects "checkout" + "fast" → Selects CheckoutWizard(express=true)
   ↓
   Frontend: UI MORPHS to checkout wizard with express badge
   ↓
   Wizard Props: { cartItems: [...], expressMode: true, shippingCost: 0 }
   ↓
   User sees: 4-step wizard, express mode badge, free shipping

Step 7: ORDER COMPLETE
   User: Clicks "Place Order"
   ↓
   Order Placement Agent → Simulates checkout
   ↓
   Export Agent → Generates PDF receipt
   ↓
   UI: Success screen with order number
   ↓
   User receives: Order confirmation + downloadable PDF
```

## 🎯 The Magic: Intent → Component Mapping

```python
# In tambo_ui_engine.py

intent_patterns = {
    'budget': {
        'keywords': ['cheap', 'affordable', 'budget', 'under', 'price range'],
        'component': 'BudgetSlider',
        'priority': 9
    },
    'comparison': {
        'keywords': ['compare', 'vs', 'which is better'],
        'component': 'ComparisonTable',
        'priority': 10
    },
    'tryon': {
        'keywords': ['try on', 'wear', 'look on me'],
        'component': 'TryOnStudio',
        'priority': 10
    },
    # ... and 7 more
}

# When user says "Show cheap options":
def decide_ui_component(user_msg, agent_response, context):
    # 1. Detect intent: "cheap" found → 'budget' intent
    # 2. Select component: BudgetSlider (priority 9)
    # 3. Generate props from context:
    return UIComponentConfig(
        component_name='BudgetSlider',
        props={
            'minPrice': 0,
            'maxPrice': 100,
            'matchingProducts': 8,
            'presets': [...]
        },
        reason='User wants to filter by price'
    )
```

## 🏗️ Component Lifecycle

```
Registration (Build Time)
    ↓
    Components defined in src/components/tambo/ecommerce/*.tsx
    ↓
    Exported with Zod schemas
    ↓
    Registered in src/lib/tambo.ts
    ↓
    Tambo SDK validates schemas
    ↓
    Ready for dynamic rendering

Selection (Runtime)
    ↓
    User sends message
    ↓
    Agent processes & responds
    ↓
    UI Engine analyzes intent
    ↓
    Component selected from 10 options
    ↓
    Props generated from context
    ↓
    Config sent to frontend

Rendering (Frontend)
    ↓
    Tambo Renderer receives config
    ↓
    Unmounts current component
    ↓
    Mounts new component with props
    ↓
    Smooth transition animation
    ↓
    Component fully interactive
    ↓
    User engages with new UI
```

## 🎨 Why This Architecture Wins

### 1. **Separation of Concerns**
- **Agents:** Business logic & data
- **UI Engine:** Intelligence & decision-making
- **Components:** Presentation & interaction
- **Tambo:** Orchestration & rendering

### 2. **Scalability**
- Add new component? Just register it
- Add new agent? Plug it in
- Add new intent? Update engine
- No tight coupling

### 3. **Testability**
- Each component tests independently
- UI Engine tests with mock data
- Agents test with mock services
- End-to-end tests for flows

### 4. **User Experience**
- Zero page loads
- Instant UI transformations
- Natural language interface
- Context-aware responses

### 5. **Innovation**
- Agents provide intelligence
- Tambo provides adaptability
- Together = Intelligent, adaptive UX
- This fusion is RARE in hackathons

---

## 📈 Technical Metrics

| Metric | Value |
|--------|-------|
| **Frontend Components** | 10 |
| **Backend Agents** | 5 |
| **UI Mutations in Demo** | 5 |
| **Lines of Code (Frontend)** | ~2,500 |
| **Lines of Code (Backend)** | ~800 |
| **Dependencies** | Tambo, ADK, Next.js, React, Recharts |
| **Average Response Time** | <2 seconds |
| **Time to Checkout** | <2 minutes |
| **Component Reusability** | 100% |

---

## 🌟 The Differentiator

**Other Projects:**
```
User Input → AI Chatbot → Text Response
              ↓
         (maybe) Button Click
              ↓
         Static UI Component
```

**ShopSage:**
```
User Input → Multi-Agent System → Intelligent Response
              ↓                      ↓
         Data & Context         Intent Analysis
              ↓                      ↓
         Tambo UI Engine ← ← ← ← ← ←
              ↓
         Perfect Component Selected
              ↓
         Dynamic UI Morphs
              ↓
         User Interacts Naturally
              ↓
         (Loop continues with full context)
```

**Result:** Intelligence + Adaptability = Winning Hackathon Submission

---

Created: January 31, 2026  
For: The UI Strikes Back Hackathon  
Project: ShopSage - Cymbal Shops E-commerce Agent with Generative UI
