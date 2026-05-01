#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    print("Testing user registration...")
    
    user_data = {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass123",
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            print("✅ Registration successful!")
            return True
        else:
            print("❌ Registration failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error during registration: {e}")
        return False

def test_login():
    """Test user login"""
    print("\nTesting user login...")
    
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data=login_data,  # OAuth2PasswordRequestForm expects form data
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return True
        else:
            print("❌ Login failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error during login: {e}")
        return False

def test_admin_login():
    """Test admin login with existing admin user"""
    print("\nTesting admin login...")
    
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Admin login successful!")
            return True
        else:
            print("❌ Admin login failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error during admin login: {e}")
        return False

def test_api_health():
    """Test if API is running"""
    print("Testing API health...")
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ API is healthy!")
            return True
        else:
            print("❌ API health check failed!")
            return False
            
    except Exception as e:
        print(f"❌ Error during health check: {e}")
        return False

if __name__ == "__main__":
    print("🔍 TechStore Authentication System Test")
    print("=" * 50)
    
    # Test API health first
    if not test_api_health():
        print("❌ API is not accessible. Exiting...")
        exit(1)
    
    # Test admin login (existing user)
    test_admin_login()
    
    # Test new user registration
    test_register()
    
    # Test login with new user
    test_login()
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")