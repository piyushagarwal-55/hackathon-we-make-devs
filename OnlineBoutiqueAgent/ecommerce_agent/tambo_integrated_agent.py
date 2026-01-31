"""
E-commerce Agent with Tambo Generative UI Integration

This module wraps the main agent to add Tambo UI component selection
after each agent response.
"""

import json
from typing import Dict, Any
from google.adk.sessions import Session

try:
    from ecommerce_agent.agent import root_agent, runner, tambo_ui_engine
    from ecommerce_agent.agents.order_placement_agent.agent import order_placement_agent
except ImportError:
    from agent import root_agent, runner, tambo_ui_engine
    from agents.order_placement_agent.agent import order_placement_agent


class TamboIntegratedAgent:
    """
    Wrapper around the root agent that adds Tambo UI decision-making
    to every response.
    """
    
    def __init__(self):
        self.agent = root_agent
        self.ui_engine = tambo_ui_engine
        self.runner = runner
        # Shared context across conversation
        self.context = {
            'products': [],
            'cart_items': [],
            'selected_product': None,
            'last_search': None
        }
    
    async def process_message(
        self,
        user_message: str,
        session_id: str = "default"
    ) -> Dict[str, Any]:
        """
        Process user message and return both agent response and UI component config
        
        Returns:
            {
                'agent_response': str,
                'ui_component': str,
                'ui_props': dict,
                'ui_reason': str,
                'context': dict
            }
        """
        
        # Get session
        session = await self.runner.session_service.get_session(session_id)
        if not session:
            session = await self.runner.session_service.create_session(session_id)
        
        # Send message to agent
        response = await self.runner.send_message(
            session_id=session_id,
            message=user_message
        )
        
        # Extract agent response text
        agent_response_text = response.get('message', str(response))
        
        # Update context from response
        self._update_context_from_response(user_message, agent_response_text, response)
        
        # Decide UI component
        ui_config = self.ui_engine.decide_ui_component(
            user_message=user_message,
            agent_response=agent_response_text,
            context=self.context
        )
        
        return {
            'agent_response': agent_response_text,
            'ui_component': ui_config.component_name,
            'ui_props': ui_config.props,
            'ui_reason': ui_config.reason,
            'context': self.context.copy(),
            'full_response': response
        }
    
    def _update_context_from_response(
        self,
        user_message: str,
        agent_response: str,
        full_response: Any
    ):
        """Extract and update context from agent responses"""
        
        # Store last user message
        self.context['user_message'] = user_message
        
        # Try to extract products from response
        # This is a simple heuristic - in production, you'd parse structured data
        if 'product' in agent_response.lower():
            # Products would come from actual agent responses
            # For now, maintain existing context
            pass
        
        # Update cart items from order placement agent
        # In a real implementation, you'd fetch this from the agent state
        if 'cart' in user_message.lower() or 'add' in user_message.lower():
            # Cart items would be fetched from order_placement_agent
            pass
    
    def set_products(self, products: list):
        """Manually set products in context (for demo/testing)"""
        self.context['products'] = products
    
    def set_cart_items(self, cart_items: list):
        """Manually set cart items in context (for demo/testing)"""
        self.context['cart_items'] = cart_items
    
    def select_product(self, product: dict):
        """Set the currently selected product"""
        self.context['selected_product'] = product


# Create singleton instance
tambo_agent = TamboIntegratedAgent()


# Synchronous wrapper for non-async contexts
def process_message_sync(user_message: str, session_id: str = "default") -> Dict[str, Any]:
    """
    Synchronous wrapper for processing messages
    
    Returns UI component configuration along with agent response
    """
    import asyncio
    
    # Get or create event loop
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    # Run async function
    return loop.run_until_complete(
        tambo_agent.process_message(user_message, session_id)
    )


# Demo sequence for hackathon
DEMO_FLOW = [
    {
        'step': 1,
        'user_message': 'Show me some shirts',
        'expected_component': 'ProductGrid',
        'setup': lambda: tambo_agent.set_products([
            {'id': '1', 'name': 'Blue Cotton Shirt', 'price': 29.99, 'category': 'Shirts'},
            {'id': '2', 'name': 'Red Polo Shirt', 'price': 34.99, 'category': 'Shirts'},
            {'id': '3', 'name': 'White Formal Shirt', 'price': 45.99, 'category': 'Shirts'},
        ])
    },
    {
        'step': 2,
        'user_message': 'Show cheap options',
        'expected_component': 'BudgetSlider',
        'description': '⚡ UI MORPHS to BudgetSlider'
    },
    {
        'step': 3,
        'user_message': 'Compare the top 3',
        'expected_component': 'ComparisonTable',
        'description': '⚡ UI MORPHS to ComparisonTable'
    },
    {
        'step': 4,
        'user_message': 'Let me try this blue one on',
        'expected_component': 'TryOnStudio',
        'description': '⚡ UI MORPHS to TryOnStudio',
        'setup': lambda: tambo_agent.select_product(
            {'id': '1', 'name': 'Blue Cotton Shirt', 'price': 29.99, 'image': '...'}
        )
    },
    {
        'step': 5,
        'user_message': 'Add pants to make a bundle',
        'expected_component': 'BundleBuilder',
        'description': '⚡ UI MORPHS to BundleBuilder',
        'setup': lambda: tambo_agent.set_products([
            {'id': '1', 'name': 'Blue Cotton Shirt', 'price': 29.99},
            {'id': '10', 'name': 'Black Chinos', 'price': 49.99, 'category': 'Pants'},
            {'id': '11', 'name': 'Blue Jeans', 'price': 59.99, 'category': 'Pants'},
        ])
    },
    {
        'step': 6,
        'user_message': 'Checkout fast',
        'expected_component': 'CheckoutWizard',
        'description': '⚡ UI MORPHS to CheckoutWizard (express mode)',
        'setup': lambda: tambo_agent.set_cart_items([
            {'id': '1', 'name': 'Blue Cotton Shirt', 'price': 29.99, 'quantity': 1},
            {'id': '10', 'name': 'Black Chinos', 'price': 49.99, 'quantity': 1},
        ])
    }
]


async def run_demo_flow():
    """Run the complete demo flow showing all UI mutations"""
    print("=" * 60)
    print("TAMBO GENERATIVE UI DEMO - 5 UI MUTATIONS")
    print("=" * 60)
    print()
    
    for demo_step in DEMO_FLOW:
        step_num = demo_step['step']
        user_msg = demo_step['user_message']
        expected_component = demo_step['expected_component']
        
        print(f"STEP {step_num}: {user_msg}")
        print("-" * 60)
        
        # Run setup if exists
        if 'setup' in demo_step:
            demo_step['setup']()
        
        # Process message
        result = await tambo_agent.process_message(user_msg)
        
        # Display results
        print(f"🤖 Agent: {result['agent_response'][:100]}...")
        print(f"🎨 UI Component: {result['ui_component']}")
        print(f"💭 Reason: {result['ui_reason']}")
        
        if demo_step.get('description'):
            print(f"✨ {demo_step['description']}")
        
        # Verify expected component
        if result['ui_component'] == expected_component:
            print("✅ CORRECT COMPONENT")
        else:
            print(f"❌ UNEXPECTED: Got {result['ui_component']}, expected {expected_component}")
        
        print()
        print()


if __name__ == "__main__":
    import asyncio
    
    # Run demo
    asyncio.run(run_demo_flow())
