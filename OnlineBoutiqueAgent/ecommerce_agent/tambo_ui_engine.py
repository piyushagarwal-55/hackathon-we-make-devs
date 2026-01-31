"""
Tambo Generative UI Integration for E-commerce Agent
This module integrates Tambo's SDK to enable dynamic UI component rendering
based on agent responses and user intent.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import json

class UIComponentConfig(BaseModel):
    """Configuration for a UI component to be rendered"""
    component_name: str
    props: Dict[str, Any]
    priority: int = 0
    reason: Optional[str] = None


class TamboUIDecisionEngine:
    """
    Engine that decides which UI components to render based on:
    - User intent
    - Agent response
    - Current context (cart, products, etc.)
    """
    
    def __init__(self):
        self.registered_components = {
            'ProductGrid': 'Shows products in a grid layout',
            'ComparisonTable': 'Compares multiple products side by side',
            'DealBadgePanel': 'Displays special deals and discounts',
            'BudgetSlider': 'Interactive budget range selector',
            'TryOnStudio': 'Virtual try-on interface',
            'OutfitBoard': 'Mix and match outfit builder',
            'BundleBuilder': 'Create product bundles with discounts',
            'CheckoutWizard': 'Step-by-step checkout process',
            'SmartCartOptimizer': 'AI-optimized shopping cart',
            'PriceTrendChart': 'Historical price trend visualization'
        }
        
        # Intent to component mapping
        self.intent_mappings = {
            # Budget-related
            'cheap': ['BudgetSlider', 'DealBadgePanel'],
            'budget': ['BudgetSlider', 'PriceTrendChart'],
            'affordable': ['BudgetSlider', 'DealBadgePanel'],
            'price': ['PriceTrendChart', 'ComparisonTable'],
            'deal': ['DealBadgePanel', 'SmartCartOptimizer'],
            'discount': ['DealBadgePanel', 'BundleBuilder'],
            
            # Comparison-related
            'compare': ['ComparisonTable', 'PriceTrendChart'],
            'difference': ['ComparisonTable'],
            'vs': ['ComparisonTable'],
            'better': ['ComparisonTable', 'PriceTrendChart'],
            
            # Try-on related
            'try': ['TryOnStudio'],
            'look': ['TryOnStudio', 'OutfitBoard'],
            'wear': ['TryOnStudio'],
            'fit': ['TryOnStudio'],
            
            # Outfit/Bundle related
            'outfit': ['OutfitBoard', 'BundleBuilder'],
            'bundle': ['BundleBuilder', 'DealBadgePanel'],
            'together': ['BundleBuilder', 'OutfitBoard'],
            'combo': ['BundleBuilder'],
            'set': ['BundleBuilder'],
            
            # Checkout related
            'checkout': ['CheckoutWizard', 'SmartCartOptimizer'],
            'buy': ['CheckoutWizard', 'SmartCartOptimizer'],
            'purchase': ['CheckoutWizard'],
            'fast': ['CheckoutWizard'],
            'express': ['CheckoutWizard'],
            
            # Cart related
            'cart': ['SmartCartOptimizer', 'BundleBuilder'],
            'save': ['SmartCartOptimizer', 'DealBadgePanel'],
            'optimize': ['SmartCartOptimizer'],
            
            # Browse/Search
            'show': ['ProductGrid'],
            'list': ['ProductGrid'],
            'browse': ['ProductGrid'],
            'search': ['ProductGrid'],
        }
    
    def analyze_intent(self, user_message: str, agent_response: str = "") -> List[str]:
        """
        Analyze user message and agent response to determine intent
        Returns list of relevant component names
        """
        components = set()
        message_lower = user_message.lower()
        response_lower = agent_response.lower()
        
        # Check user message for intent keywords
        for keyword, component_list in self.intent_mappings.items():
            if keyword in message_lower or keyword in response_lower:
                components.update(component_list)
        
        # Default to ProductGrid if no specific intent found
        if not components:
            components.add('ProductGrid')
        
        return list(components)
    
    def decide_ui_component(
        self,
        user_message: str,
        agent_response: str,
        context: Optional[Dict[str, Any]] = None
    ) -> UIComponentConfig:
        """
        Main decision function - returns the best UI component to render
        This is called after each agent response
        """
        context = context or {}
        
        # Analyze intent
        candidate_components = self.analyze_intent(user_message, agent_response)
        
        # Prioritize based on context
        if context.get('cart_items') and len(context['cart_items']) > 0:
            # If cart has items, prioritize cart-related components
            if 'SmartCartOptimizer' in candidate_components:
                candidate_components.insert(0, 'SmartCartOptimizer')
            if 'checkout' in user_message.lower() or 'buy' in user_message.lower():
                candidate_components.insert(0, 'CheckoutWizard')
        
        # Get the highest priority component
        selected_component = candidate_components[0] if candidate_components else 'ProductGrid'
        
        # Build props based on component and context
        props = self._build_props(selected_component, context)
        
        # Determine reason for selection
        reason = self._get_selection_reason(selected_component, user_message)
        
        return UIComponentConfig(
            component_name=selected_component,
            props=props,
            priority=1,
            reason=reason
        )
    
    def _convert_product_features_to_array(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """
        Convert product features from object format to array format
        Old format: {"features": {"color": "red", "size": "M"}}
        New format: {"features": [{"key": "color", "value": "red"}, {"key": "size", "value": "M"}]}
        """
        if 'features' not in product:
            # If no features, add empty array
            product['features'] = []
            return product
        
        features = product['features']
        
        # If already in array format, return as is
        if isinstance(features, list):
            return product
        
        # Convert object to array format
        if isinstance(features, dict):
            product['features'] = [
                {"key": key, "value": value}
                for key, value in features.items()
            ]
        else:
            # If features is neither dict nor list, set to empty array
            product['features'] = []
        
        return product
    
    def _build_props(self, component_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Build props for the selected component based on context"""
        
        if component_name == 'ProductGrid':
            products = context.get('products', [])
            # Convert all products to new features format
            converted_products = [self._convert_product_features_to_array(p.copy()) for p in products]
            return {
                'products': converted_products,
                'columns': 4
            }
        
        elif component_name == 'ComparisonTable':
            products = context.get('products', [])[:4]  # Max 4 for comparison
            # Convert all products to new features format
            converted_products = [self._convert_product_features_to_array(p.copy()) for p in products]
            return {
                'products': converted_products
            }
        
        elif component_name == 'BudgetSlider':
            products = context.get('products', [])
            prices = [p.get('price', 0) for p in products if 'price' in p]
            return {
                'minPrice': min(prices) if prices else 0,
                'maxPrice': max(prices) if prices else 1000,
                'productCount': len(products)
            }
        
        elif component_name == 'DealBadgePanel':
            products = context.get('products', [])
            # Convert products to deals format
            deals = []
            for i, product in enumerate(products[:6]):
                discount = 15 + (i * 5)  # Simulated discounts
                original_price = product.get('price', 100)
                deals.append({
                    'id': product.get('id', f'deal-{i}'),
                    'productName': product.get('name', 'Product'),
                    'originalPrice': original_price,
                    'discountedPrice': original_price * (1 - discount / 100),
                    'discountPercent': discount,
                    'badge': f'{discount}% OFF',
                    'image': product.get('image', ''),
                    'expiresIn': '24 hours'
                })
            return {'deals': deals}
        
        elif component_name == 'TryOnStudio':
            product = context.get('selected_product') or (context.get('products', [{}])[0] if context.get('products') else {})
            return {
                'productImage': product.get('image', ''),
                'productName': product.get('name', 'Product')
            }
        
        elif component_name == 'OutfitBoard':
            return {
                'availableItems': context.get('products', []),
                'currentOutfit': context.get('outfit_items', [])
            }
        
        elif component_name == 'BundleBuilder':
            return {
                'availableProducts': context.get('products', []),
                'selectedProducts': context.get('bundle_items', []),
                'bundleDiscount': 15
            }
        
        elif component_name == 'CheckoutWizard':
            return {
                'cartItems': context.get('cart_items', []),
                'expressMode': 'fast' in context.get('user_message', '').lower() or 'express' in context.get('user_message', '').lower()
            }
        
        elif component_name == 'SmartCartOptimizer':
            return {
                'cartItems': context.get('cart_items', []),
                'recommendations': context.get('recommendations', [])
            }
        
        elif component_name == 'PriceTrendChart':
            product = context.get('selected_product') or (context.get('products', [{}])[0] if context.get('products') else {})
            return {
                'productName': product.get('name', 'Product'),
                'currentPrice': product.get('price', 100),
                'priceDropAlert': context.get('price_alert', False)
            }
        
        return {}
    
    def _get_selection_reason(self, component_name: str, user_message: str) -> str:
        """Generate human-readable reason for component selection"""
        
        reasons = {
            'ProductGrid': f"Showing products based on: '{user_message}'",
            'ComparisonTable': "Comparing products side by side",
            'BudgetSlider': "Setting budget constraints",
            'DealBadgePanel': "Showing special deals and discounts",
            'TryOnStudio': "Virtual try-on experience",
            'OutfitBoard': "Building your perfect outfit",
            'BundleBuilder': "Creating a bundle to save more",
            'CheckoutWizard': "Ready for checkout",
            'SmartCartOptimizer': "Optimizing your cart",
            'PriceTrendChart': "Analyzing price trends"
        }
        
        return reasons.get(component_name, f"Showing {component_name}")


# UI Morphing Demo Sequences
DEMO_SEQUENCES = {
    "budget_shopping": [
        {
            "user_message": "Show me some shirts",
            "expected_component": "ProductGrid",
            "description": "Initial product grid display"
        },
        {
            "user_message": "Show cheap options",
            "expected_component": "BudgetSlider",
            "description": "UI morphs to budget slider"
        },
        {
            "user_message": "Compare the top 3",
            "expected_component": "ComparisonTable",
            "description": "UI morphs to comparison table"
        },
        {
            "user_message": "Let me try this on",
            "expected_component": "TryOnStudio",
            "description": "UI morphs to try-on studio"
        },
        {
            "user_message": "Checkout fast",
            "expected_component": "CheckoutWizard",
            "description": "UI morphs to express checkout wizard"
        }
    ],
    
    "outfit_builder": [
        {
            "user_message": "I need a complete outfit",
            "expected_component": "OutfitBoard",
            "description": "Shows outfit builder"
        },
        {
            "user_message": "Bundle them together",
            "expected_component": "BundleBuilder",
            "description": "UI morphs to bundle builder"
        },
        {
            "user_message": "Add to cart",
            "expected_component": "SmartCartOptimizer",
            "description": "UI shows smart cart"
        }
    ]
}


def get_tambo_ui_config() -> Dict[str, Any]:
    """
    Returns Tambo SDK configuration for registering components
    """
    return {
        "components": {
            "ProductGrid": {
                "path": "./frontend/components/ProductGrid.tsx",
                "description": "Grid layout for displaying products",
                "props_schema": {
                    "products": "array",
                    "columns": "number"
                }
            },
            "ComparisonTable": {
                "path": "./frontend/components/ComparisonTable.tsx",
                "description": "Side-by-side product comparison",
                "props_schema": {
                    "products": "array"
                }
            },
            "DealBadgePanel": {
                "path": "./frontend/components/DealBadgePanel.tsx",
                "description": "Special deals and discounts",
                "props_schema": {
                    "deals": "array"
                }
            },
            "BudgetSlider": {
                "path": "./frontend/components/BudgetSlider.tsx",
                "description": "Interactive budget range selector",
                "props_schema": {
                    "minPrice": "number",
                    "maxPrice": "number",
                    "productCount": "number"
                }
            },
            "TryOnStudio": {
                "path": "./frontend/components/TryOnStudio.tsx",
                "description": "Virtual try-on interface",
                "props_schema": {
                    "productImage": "string",
                    "productName": "string"
                }
            },
            "OutfitBoard": {
                "path": "./frontend/components/OutfitBoard.tsx",
                "description": "Mix and match outfit builder",
                "props_schema": {
                    "availableItems": "array",
                    "currentOutfit": "array"
                }
            },
            "BundleBuilder": {
                "path": "./frontend/components/BundleBuilder.tsx",
                "description": "Create product bundles",
                "props_schema": {
                    "availableProducts": "array",
                    "selectedProducts": "array"
                }
            },
            "CheckoutWizard": {
                "path": "./frontend/components/CheckoutWizard.tsx",
                "description": "Step-by-step checkout",
                "props_schema": {
                    "cartItems": "array",
                    "expressMode": "boolean"
                }
            },
            "SmartCartOptimizer": {
                "path": "./frontend/components/SmartCartOptimizer.tsx",
                "description": "AI-optimized shopping cart",
                "props_schema": {
                    "cartItems": "array",
                    "recommendations": "array"
                }
            },
            "PriceTrendChart": {
                "path": "./frontend/components/PriceTrendChart.tsx",
                "description": "Price trend visualization",
                "props_schema": {
                    "productName": "string",
                    "currentPrice": "number"
                }
            }
        }
    }
