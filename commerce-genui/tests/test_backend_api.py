"""
Test the example backend server
Tests API endpoints, request/response validation, and integration
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"


def test_server_running():
    """Test 1: Check if server is running"""
    print("\n" + "="*60)
    print("TEST 1: Server Running")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        if response.status_code == 200:
            print(f"✅ Server is running")
            print(f"  Response: {response.json()}")
            return True
        else:
            print(f"❌ Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Is it running?")
        print("   Run: python examples/minimal-shop/backend/server.py")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_chat_endpoint():
    """Test 2: Basic chat endpoint"""
    print("\n" + "="*60)
    print("TEST 2: Chat Endpoint")
    print("="*60)
    
    try:
        payload = {
            "message": "Show me running shoes",
            "context": {}
        }
        
        response = requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Chat endpoint working")
            print(f"  Agent Response: {data.get('agent_response')}")
            print(f"  UI Component: {data.get('ui_component')}")
            print(f"  UI Reason: {data.get('ui_reason')}")
            return True
        else:
            print(f"❌ Status code: {response.status_code}")
            print(f"  Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_intent_detection_via_api():
    """Test 3: Intent detection through API"""
    print("\n" + "="*60)
    print("TEST 3: Intent Detection via API")
    print("="*60)
    
    test_cases = [
        {
            "message": "Show me running shoes",
            "expected_component": "ProductGrid"
        },
        {
            "message": "Show cheap options under $50",
            "expected_component": "BudgetSlider"
        },
        {
            "message": "Compare these products",
            "expected_component": "ComparisonTable",
            "context": {
                "products": [
                    {"id": "1", "name": "Product A"},
                    {"id": "2", "name": "Product B"}
                ]
            }
        }
    ]
    
    passed = 0
    failed = 0
    
    for test in test_cases:
        try:
            payload = {
                "message": test["message"],
                "context": test.get("context", {})
            }
            
            response = requests.post(
                f"{BASE_URL}/chat",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                component = data.get("ui_component")
                
                if component == test["expected_component"]:
                    print(f"  ✓ '{test['message']}' → {component}")
                    passed += 1
                else:
                    print(f"  ✗ '{test['message']}' → Expected {test['expected_component']}, got {component}")
                    failed += 1
            else:
                print(f"  ✗ '{test['message']}' → HTTP {response.status_code}")
                failed += 1
                
        except Exception as e:
            print(f"  ✗ '{test['message']}' → Error: {e}")
            failed += 1
    
    print(f"\n✅ Passed: {passed}/{len(test_cases)}")
    if failed > 0:
        print(f"❌ Failed: {failed}/{len(test_cases)}")
    
    return failed == 0


def test_product_search():
    """Test 4: Product search functionality"""
    print("\n" + "="*60)
    print("TEST 4: Product Search")
    print("="*60)
    
    test_cases = [
        "running shoes",
        "headphones",
        "backpack",
        "socks"
    ]
    
    passed = 0
    failed = 0
    
    for query in test_cases:
        try:
            payload = {
                "message": f"Show me {query}",
                "context": {}
            }
            
            response = requests.post(
                f"{BASE_URL}/chat",
                json=payload,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                products = data.get("context", {}).get("products", [])
                
                if len(products) > 0:
                    print(f"  ✓ '{query}' → Found {len(products)} products")
                    passed += 1
                else:
                    print(f"  ✗ '{query}' → No products found")
                    failed += 1
            else:
                print(f"  ✗ '{query}' → HTTP {response.status_code}")
                failed += 1
                
        except Exception as e:
            print(f"  ✗ '{query}' → Error: {e}")
            failed += 1
    
    print(f"\n✅ Passed: {passed}/{len(test_cases)}")
    if failed > 0:
        print(f"❌ Failed: {failed}/{len(test_cases)}")
    
    return failed == 0


def test_response_structure():
    """Test 5: Validate response structure"""
    print("\n" + "="*60)
    print("TEST 5: Response Structure Validation")
    print("="*60)
    
    try:
        payload = {
            "message": "Show me products",
            "context": {}
        }
        
        response = requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            
            required_fields = [
                "agent_response",
                "ui_component",
                "ui_props",
                "ui_reason",
                "context"
            ]
            
            missing = [field for field in required_fields if field not in data]
            
            if not missing:
                print("✅ All required fields present:")
                for field in required_fields:
                    print(f"  ✓ {field}")
                
                # Validate types
                assert isinstance(data["agent_response"], str)
                assert isinstance(data["ui_component"], str)
                assert isinstance(data["ui_props"], dict)
                assert isinstance(data["ui_reason"], str)
                assert isinstance(data["context"], dict)
                
                print("\n✅ All field types correct")
                return True
            else:
                print(f"❌ Missing fields: {missing}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_price_filtering():
    """Test 6: Price filtering context"""
    print("\n" + "="*60)
    print("TEST 6: Price Filtering")
    print("="*60)
    
    try:
        payload = {
            "message": "Show me items under $50",
            "context": {}
        }
        
        response = requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            component = data.get("ui_component")
            props = data.get("ui_props", {})
            
            if component == "BudgetSlider":
                print(f"✅ Correct component: {component}")
                
                # Check if props have price data
                if "maxPrice" in props or "minPrice" in props:
                    print(f"  ✓ Price props present: {props}")
                    return True
                else:
                    print(f"  ✗ Missing price props")
                    return False
            else:
                print(f"❌ Wrong component: {component}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_error_handling():
    """Test 7: Error handling"""
    print("\n" + "="*60)
    print("TEST 7: Error Handling")
    print("="*60)
    
    tests_passed = 0
    tests_total = 0
    
    # Test 1: Invalid JSON
    tests_total += 1
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            data="invalid json",
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        # Should return 422 (validation error)
        print(f"  ✓ Invalid JSON handled (Status: {response.status_code})")
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ Invalid JSON test failed: {e}")
    
    # Test 2: Missing fields
    tests_total += 1
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={},  # Missing required fields
            timeout=5
        )
        # Should return 422 (validation error)
        print(f"  ✓ Missing fields handled (Status: {response.status_code})")
        tests_passed += 1
    except Exception as e:
        print(f"  ✗ Missing fields test failed: {e}")
    
    # Test 3: Empty message (should work)
    tests_total += 1
    try:
        response = requests.post(
            f"{BASE_URL}/chat",
            json={"message": "", "context": {}},
            timeout=5
        )
        if response.status_code == 200:
            print(f"  ✓ Empty message handled gracefully")
            tests_passed += 1
        else:
            print(f"  ✗ Empty message failed: {response.status_code}")
    except Exception as e:
        print(f"  ✗ Empty message test failed: {e}")
    
    print(f"\n✅ Passed: {tests_passed}/{tests_total}")
    return tests_passed == tests_total


def test_docs_endpoint():
    """Test 8: API documentation"""
    print("\n" + "="*60)
    print("TEST 8: API Documentation")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API docs accessible at /docs")
            return True
        else:
            print(f"❌ Docs endpoint returned {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def run_all_tests():
    """Run all API tests"""
    print("\n" + "="*60)
    print("COMMERCE GENUI - BACKEND API TEST SUITE")
    print("="*60)
    print("\nNOTE: Make sure backend server is running:")
    print("  python examples/minimal-shop/backend/server.py")
    print("\nWaiting 2 seconds for server check...")
    time.sleep(2)
    
    tests = [
        ("Server Running", test_server_running),
        ("Chat Endpoint", test_chat_endpoint),
        ("Intent Detection", test_intent_detection_via_api),
        ("Product Search", test_product_search),
        ("Response Structure", test_response_structure),
        ("Price Filtering", test_price_filtering),
        ("Error Handling", test_error_handling),
        ("API Documentation", test_docs_endpoint),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            passed = test_func()
            results.append((test_name, passed))
            
            # If server isn't running, skip remaining tests
            if test_name == "Server Running" and not passed:
                print("\n⚠️  Skipping remaining tests - server not running")
                break
                
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
        print("\n🎉 ALL API TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total_count - passed_count} test(s) failed.")
        return 1


if __name__ == "__main__":
    exit_code = run_all_tests()
    exit(exit_code)
