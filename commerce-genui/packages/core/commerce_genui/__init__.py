"""
Commerce GenUI - Generative UI SDK for E-commerce
Built on top of Tambo AI

Example usage:
    from commerce_genui import CommerceGenUI, UIIntent
    
    sdk = CommerceGenUI()
    decision = sdk.decide_ui(
        user_message="Show me cheap running shoes",
        agent_response="Found 12 products under $100",
        context={"products": [...]}
    )
    
    print(decision.component)  # "BudgetSlider"
    print(decision.reason)     # "User is budget-conscious"
"""

from .decision_engine import CommerceGenUI, UIIntent, ComponentRegistry
from .intent_schema import CommerceIntent, UIDecision
from .registry import ComponentConfig, register_component

__version__ = "0.1.0"

__all__ = [
    "CommerceGenUI",
    "UIIntent",
    "ComponentRegistry",
    "CommerceIntent",
    "UIDecision",
    "ComponentConfig",
    "register_component"
]
