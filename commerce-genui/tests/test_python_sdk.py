"""
Comprehensive Test Suite for Commerce GenUI SDK
Tests all core functionality, edge cases, and error handling
"""

import sys
import os

# Add core package to path
test_dir = os.path.dirname(os.path.abspath(__file__))
core_dir = os.path.abspath(os.path.join(test_dir, '..', 'packages', 'core'))
sys.path.insert(0, core_dir)

try:
    from commerce_genui import CommerceGenUI, CommerceIntent, UIIntent, ComponentRegistry, UIDecision
    print("✅ All imports successful")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print(f"Tried to import from: {core_dir}")
    sys.exit(1)


def test_basic_imports():
    """Test 1: Verify all imports work"""
    print("\n" + "="*60)
    print("TEST 1: Basic Imports")
    print("="*60)
    
    try:
        assert CommerceGenUI is not None
        assert CommerceIntent is not None
        assert UIIntent is not None
        assert ComponentRegistry is not None
        assert UIDecision is not None
        print("✅ All classes/enums imported successfully")
        return True
    except AssertionError as e:
        print(f"❌ Import assertion failed: {e}")
        return False


def test_commerce_intent_enum():
    """Test 2: Verify CommerceIntent enum values"""
    print("\n" + "="*60)
    print("TEST 2: CommerceIntent Enum")
    print("="*60)
    
    expected_intents = [
        "BROWSE_PRODUCTS",
        "SEARCH_PRODUCTS",
        "FILTER_BY_PRICE",
        "FILTER_BY_CATEGORY",
        "COMPARE_PRODUCTS",
        "VIEW_PRICE_TRENDS",
        "VIEW_CART",
        "OPTIMIZE_CART",
        "CHECKOUT",
        "EXPRESS_CHECKOUT",
        "VIEW_PROFILE",
        "TRACK_ORDER",
        "VIEW_ORDER_HISTORY",
        "RECOMMEND_BUNDLE",
        "VIEW_DEALS",
        "BUILD_OUTFIT",
        "VIRTUAL_TRYON",
        "UNKNOWN"
    ]
    
    try:
        for intent_name in expected_intents:
            assert hasattr(CommerceIntent, intent_name), f"Missing intent: {intent_name}"
            print(f"  ✓ {intent_name}")
        
        print(f"\n✅ All {len(expected_intents)} intents present")
        return True
    except AssertionError as e:
        print(f"❌ Intent test failed: {e}")
        return False


def test_sdk_initialization():
    """Test 3: Initialize SDK"""
    print("\n" + "="*60)
    print("TEST 3: SDK Initialization")
    print("="*60)
    
    try:
        sdk = CommerceGenUI()
        assert sdk is not None
        assert hasattr(sdk, 'decide_ui')
        assert hasattr(sdk, 'detect_intent')
        assert hasattr(sdk, 'select_component')
        assert hasattr(sdk, 'register_component')
        print("✅ SDK initialized successfully")
        print(f"  - decide_ui method: ✓")
        print(f"  - detect_intent method: ✓")
        print(f"  - select_component method: ✓")
        print(f"  - register_component method: ✓")
        return True
    except Exception as e:
        print(f"❌ SDK initialization failed: {e}")
        return False


def test_intent_detection():
    """Test 4: Intent detection with various messages"""
    print("\n" + "="*60)
    print("TEST 4: Intent Detection")
    print("="*60)
    
    sdk = CommerceGenUI()
    
    test_cases = [
        ("Search for laptops", CommerceIntent.SEARCH_PRODUCTS),
        ("Show cheap options under $100", CommerceIntent.FILTER_BY_PRICE),
        ("Compare these products", CommerceIntent.COMPARE_PRODUCTS),
        ("Show my cart", CommerceIntent.VIEW_CART),
        ("Checkout now", CommerceIntent.CHECKOUT),
        ("My account details", CommerceIntent.VIEW_PROFILE),
        ("Track my order", CommerceIntent.TRACK_ORDER),
        ("Show deals", CommerceIntent.VIEW_DEALS),
    ]
    
    passed = 0
    failed = 0
    
    for message, expected_intent in test_cases:
        try:
            detected = sdk.detect_intent(message)
            if detected == expected_intent:
                print(f"  ✓ '{message}' → {detected.value}")
                passed += 1
            else:
                print(f"  ✗ '{message}' → Expected {expected_intent.value}, got {detected.value}")
                failed += 1
        except Exception as e:
            print(f"  ✗ '{message}' → Error: {e}")
            failed += 1
    
    print(f"\n✅ Passed: {passed}/{len(test_cases)}")
    if failed > 0:
        print(f"❌ Failed: {failed}/{len(test_cases)}")
    
    return failed == 0


def test_component_selection():
    """Test 5: Component selection based on intent"""
    print("\n" + "="*60)
    print("TEST 5: Component Selection")
    print("="*60)
    
    sdk = CommerceGenUI()
    
    test_cases = [
        (CommerceIntent.BROWSE_PRODUCTS, {}, "ProductGrid"),
        (CommerceIntent.COMPARE_PRODUCTS, {"products": [{"id": "1"}]}, "ComparisonTable"),
        (CommerceIntent.FILTER_BY_PRICE, {}, "BudgetSlider"),
        (CommerceIntent.CHECKOUT, {"cart_items": []}, "CheckoutWizard"),
        (CommerceIntent.VIEW_PROFILE, {"user": {}}, "UserProfile"),
    ]
    
    passed = 0
    failed = 0
    
    for intent, context, expected_component in test_cases:
        try:
            component = sdk.select_component(intent, context)
            if component == expected_component:
                print(f"  ✓ {intent.value} → {component}")
                passed += 1
            else:
                print(f"  ✗ {intent.value} → Expected {expected_component}, got {component}")
                failed += 1
        except Exception as e:
            print(f"  ✗ {intent.value} → Error: {e}")
            failed += 1
    
    print(f"\n✅ Passed: {passed}/{len(test_cases)}")
    if failed > 0:
        print(f"❌ Failed: {failed}/{len(test_cases)}")
    
    return failed == 0


def test_props_building():
    """Test 6: Props building for components"""
    print("\n" + "="*60)
    print("TEST 6: Props Building")
    print("="*60)
    
    sdk = CommerceGenUI()
    
    test_cases = [
        ("ProductGrid", {"products": [{"id": "1", "name": "Test"}]}, ["products"]),
        ("BudgetSlider", {"products": [{"price": 50}]}, ["minPrice", "maxPrice"]),
        ("CheckoutWizard", {"cart_items": [{"id": "1"}]}, ["cartItems"]),
    ]
    
    passed = 0
    failed = 0
    
    for component, context, expected_keys in test_cases:
        try:
            props = sdk.build_props(component, context)
            has_all_keys = all(key in props for key in expected_keys)
            
            if has_all_keys:
                print(f"  ✓ {component}: {list(props.keys())}")
                passed += 1
            else:
                missing = [k for k in expected_keys if k not in props]
                print(f"  ✗ {component}: Missing keys {missing}")
                failed += 1
        except Exception as e:
            print(f"  ✗ {component} → Error: {e}")
            failed += 1
    
    print(f"\n✅ Passed: {passed}/{len(test_cases)}")
    if failed > 0:
        print(f"❌ Failed: {failed}/{len(test_cases)}")
    
    return failed == 0


def test_decide_ui_full_flow():
    """Test 7: Full decide_ui flow"""
    print("\n" + "="*60)
    print("TEST 7: Full decide_ui Flow")
    print("="*60)
    
    sdk = CommerceGenUI()
    
    test_cases = [
        {
            "message": "Show me running shoes",
            "response": "Found 5 running shoes",
            "context": {
                "products": [
                    {"id": "1", "name": "Nike Air", "price": 89.99},
                    {"id": "2", "name": "Adidas Ultra", "price": 74.99}
                ]
            }
        },
        {
            "message": "Show cheap options under $50",
            "response": "Here are items under $50",
            "context": {
                "products": [
                    {"id": "3", "name": "Socks", "price": 14.99}
                ]
            }
        },
        {
            "message": "Compare them",
            "response": "Comparing products",
            "context": {
                "products": [
                    {"id": "1", "name": "Product A", "price": 50},
                    {"id": "2", "name": "Product B", "price": 60}
                ]
            }
        }
    ]
    
    passed = 0
    failed = 0
    
    for test in test_cases:
        try:
            decision = sdk.decide_ui(
                user_message=test["message"],
                agent_response=test["response"],
                context=test["context"]
            )
            
            # Validate decision structure
            assert decision.intent is not None
            assert decision.component is not None
            assert decision.reason is not None
            assert decision.data is not None
            assert isinstance(decision.confidence, (int, float))
            assert isinstance(decision.alternatives, (list, type(None)))
            
            print(f"  ✓ '{test['message']}'")
            print(f"    Intent: {decision.intent if isinstance(decision.intent, str) else decision.intent.value}")
            print(f"    Component: {decision.component}")
            print(f"    Confidence: {decision.confidence}")
            print(f"    Reason: {decision.reason[:60]}...")
            passed += 1
            
        except Exception as e:
            import traceback
            print(f"  ✗ '{test['message']}' → Error: {e}")
            traceback.print_exc()
            failed += 1
    
    print(f"\n✅ Passed: {passed}/{len(test_cases)}")
    if failed > 0:
        print(f"❌ Failed: {failed}/{len(test_cases)}")
    
    return failed == 0


def test_plugin_system():
    """Test 8: Plugin/Custom component registration"""
    print("\n" + "="*60)
    print("TEST 8: Plugin System")
    print("="*60)
    
    try:
        sdk = CommerceGenUI()
        
        # Register custom component
        sdk.register_component(
            name="FlashDealPanel",
            description="Shows flash sales",
            intents=[CommerceIntent.VIEW_DEALS],
            props_builder=lambda ctx: {"deals": ctx.get("flash_deals", [])},
            priority=20
        )
        
        print("  ✓ Custom component registered")
        
        # Test if it gets selected
        component = sdk.select_component(
            CommerceIntent.VIEW_DEALS,
            {"flash_deals": [{"id": "1"}]}
        )
        
        if component == "FlashDealPanel":
            print("  ✓ Custom component selected correctly")
            print("✅ Plugin system working")
            return True
        else:
            print(f"  ✗ Expected FlashDealPanel, got {component}")
            return False
            
    except Exception as e:
        print(f"❌ Plugin system error: {e}")
        return False


def test_edge_cases():
    """Test 9: Edge cases and error handling"""
    print("\n" + "="*60)
    print("TEST 9: Edge Cases & Error Handling")
    print("="*60)
    
    sdk = CommerceGenUI()
    
    tests_passed = 0
    tests_total = 0
    
    # Test 1: Empty message
    tests_total += 1
    try:
        decision = sdk.decide_ui("", "response", {})
        intent_str = decision.intent if isinstance(decision.intent, str) else decision.intent.value
        print(f"  ✓ Empty message handled: {intent_str}")
        tests_passed += 1
    except Exception as e:
        import traceback
        print(f"  ✗ Empty message failed: {e}")
        traceback.print_exc()
    
    # Test 2: None context
    tests_total += 1
    try:
        decision = sdk.decide_ui("test", "response", None)
        print(f"  ✓ None context handled")
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ None context failed: {e}")
    
    # Test 3: Empty context
    tests_total += 1
    try:
        decision = sdk.decide_ui("test", "response", {})
        print(f"  ✓ Empty context handled")
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ Empty context failed: {e}")
    
    # Test 4: Unknown intent
    tests_total += 1
    try:
        intent = sdk.detect_intent("asdfghjkl qwertyuiop zxcvbnm")
        print(f"  ✓ Unknown message handled: {intent.value}")
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ Unknown message failed: {e}")
    
    # Test 5: Missing products in context
    tests_total += 1
    try:
        decision = sdk.decide_ui(
            "show products",
            "response",
            {}  # No products
        )
        print(f"  ✓ Missing products handled")
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ Missing products failed: {e}")
    
    print(f"\n✅ Passed: {tests_passed}/{tests_total}")
    return tests_passed == tests_total


def test_pydantic_validation():
    """Test 10: Pydantic model validation"""
    print("\n" + "="*60)
    print("TEST 10: Pydantic Model Validation")
    print("="*60)
    
    try:
        # Test UIDecision model
        decision = UIDecision(
            intent=CommerceIntent.BROWSE_PRODUCTS,
            component="ProductGrid",
            reason="Test reason",
            data={"products": []},
            confidence=0.95,
            alternatives=["ComparisonTable"]
        )
        
        print("  ✓ UIDecision model created")
        print(f"    Intent type: {type(decision.intent)}")
        print(f"    Intent value: {decision.intent if isinstance(decision.intent, str) else decision.intent.value}")
        print(f"    Component: {decision.component}")
        print(f"    Confidence: {decision.confidence}")
        
        # Test model serialization
        decision_dict = decision.model_dump()
        assert "intent" in decision_dict
        assert "component" in decision_dict
        
        # Check if intent is properly serialized
        intent_value = decision_dict["intent"]
        print(f"  ✓ Model serialization works")
        print(f"    Serialized intent: {intent_value} (type: {type(intent_value)})")
        
        print("✅ Pydantic validation working")
        return True
        
    except Exception as e:
        import traceback
        print(f"❌ Pydantic validation error: {e}")
        traceback.print_exc()
        return False


def run_all_tests():
    """Run all tests and report results"""
    print("\n" + "="*60)
    print("COMMERCE GENUI SDK - COMPREHENSIVE TEST SUITE")
    print("="*60)
    
    tests = [
        ("Basic Imports", test_basic_imports),
        ("CommerceIntent Enum", test_commerce_intent_enum),
        ("SDK Initialization", test_sdk_initialization),
        ("Intent Detection", test_intent_detection),
        ("Component Selection", test_component_selection),
        ("Props Building", test_props_building),
        ("Full decide_ui Flow", test_decide_ui_full_flow),
        ("Plugin System", test_plugin_system),
        ("Edge Cases", test_edge_cases),
        ("Pydantic Validation", test_pydantic_validation),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, passed))
        except Exception as e:
            print(f"\n❌ CRITICAL ERROR in {test_name}: {e}")
            import traceback
            traceback.print_exc()
            results.append((test_name, False))
    
    # Final report
    print("\n" + "="*60)
    print("FINAL TEST REPORT")
    print("="*60)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "="*60)
    print(f"TOTAL: {passed_count}/{total_count} tests passed")
    print("="*60)
    
    if passed_count == total_count:
        print("\n🎉 ALL TESTS PASSED! SDK is working perfectly!")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed. Review errors above.")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    sys.exit(exit_code)
