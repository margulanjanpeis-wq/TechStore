#!/usr/bin/env python3
"""
Simple Final Test - Authentication System Verification
====================================================
"""

import requests

BASE_URL = "http://localhost:8000"

def test_authentication_system():
    """Test all authentication functionality"""
    print("Testing Authentication System...")
    
    # Test 1: Health check
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        assert response.status_code == 200
        print("✓ Health check: PASS")
    except Exception as e:
        print(f"✗ Health check: FAIL - {e}")
        return False
    
    # Test 2: User registration
    try:
        registration_data = {
            "username": "finaltest123",
            "email": "finaltest123@example.com", 
            "password": "testpassword123",
            "full_name": "Final Test User"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json=registration_data, timeout=10)
        assert response.status_code == 201
        print("✓ User registration: PASS")
    except Exception as e:
        print(f"✗ User registration: FAIL - {e}")
        return False
    
    # Test 3: Admin login
    try:
        login_data = {"username": "admin", "password": "admin123"}
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data, timeout=10)
        assert response.status_code == 200
        response_data = response.json()
        assert "access_token" in response_data
        print("✓ Admin login: PASS")
    except Exception as e:
        print(f"✗ Admin login: FAIL - {e}")
        return False
    
    # Test 4: User login after registration
    try:
        login_data = {"username": "finaltest123", "password": "testpassword123"}
        response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data, timeout=10)
        assert response.status_code == 200
        response_data = response.json()
        assert "access_token" in response_data
        print("✓ User login: PASS")
    except Exception as e:
        print(f"✗ User login: FAIL - {e}")
        return False
    
    return True

def test_preservation():
    """Test that non-auth endpoints still work"""
    print("\nTesting Preservation...")
    
    # Test products endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/products", timeout=10)
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        assert len(products) > 0
        print("✓ Products endpoint: PASS")
    except Exception as e:
        print(f"✗ Products endpoint: FAIL - {e}")
        return False
    
    # Test categories endpoint
    try:
        response = requests.get(f"{BASE_URL}/api/categories", timeout=10)
        assert response.status_code == 200
        categories = response.json()
        assert isinstance(categories, list)
        assert len(categories) > 0
        print("✓ Categories endpoint: PASS")
    except Exception as e:
        print(f"✗ Categories endpoint: FAIL - {e}")
        return False
    
    # Test metrics endpoint
    try:
        response = requests.get(f"{BASE_URL}/metrics", timeout=5)
        assert response.status_code == 200
        assert "techstore_requests_total" in response.text
        print("✓ Metrics endpoint: PASS")
    except Exception as e:
        print(f"✗ Metrics endpoint: FAIL - {e}")
        return False
    
    return True

def main():
    print("=" * 60)
    print("FINAL AUTHENTICATION SYSTEM VERIFICATION")
    print("=" * 60)
    
    auth_success = test_authentication_system()
    preservation_success = test_preservation()
    
    print("\n" + "=" * 60)
    print("RESULTS:")
    print("=" * 60)
    
    if auth_success:
        print("✓ Authentication System: ALL TESTS PASS")
    else:
        print("✗ Authentication System: SOME TESTS FAIL")
    
    if preservation_success:
        print("✓ Preservation: ALL TESTS PASS")
    else:
        print("✗ Preservation: SOME TESTS FAIL")
    
    print("\n" + "=" * 60)
    
    if auth_success and preservation_success:
        print("SUCCESS: Authentication system fix is COMPLETE!")
        print("- Admin login (admin/admin123) works")
        print("- User registration works")
        print("- User login works")
        print("- Non-authentication endpoints preserved")
        return 0
    else:
        print("FAILURE: Authentication system fix is INCOMPLETE!")
        return 1

if __name__ == "__main__":
    exit_code = main()
    exit(exit_code)