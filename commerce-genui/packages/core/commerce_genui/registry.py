"""
Component Registry - Global registry for UI components
Provides plugin architecture
"""

from typing import Dict, Any, List, Callable, Optional
from dataclasses import dataclass
from .intent_schema import CommerceIntent


@dataclass
class ComponentConfig:
    """Configuration for a registered component"""
    name: str
    description: str
    intents: List[CommerceIntent]
    props_builder: Optional[Callable[[Dict[str, Any]], Dict[str, Any]]] = None
    priority: int = 1
    
    def __post_init__(self):
        """Validate configuration"""
        if not self.name:
            raise ValueError("Component name is required")
        if not isinstance(self.intents, list):
            raise ValueError("Intents must be a list")


# Global component registry
_global_registry: Dict[str, ComponentConfig] = {}


def register_component(
    name: str,
    description: str,
    intents: List[CommerceIntent],
    props_builder: Optional[Callable] = None,
    priority: int = 1
) -> ComponentConfig:
    """
    Register a component globally
    
    Example:
        register_component(
            name="FlashDealPanel",
            description="Shows flash deals with countdown",
            intents=[CommerceIntent.VIEW_DEALS],
            props_builder=lambda ctx: {"deals": ctx.get("flash_deals")},
            priority=20
        )
    """
    config = ComponentConfig(
        name=name,
        description=description,
        intents=intents,
        props_builder=props_builder,
        priority=priority
    )
    _global_registry[name] = config
    return config


def get_component(name: str) -> Optional[ComponentConfig]:
    """Get a registered component by name"""
    return _global_registry.get(name)


def get_all_components() -> Dict[str, ComponentConfig]:
    """Get all registered components"""
    return _global_registry.copy()


def clear_registry():
    """Clear all registered components (useful for testing)"""
    _global_registry.clear()
