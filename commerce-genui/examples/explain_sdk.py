#!/usr/bin/env python3
"""
Interactive SDK Explanation Demo
=================================

This script shows you EXACTLY how the SDK works step-by-step.
Run: python examples/explain_sdk.py
"""

import sys
sys.path.insert(0, 'packages/core')

from commerce_genui import CommerceGenUI
from commerce_genui.intent_schema import CommerceIntent

def print_section(title):
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def explain_step_by_step():
    print_section("COMMERCE GENUI SDK - HOW IT WORKS")
    
    print("\n[SCENARIO] User asks: 'Show me cheap laptops under $500'")
    print("\n--- Step 1 ---")
    
    # Step 1: Intent Detection
    print_section("STEP 1: INTENT DETECTION (Pattern Matching)")
    
    user_message = "Show me cheap laptops under $500"
    print(f"\nInput: '{user_message}'")
    print("\nSDK Process:")
    print("  1. Convert to lowercase: 'show me cheap laptops under $500'")
    print("  2. Check for keywords:")
    print("     - 'cheap' found → FILTER_BY_PRICE pattern ✓")
    print("     - 'under $' found → FILTER_BY_PRICE pattern ✓")
    print("  3. Match found!")
    
    sdk = CommerceGenUI()
    intent = sdk.detect_intent(user_message)
    
    print(f"\nOutput: Intent = {intent}")
    print(f"Confidence: 95% (keyword match)")
    
    print("\n--- Step 2 ---")
    
    # Step 2: Component Selection
    print_section("STEP 2: COMPONENT SELECTION")
    
    print(f"\nInput: Intent = {intent}")
    print("\nSDK Process:")
    print("  1. Query registry for components handling FILTER_BY_PRICE")
    print("  2. Candidates found:")
    print("     - BudgetSlider (priority: 10)")
    print("     - PriceFilter (priority: 8)")
    print("  3. Select highest priority")
    
    context = {
        "products": [
            {"id": 1, "name": "Budget Laptop", "price": 399},
            {"id": 2, "name": "Student Laptop", "price": 450}
        ]
    }
    
    component = sdk.select_component(intent, context)
    
    print(f"\nOutput: Component = '{component}'")
    
    print("\n--- Step 3 ---")
    
    # Step 3: Props Building
    print_section("STEP 3: PROPS GENERATION")
    
    print(f"\nInput:")
    print(f"  - Component: {component}")
    print(f"  - Context: {len(context['products'])} products")
    print("\nSDK Process:")
    print("  1. Get props builder for BudgetSlider")
    print("  2. Extract prices from products: [399, 450]")
    print("  3. Calculate min/max prices")
    print("  4. Build props object")
    
    props = sdk.build_props(component, context)
    
    print(f"\nOutput Props:")
    for key, value in props.items():
        if key == "products":
            print(f"  - {key}: [{len(value)} items]")
        else:
            print(f"  - {key}: {value}")
    
    print("\n--- Step 4 ---")
    
    # Step 4: Explainability
    print_section("STEP 4: EXPLAINABILITY")
    
    print("\nSDK Process:")
    print("  1. Analyze user message for price keywords")
    print("  2. Found: 'cheap', 'under $500'")
    print("  3. Generate human-readable explanation")
    
    reason = sdk.get_selection_reason(intent, component, user_message)
    
    print(f"\nOutput: '{reason}'")
    
    print("\n--- FINAL RESULT ---")
    
    # Final Decision
    print_section("COMPLETE UI DECISION")
    
    decision = sdk.decide_ui(
        user_message=user_message,
        agent_response="Found 2 laptops under $500",
        context=context
    )
    
    print("\nWhat SDK Returns to Your Backend:")
    print("{")
    print(f'  "component": "{decision.component}",')
    print(f'  "intent": "{decision.intent}",')
    print(f'  "reason": "{decision.reason}",')
    print(f'  "confidence": {decision.confidence},')
    print(f'  "props": {{')
    for key, value in decision.data.items():
        if key == "products":
            print(f'    "{key}": [... {len(value)} items ...],')
        else:
            print(f'    "{key}": {value},')
    print('  }')
    print("}")
    
    print("\n" + "-"*70)
    print("\nWhat Happens Next in Your App:")
    print("\n1. BACKEND receives this decision")
    print("2. BACKEND sends to FRONTEND:")
    print("   { component: 'BudgetSlider', props: {...} }")
    print("\n3. FRONTEND looks up component:")
    print("   const Component = componentRegistry['BudgetSlider']")
    print("\n4. FRONTEND renders component:")
    print("   <BudgetSlider minPrice={399} maxPrice={450} ... />")
    print("\n5. USER sees the Budget Slider UI! ✓")
    
    print("\n--- Tambo Comparison ---")
    
    # Tambo vs SDK
    print_section("TAMBO vs COMMERCE GENUI SDK")
    
    print("\nTAMBO PLATFORM:")
    print("  - Full end-to-end platform")
    print("  - Provides: Backend + Frontend + Components + Hosting")
    print("  - Use case: Want everything pre-built")
    print("  - Control: Less (opinionated)")
    print("  - Setup: Fast (all-in-one)")
    
    print("\nCOMMERCE GENUI SDK:")
    print("  - Decision engine ONLY")
    print("  - Provides: Intent detection + Component selection")
    print("  - Use case: Want to control your own stack")
    print("  - Control: More (flexible)")
    print("  - Setup: Medium (integrate with your app)")
    
    print("\nANALOGY:")
    print("  - Tambo = WordPress (full CMS)")
    print("  - Commerce GenUI = React Router (just routing)")
    
    print("\nRELATIONSHIP:")
    print("  - Commerce GenUI is INSPIRED BY Tambo")
    print("  - But extracted as standalone, reusable SDK")
    print("  - Works with ANY backend/frontend (not just Tambo)")
    
    print("\n--- What You Need To Do ---")
    
    # User responsibilities
    print_section("WHAT YOU NEED TO DO TO USE THE SDK")
    
    print("\n✓ STEP 1: Create Your Components (Frontend)")
    print("    // components/BudgetSlider.tsx")
    print("    export function BudgetSlider({ minPrice, maxPrice, products }) {")
    print("      return <input type='range' min={minPrice} max={maxPrice} ... />")
    print("    }")
    
    print("\n✓ STEP 2: Install SDK in Backend")
    print("    pip install commerce-genui")
    
    print("\n✓ STEP 3: Use SDK in Your Backend")
    print("    from commerce_genui import CommerceGenUI")
    print("    sdk = CommerceGenUI()")
    print("    decision = sdk.decide_ui(message, response, context)")
    
    print("\n✓ STEP 4: Wire Up Frontend")
    print("    const Component = componentRegistry[decision.component]")
    print("    return <Component {...decision.props} />")
    
    print("\n✗ YOU DON'T NEED TO:")
    print("    - Run a separate SDK server")
    print("    - Use Tambo platform")
    print("    - Use specific frontend framework")
    print("    - Change your database")
    print("    - Change your agent")
    
    print("\n" + "="*70)
    print("\nSDK = Smart Router")
    print("  - Input: User message + Your data")
    print("  - Output: Which component to show + What props to pass")
    print("  - YOU control everything else!")
    print("="*70 + "\n")

if __name__ == "__main__":
    try:
        explain_step_by_step()
    except KeyboardInterrupt:
        print("\n\nExplanation interrupted.")
    except Exception as e:
        print(f"\n\nError: {e}")
        import traceback
        traceback.print_exc()
