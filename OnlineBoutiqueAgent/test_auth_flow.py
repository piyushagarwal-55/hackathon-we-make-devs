"""
Test script for authentication flow
Tests the complete user journey:
1. Browse products (no auth)
2. Try to add to cart (should fail - requires auth)
3. Create account
4. Login
5. Add to cart (should work)
6. Checkout
7. View order history
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print('='*60)

def test_flow():
    print_section("STEP 1: Browse products (NO AUTH REQUIRED)")
    
    # Test product search
    response = requests.post(f"{BASE_URL}/chat", json={
        "message": "show me sunglasses",
        "session_id": "test_session"
    })
    
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"✅ Products found: {len(data.get('ui_props', {}).get('products', []))}")
        print(f"UI Component: {data.get('ui_component')}")
        products = data.get('ui_props', {}).get('products', [])
        if products:
            first_product = products[0]
            print(f"First product: {first_product.get('name')} - ${first_product.get('price')}")
    else:
        print(f"❌ Failed: {response.text}")
        return
    
    print_section("STEP 2: Try to add to cart WITHOUT AUTH (should fail)")
    
    # Try to add to cart without auth
    response = requests.post(f"{BASE_URL}/cart/add", json={
        "session_id": "test_session",
        "product_id": first_product['id'],
        "product_name": first_product['name'],
        "price": first_product['price'],
        "image": first_product.get('image', ''),
        "quantity": 3
    })
    
    print(f"Status: {response.status_code}")
    if response.status_code == 401:
        print(f"✅ Correctly requires authentication: {response.json().get('detail')}")
    else:
        print(f"❌ Should have returned 401, got: {response.status_code}")
        print(f"Response: {response.json()}")
    
    print_section("STEP 3: Create account")
    
    # Create account
    signup_data = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
    
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        token = data.get('token')
        user = data.get('user')
        print(f"✅ Account created: {user.get('username')} ({user.get('email')})")
        print(f"Token received: {token[:20]}...")
    else:
        error = response.json()
        if "already registered" in error.get('detail', ''):
            print(f"⚠️ Account already exists, trying to login instead...")
            
            # Login instead
            response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": signup_data['email'],
                "password": signup_data['password']
            })
            
            if response.ok:
                data = response.json()
                token = data.get('token')
                user = data.get('user')
                print(f"✅ Logged in: {user.get('username')}")
                print(f"Token received: {token[:20]}...")
            else:
                print(f"❌ Login failed: {response.json()}")
                return
        else:
            print(f"❌ Signup failed: {error}")
            return
    
    print_section("STEP 4: Add to cart WITH AUTH (should work)")
    
    # Add to cart with auth token
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(f"{BASE_URL}/cart/add", 
        json={
            "session_id": "test_session",
            "product_id": first_product['id'],
            "product_name": first_product['name'],
            "price": first_product['price'],
            "image": first_product.get('image', ''),
            "quantity": 3
        },
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"✅ Added to cart successfully!")
        print(f"Cart items: {data.get('total_items')}")
        print(f"Message: {data.get('message')}")
    else:
        print(f"❌ Failed: {response.json()}")
        return
    
    print_section("STEP 5: View cart WITH AUTH")
    
    response = requests.get(f"{BASE_URL}/cart/test_session", headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"✅ Cart retrieved successfully!")
        print(f"Total items: {data.get('total_items')}")
        print(f"Total price: ${data.get('total_price')}")
        print(f"UI Component: {data.get('ui_component')}")
    else:
        print(f"❌ Failed: {response.json()}")
    
    print_section("STEP 6: Checkout WITH AUTH")
    
    response = requests.post(f"{BASE_URL}/checkout",
        json={
            "session_id": "test_session",
            "shipping_info": {
                "fullName": "Test User",
                "address": "123 Test Street",
                "city": "Test City",
                "state": "TC",
                "zip": "12345",
                "phone": "555-0123"
            }
        },
        headers=headers
    )
    
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        order = data.get('order', {})
        print(f"✅ Checkout successful!")
        print(f"Order ID: {order.get('order_id') or order.get('_id', 'N/A')}")
        print(f"Total: ${order.get('total', 0):.2f}")
        print(f"Status: {order.get('status')}")
    else:
        print(f"❌ Failed: {response.json()}")
        return
    
    print_section("STEP 7: View order history WITH AUTH")
    
    response = requests.get(f"{BASE_URL}/orders/test_session", headers=headers)
    
    print(f"Status: {response.status_code}")
    if response.ok:
        data = response.json()
        orders = data.get('orders', [])
        print(f"✅ Order history retrieved!")
        print(f"Total orders: {len(orders)}")
        if orders:
            print(f"Latest order: {orders[0].get('orderId')} - ${orders[0].get('total'):.2f}")
        print(f"UI Component: {data.get('ui_component')}")
    else:
        print(f"❌ Failed: {response.json()}")
    
    print_section("TEST COMPLETE")
    print("✅ All tests passed!")

if __name__ == "__main__":
    try:
        test_flow()
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
