# ShopSage - AI E-commerce Agent with Tambo Generative UI

ShopSage is a generative AI e-commerce platform where users shop through natural language instead of fixed pages. At the core of the system is our custom Commerce GenUI SDK, which acts as an intent-to-UI orchestration layer — it analyzes user messages, session context, and agent outputs to deterministically select UI components and generate structured, type-safe props. This SDK bridges backend AI agents with frontend React components, enabling true UI morphing based on user intent. Tambo is used as the rendering and generative interface layer on the frontend, consuming the decisions produced by our SDK and dynamically mounting the appropriate components in real time. Together, ShopSage provides the platform experience, Commerce GenUI handles intelligence and UI decisions, and Tambo executes those decisions visually — creating a complete pipeline where conversational AI directly drives application structure, layout, and user flow.

## 🚀 Features

- **Product Finder Agent** - Search, filter, compare products from Cymbal Shops
- **Smart Shopping Cart** - Add items via voice/click, persistent across sessions
- **Product Recommendations** - AI-powered personalized suggestions
- **Conversational Checkout** - Extract shipping details from natural language
- **PDF Export** - Professional order invoices with one click
- **Virtual Try-On** (Coming Soon) - AI-powered product visualization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tambo SDK
- **Backend**: Python, FastAPI, Google Gemini AI
- **Data Source**: Cymbal Shops (https://cymbal-shops.retail.cymbal.dev)

## 📦 Setup

### Backend

```bash
cd OnlineBoutiqueAgent/ecommerce_agent
pip install -r requirements.txt
python simple_server.py
```

Server runs on: http://localhost:8000

### Frontend

```bash
cd frontend
bun install
bun run dev
```

Frontend runs on: http://localhost:3000

### Environment Variables

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
NEXT_PUBLIC_AGENT_BACKEND_URL=http://localhost:8000
```

**Backend** (`OnlineBoutiqueAgent/.env`):
```
GOOGLE_API_KEY=your_gemini_api_key
```

## 🎯 Usage

1. **Browse Products**: "show me all products"
2. **Add to Cart**: Click "Add" button or say "add 3 sunglasses to cart"
3. **View Cart**: "show me my cart"
4. **Checkout**: "checkout to John Doe, 123 Main Street, New York, 10001"
5. **Export PDF**: "export as pdf"


