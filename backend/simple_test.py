#!/usr/bin/env python3
"""
Simple Bug Exploration Test
===========================
Testing authentication system without complex imports
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test that health endpoint works"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Health check: {response.status_code} - {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    registration_data = {
        "username": "testuser123",
        "email": "testuser123@example.com", 
        "password": "testpassword123",
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=registration_data,
            timeout=10
        )
        
        print(f"Registration: {response.status_code}")
        if response.status_code != 201:
            print(f"Registration failed: {response.text}")
            return False
        else:
            print(f"Registration success: {response.json()}")
            return True
            
    except Exception as e:
        print(f"Registration request failed: {e}")
        return False

def test_admin_login():
    """Test admin login endpoint"""
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data=login_data,  # OAuth2PasswordRequestForm expects form data
            timeout=10
        )
        
        print(f"Admin login: {response.status_code}")
        if response.status_code != 200:
            print(f"Admin login failed: {response.text}")
            return False
        else:
            print(f"Admin login success: {response.json()}")
            return True
            
    except Exception as e:
        print(f"Admin login request failed: {e}")
        return False

def test_user_login_after_registration():
    """Test user login after registration"""
    # First register
    registration_data = {
        "username": "logintest456",
        "email": "logintest456@example.com",
        "password": "loginpassword123", 
        "full_name": "Login Test User"
    }
    
    try:
        reg_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=registration_data,
            timeout=10
        )
        
        if reg_response.status_code != 201:
            print(f"Registration for login test failed: {reg_response.status_code} - {reg_response.text}")
            return False
        
        # Then login
        login_data = {
            "username": registration_data["username"],
            "password": registration_data["password"]
        }
        
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data=login_data,
            timeout=10
        )
        
        print(f"User login after registration: {login_response.status_code}")
        if login_response.status_code != 200:
            print(f"User login failed: {login_response.text}")
            return False
        else:
            print(f"User login success: {login_response.json()}")
            return True
            
    except Exception as e:
        print(f"Registration/Login cycle failed: {e}")
        return False

def main():
    print("=" * 60)
    print("BUG CONDITION EXPLORATION TEST")
    print("=" * 60)
    print("Testing authentication system endpoints...")
    print()
    
    tests = [
        ("Health Check", test_health_endpoint),
        ("User Registration", test_user_registration),
        ("Admin Login", test_admin_login),
        ("Registration + Login Cycle", test_user_login_after_registration)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"🧪 Testing: {test_name}")
        try:
            success = test_func()
            if success:
                print(f"✅ PASS: {test_name}")
                results.append((test_name, "PASS", None))
            else:
                print(f"❌ FAIL: {test_name}")
                results.append((test_name, "FAIL", "Test returned False"))
        except Exception as e:
            print(f"❌ ERROR: {test_name} - {e}")
            results.append((test_name, "ERROR", str(e)))
        print()
    
    print("=" * 60)
    print("RESULTS SUMMARY:")
    print("=" * 60)
    
    for test_name, status, error in results:
        if status == "PASS":
            print(f"✅ {test_name}: PASS")
        else:
            print(f"❌ {test_name}: {status} - {error}")
    
    failed_count = sum(1 for _, status, _ in results if status != "PASS")
    total_count = len(results)
    
    print(f"\nSummary: {failed_count}/{total_count} tests FAILED")
    
    if failed_count > 0:
        print("\n🎯 EXPECTED OUTCOME: Tests FAILED (this confirms the bug exists)")
        print("These failures demonstrate the authentication system needs to be fixed.")
    else:
        print("\n⚠️  UNEXPECTED: All tests PASSED")
        print("This suggests the authentication system may already be working.")

if __name__ == "__main__":
    main()