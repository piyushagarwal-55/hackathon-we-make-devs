/**
 * Commerce GenUI - TypeScript Type Definitions
 * Shared types across all packages
 */

/**
 * Commerce Intent Types
 */
export enum CommerceIntent {
  // Product Discovery
  BROWSE_PRODUCTS = "BROWSE_PRODUCTS",
  SEARCH_PRODUCTS = "SEARCH_PRODUCTS",
  FILTER_BY_PRICE = "FILTER_BY_PRICE",
  FILTER_BY_CATEGORY = "FILTER_BY_CATEGORY",
  
  // Comparison & Analysis
  COMPARE_PRODUCTS = "COMPARE_PRODUCTS",
  VIEW_PRICE_TRENDS = "VIEW_PRICE_TRENDS",
  
  // Shopping Actions
  VIEW_CART = "VIEW_CART",
  CHECKOUT = "CHECKOUT",
  EXPRESS_CHECKOUT = "EXPRESS_CHECKOUT",
  
  // User Account
  VIEW_PROFILE = "VIEW_PROFILE",
  VIEW_ORDER_HISTORY = "VIEW_ORDER_HISTORY",
  TRACK_ORDER = "TRACK_ORDER",
  
  // Recommendations
  VIEW_DEALS = "VIEW_DEALS",
  RECOMMEND_BUNDLE = "RECOMMEND_BUNDLE",
  
  // Advanced
  VIRTUAL_TRYON = "VIRTUAL_TRYON",
  
  // Fallback
  UNKNOWN = "UNKNOWN"
}

/**
 * UI Decision returned by backend SDK
 */
export interface UIDecision {
  /** Detected user intent */
  intent: CommerceIntent;
  
  /** Component name to render */
  component: string;
  
  /** Human-readable explanation */
  reason: string;
  
  /** Component props/data */
  data: Record<string, any>;
  
  /** Confidence score (0-1) */
  confidence: number;
  
  /** Alternative components that could work */
  alternatives: string[];
  
  /** Original user message */
  userMessage?: string;
  
  /** Agent response */
  agentResponse?: string;
}

/**
 * Product Type
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
  features?: ProductFeature[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  discount?: number;
}

export interface ProductFeature {
  key: string;
  value: string;
  label?: string;
}

/**
 * Cart Item
 */
export interface CartItem {
  product: Product;
  quantity: number;
  selectedFeatures?: Record<string, string>;
}

/**
 * User Type
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  currency?: string;
  language?: string;
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

/**
 * Order Type
 */
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: Address;
  trackingNumber?: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Chat Message
 */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  uiDecision?: UIDecision;
}

/**
 * Context passed to SDK
 */
export interface CommerceContext {
  products?: Product[];
  cart?: CartItem[];
  user?: User;
  orders?: Order[];
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  };
  [key: string]: any;
}

/**
 * Component Props Types
 */
export interface ProductGridProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  layout?: "grid" | "list";
  columns?: number;
}

export interface ComparisonTableProps {
  products: Product[];
  onSelect?: (product: Product) => void;
  highlightDifferences?: boolean;
}

export interface BudgetSliderProps {
  minPrice: number;
  maxPrice: number;
  currentMin?: number;
  currentMax?: number;
  onPriceChange?: (min: number, max: number) => void;
  productCount?: number;
}

export interface CheckoutWizardProps {
  cartItems: CartItem[];
  total: number;
  onComplete?: (order: Order) => void;
  expressMode?: boolean;
  user?: User;
}

export interface UserProfileProps {
  user: User;
  onUpdate?: (user: Partial<User>) => void;
  onLogout?: () => void;
}

export interface OrderHistoryProps {
  orders: Order[];
  onTrackOrder?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}

export interface DealBadgePanelProps {
  deals: Product[];
  onDealClick?: (product: Product) => void;
  countdown?: string;
}

export interface BundleBuilderProps {
  products: Product[];
  onBundleCreate?: (bundle: Product[]) => void;
  suggestedBundles?: Product[][];
}

export interface TryOnStudioProps {
  product: Product;
  onConfirm?: () => void;
  onCancel?: () => void;
  userPhoto?: string;
}

export interface CartSummaryProps {
  items: CartItem[];
  total: number;
  onCheckout?: () => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

/**
 * Component Registry
 */
export interface ComponentConfig {
  name: string;
  description: string;
  intents: CommerceIntent[];
  propsBuilder?: (context: CommerceContext) => Record<string, any>;
  priority?: number;
}

/**
 * SDK Configuration
 */
export interface CommerceGenUIConfig {
  /** Backend API endpoint */
  backendUrl: string;
  
  /** Tambo API key */
  tamboApiKey?: string;
  
  /** Custom components */
  components?: Record<string, React.ComponentType<any>>;
  
  /** Enable debug logging */
  debug?: boolean;
  
  /** Custom intent patterns */
  intentPatterns?: IntentPattern[];
}

export interface IntentPattern {
  keywords: string[];
  intent: CommerceIntent;
  components: string[];
  priority: number;
}

/**
 * Hook Return Types
 */
export interface UseCommerceGenUIReturn {
  /** Send a message and get UI decision */
  sendMessage: (message: string, context?: CommerceContext) => Promise<UIDecision>;
  
  /** Current UI decision */
  decision: UIDecision | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: Error | null;
  
  /** Current context */
  context: CommerceContext;
  
  /** Update context */
  updateContext: (updates: Partial<CommerceContext>) => void;
  
  /** Chat history */
  messages: ChatMessage[];
}

/**
 * API Response Types
 */
export interface ChatResponse {
  agent_response: string;
  ui_component: string;
  ui_props: Record<string, any>;
  ui_reason: string;
  context: CommerceContext;
}

export interface ChatRequest {
  message: string;
  context: CommerceContext;
}
