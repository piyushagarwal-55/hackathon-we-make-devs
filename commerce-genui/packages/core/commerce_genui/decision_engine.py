"""
Decision Engine - Core logic for converting agent responses to UI decisions
Extracted and enhanced from ShopSage project
"""

from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field
from .intent_schema import (
    CommerceIntent,
    UIDecision,
    IntentPattern,
    DEFAULT_INTENT_PATTERNS
)


@dataclass
class UIIntent:
    """Lightweight UI decision output"""
    intent: CommerceIntent
    component: str
    reason: str
    data: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 1.0


@dataclass
class ComponentConfig:
    """Configuration for a registered component"""
    name: str
    description: str
    intents: List[CommerceIntent]
    props_builder: Optional[Callable] = None
    priority: int = 1


class ComponentRegistry:
    """
    Registry for UI components
    Allows developers to register custom components
    """
    
    def __init__(self):
        self.components: Dict[str, ComponentConfig] = {}
        self._register_defaults()
    
    def _register_defaults(self):
        """Register default commerce components"""
        default_components = [
            ComponentConfig(
                name="ProductGrid",
                description="Display products in a grid layout",
                intents=[
                    CommerceIntent.BROWSE_PRODUCTS,
                    CommerceIntent.SEARCH_PRODUCTS
                ],
                priority=1
            ),
            ComponentConfig(
                name="ComparisonTable",
                description="Compare multiple products side by side",
                intents=[CommerceIntent.COMPARE_PRODUCTS],
                priority=10
            ),
            ComponentConfig(
                name="BudgetSlider",
                description="Interactive price range filter",
                intents=[CommerceIntent.FILTER_BY_PRICE],
                priority=10
            ),
            ComponentConfig(
                name="CheckoutWizard",
                description="Multi-step checkout process",
                intents=[
                    CommerceIntent.CHECKOUT,
                    CommerceIntent.EXPRESS_CHECKOUT,
                    CommerceIntent.VIEW_CART
                ],
                priority=15
            ),
            ComponentConfig(
                name="UserProfile",
                description="User account and profile management",
                intents=[CommerceIntent.VIEW_PROFILE],
                priority=15
            ),
            ComponentConfig(
                name="OrderHistory",
                description="Past orders and tracking",
                intents=[
                    CommerceIntent.VIEW_ORDER_HISTORY,
                    CommerceIntent.TRACK_ORDER
                ],
                priority=15
            ),
            ComponentConfig(
                name="DealBadgePanel",
                description="Special deals and discounts",
                intents=[CommerceIntent.VIEW_DEALS],
                priority=10
            ),
            ComponentConfig(
                name="BundleBuilder",
                description="Create product bundles",
                intents=[CommerceIntent.RECOMMEND_BUNDLE],
                priority=10
            ),
            ComponentConfig(
                name="TryOnStudio",
                description="Virtual product try-on",
                intents=[CommerceIntent.VIRTUAL_TRYON],
                priority=10
            ),
        ]
        
        for config in default_components:
            self.register(config)
    
    def register(self, config: ComponentConfig):
        """Register a new component"""
        self.components[config.name] = config
    
    def get_for_intent(self, intent: CommerceIntent) -> List[ComponentConfig]:
        """Get all components that can handle an intent"""
        return [
            comp for comp in self.components.values()
            if intent in comp.intents
        ]


class CommerceGenUI:
    """
    Main SDK class - The core decision engine
    
    Example:
        sdk = CommerceGenUI()
        decision = sdk.decide_ui(
            user_message="Show me cheap laptops",
            agent_response="Found 15 laptops under $800",
            context={"products": [...]}
        )
    """
    
    def __init__(self):
        self.registry = ComponentRegistry()
        self.intent_patterns = DEFAULT_INTENT_PATTERNS.copy()
        self.custom_handlers: Dict[str, Callable] = {}
    
    def register_component(
        self,
        name: str,
        description: str,
        intents: List[CommerceIntent],
        props_builder: Optional[Callable] = None,
        priority: int = 1
    ):
        """
        Register a custom component
        
        Args:
            name: Component name (must match Tambo registration)
            description: What this component does
            intents: Which intents trigger this component
            props_builder: Optional function to build props
            priority: Higher = more likely to be selected
        """
        config = ComponentConfig(
            name=name,
            description=description,
            intents=intents,
            props_builder=props_builder,
            priority=priority
        )
        self.registry.register(config)
    
    def add_intent_pattern(
        self,
        keywords: List[str],
        intent: CommerceIntent,
        components: List[str],
        priority: int = 1
    ):
        """Add custom intent pattern"""
        pattern = IntentPattern(
            keywords=keywords,
            intent=intent,
            components=components,
            priority=priority
        )
        self.intent_patterns.append(pattern)
    
    def detect_intent(
        self,
        user_message: str,
        agent_response: str = "",
        context: Optional[Dict[str, Any]] = None
    ) -> CommerceIntent:
        """
        Detect user intent from message and context
        
        Returns the highest-priority matching intent
        """
        message_lower = user_message.lower()
        response_lower = agent_response.lower()
        combined = f"{message_lower} {response_lower}"
        
        # Find matching patterns
        matches = []
        for pattern in self.intent_patterns:
            for keyword in pattern.keywords:
                if keyword in combined:
                    matches.append(pattern)
                    break
        
        if not matches:
            return CommerceIntent.BROWSE_PRODUCTS
        
        # Return highest priority intent
        matches.sort(key=lambda p: p.priority, reverse=True)
        return matches[0].intent
    
    def select_component(
        self,
        intent: CommerceIntent,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Select best component for intent based on context
        """
        candidates = self.registry.get_for_intent(intent)
        
        if not candidates:
            return "ProductGrid"  # Default fallback
        
        # Context-based prioritization
        if context:
            # If cart has items, prefer cart components
            if context.get('cart_items') and len(context['cart_items']) > 0:
                if intent in [CommerceIntent.CHECKOUT, CommerceIntent.VIEW_CART]:
                    return "CheckoutWizard"
        
        # Return highest priority component
        candidates.sort(key=lambda c: c.priority, reverse=True)
        return candidates[0].name
    
    def build_props(
        self,
        component: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Build props for component based on context
        Uses custom props_builder if registered, otherwise uses defaults
        """
        context = context or {}
        
        # Check for custom props builder
        config = self.registry.components.get(component)
        if config and config.props_builder:
            return config.props_builder(context)
        
        # Default props builders
        return self._default_props_builder(component, context)
    
    def _default_props_builder(
        self,
        component: str,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Default props builders for standard components"""
        
        if component == "ProductGrid":
            return {
                "products": context.get("products", []),
                "columns": 4
            }
        
        elif component == "ComparisonTable":
            products = context.get("products", [])[:4]
            return {"products": products}
        
        elif component == "BudgetSlider":
            products = context.get("products", [])
            prices = [p.get("price", 0) for p in products if "price" in p]
            return {
                "minPrice": min(prices) if prices else 0,
                "maxPrice": max(prices) if prices else 1000,
                "productCount": len(products)
            }
        
        elif component == "CheckoutWizard":
            return {
                "cartItems": context.get("cart_items", []),
                "expressMode": context.get("express_mode", False)
            }
        
        elif component == "UserProfile":
            return {
                "user": context.get("user"),
                "cart_items": context.get("cart_items", []),
                "orders": context.get("orders", []),
                "total_cart_items": len(context.get("cart_items", [])),
                "total_orders": len(context.get("orders", []))
            }
        
        elif component == "OrderHistory":
            return {
                "orders": context.get("orders", [])
            }
        
        elif component == "DealBadgePanel":
            return {
                "deals": context.get("deals", [])
            }
        
        elif component == "BundleBuilder":
            return {
                "availableProducts": context.get("products", []),
                "selectedProducts": context.get("bundle_items", []),
                "bundleDiscount": 15
            }
        
        elif component == "TryOnStudio":
            product = context.get("selected_product") or (
                context.get("products", [{}])[0] if context.get("products") else {}
            )
            return {
                "productImage": product.get("image", ""),
                "productName": product.get("name", "Product")
            }
        
        return {}
    
    def get_selection_reason(
        self,
        intent: CommerceIntent,
        component: str,
        user_message: str
    ) -> str:
        """Generate human-readable reason for component selection"""
        
        reason_templates = {
            CommerceIntent.FILTER_BY_PRICE: f"User is budget-conscious based on: '{user_message}'",
            CommerceIntent.COMPARE_PRODUCTS: "User wants to compare products side by side",
            CommerceIntent.VIEW_CART: "User requested to view cart",
            CommerceIntent.CHECKOUT: "User is ready to checkout",
            CommerceIntent.EXPRESS_CHECKOUT: "User wants fast checkout",
            CommerceIntent.VIEW_PROFILE: "User requested profile information",
            CommerceIntent.VIEW_ORDER_HISTORY: "User wants to see past orders",
            CommerceIntent.TRACK_ORDER: "User wants to track order status",
            CommerceIntent.VIEW_DEALS: "User is looking for deals and discounts",
            CommerceIntent.RECOMMEND_BUNDLE: "User wants bundled products",
            CommerceIntent.VIRTUAL_TRYON: "User wants to visualize product",
            CommerceIntent.BROWSE_PRODUCTS: f"Showing products based on: '{user_message}'",
            CommerceIntent.SEARCH_PRODUCTS: f"Search results for: '{user_message}'"
        }
        
        return reason_templates.get(
            intent,
            f"Rendering {component} for user query"
        )
    
    def decide_ui(
        self,
        user_message: str,
        agent_response: str = "",
        context: Optional[Dict[str, Any]] = None
    ) -> UIDecision:
        """
        Main decision function - converts AI interaction to UI component
        
        This is the core of the SDK!
        
        Args:
            user_message: What the user said/typed
            agent_response: What the AI agent responded
            context: Current state (products, cart, user, etc.)
        
        Returns:
            UIDecision with component, props, and explanation
        """
        context = context or {}
        
        # Step 1: Detect intent
        intent = self.detect_intent(user_message, agent_response, context)
        
        # Step 2: Select best component
        component = self.select_component(intent, context)
        
        # Step 3: Build props
        props = self.build_props(component, context)
        
        # Step 4: Generate explanation
        reason = self.get_selection_reason(intent, component, user_message)
        
        # Step 5: Find alternatives
        alternatives = [
            c.name for c in self.registry.get_for_intent(intent)
            if c.name != component
        ]
        
        return UIDecision(
            intent=intent,
            component=component,
            reason=reason,
            data=props,
            confidence=0.95,  # Could use ML model here
            alternatives=alternatives if alternatives else None
        )
    
    def decide_ui_simple(
        self,
        user_message: str,
        agent_response: str = "",
        context: Optional[Dict[str, Any]] = None
    ) -> UIIntent:
        """
        Simplified decision function returning lightweight UIIntent
        For backwards compatibility
        """
        decision = self.decide_ui(user_message, agent_response, context)
        return UIIntent(
            intent=decision.intent,
            component=decision.component,
            reason=decision.reason,
            data=decision.data,
            confidence=decision.confidence
        )
