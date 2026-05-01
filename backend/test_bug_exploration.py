"""
Bug Condition Exploration Test
==============================

CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
DO NOT attempt to fix the test or the code when it fails
NOTE: This test encodes the expected behavior - it will validate the fix when it passes after implementation
GOAL: Surface counterexamples that demonstrate the bug exists

This test validates Property 1: Bug Condition - Authentication Functions Work Correctly
"""

import pytest
import requests
import json
import sys
import os

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from auth import get_password_hash, verify_password
    from database import get_db, engine
    from sqlalchemy.orm import Session
    import models
    IMPORTS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Could not import backend modules: {e}")
    IMPORTS_AVAILABLE = False

# Test configuration
BASE_URL = "http://localhost:8000"
ADMIN_HASH = "78b1fb4933ead1f2d636ab6ceaec1360:8f98853e9377f9ea7789d32a7b97ea4f2dc9665935fff702b424da99e18bca735"

class TestBugConditionExploration:
    """
    Bug Condition Exploration Tests
    
    These tests are designed to FAIL on unfixed code to demonstrate the bug exists.
    When the authentication system is fixed, these tests should PASS.
    """
    
    def test_password_hashing_function_works(self):
        """
        Test that get_password_hash function works correctly
        
        Bug Condition: get_password_hash("testpassword") raises Exception
        Expected Behavior: Should return valid salt:hash format string
        """
        if not IMPORTS_AVAILABLE:
            pytest.skip("Backend modules not available - need to start backend service")
            
        test_password = "testpassword"
        
        try:
            # This should work but may raise exception on unfixed code
            password_hash = get_password_hash(test_password)
            
            # Verify hash format is salt:hash
            assert ":" in password_hash, f"Hash should contain ':' separator, got: {password_hash}"
            
            salt, hash_part = password_hash.split(":", 1)
            assert len(salt) == 32, f"Salt should be 32 chars (16 bytes hex), got: {len(salt)}"
            assert len(hash_part) == 64, f"Hash should be 64 chars (SHA256 hex), got: {len(hash_part)}"
            
            print(f"✓ Password hashing works: {password_hash}")
            
        except Exception as e:
            pytest.fail(f"Password hashing failed with exception: {e}")
    
    def test_password_verification_function_works(self):
        """
        Test that verify_password function works correctly with admin hash
        
        Bug Condition: verify_password("admin123", admin_hash) returns False for correct password
        Expected Behavior: Should return True for correct admin password
        """
        if not IMPORTS_AVAILABLE:
            pytest.skip("Backend modules not available - need to start backend service")
            
        admin_password = "admin123"
        
        try:
            # This should return True but may return False on unfixed code
            is_valid = verify_password(admin_password, ADMIN_HASH)
            
            assert is_valid == True, f"Admin password verification should return True, got: {is_valid}"
            
            print(f"✓ Admin password verification works: {is_valid}")
            
        except Exception as e:
            pytest.fail(f"Password verification failed with exception: {e}")
    
    def test_password_hash_verify_cycle_works(self):
        """
        Test that password hash/verify cycle works correctly
        
        Bug Condition: Hash a password then verify it fails
        Expected Behavior: Should be able to hash a password and then verify it successfully
        """
        if not IMPORTS_AVAILABLE:
            pytest.skip("Backend modules not available - need to start backend service")
            
        test_password = "mycomplexpassword123"
        
        try:
            # Hash the password
            password_hash = get_password_hash(test_password)
            
            # Verify the password
            is_valid = verify_password(test_password, password_hash)
            
            assert is_valid == True, f"Hash/verify cycle should work, verification returned: {is_valid}"
            
            print(f"✓ Hash/verify cycle works for password: {test_password}")
            
        except Exception as e:
            pytest.fail(f"Hash/verify cycle failed with exception: {e}")
    
    def test_user_registration_endpoint_works(self):
        """
        Test that user registration endpoint works correctly
        
        Bug Condition: POST /api/auth/register returns 500 Internal Server Error
        Expected Behavior: Should successfully register user and return 201 Created
        """
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
            
            # Should get 201 Created, not 500 Internal Server Error
            assert response.status_code == 201, f"Registration should return 201, got: {response.status_code}, response: {response.text}"
            
            response_data = response.json()
            assert response_data["username"] == registration_data["username"]
            assert response_data["email"] == registration_data["email"]
            assert "id" in response_data
            
            print(f"✓ User registration works: {response_data}")
            
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Registration request failed: {e}")
        except Exception as e:
            pytest.fail(f"Registration test failed: {e}")
    
    def test_admin_login_endpoint_works(self):
        """
        Test that admin login endpoint works correctly
        
        Bug Condition: Admin login with admin/admin123 returns 401 Unauthorized
        Expected Behavior: Should successfully authenticate and return access token
        """
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
            
            # Should get 200 OK with token, not 401 Unauthorized
            assert response.status_code == 200, f"Admin login should return 200, got: {response.status_code}, response: {response.text}"
            
            response_data = response.json()
            assert "access_token" in response_data
            assert "token_type" in response_data
            assert response_data["token_type"] == "bearer"
            
            print(f"✓ Admin login works: got access token")
            
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Login request failed: {e}")
        except Exception as e:
            pytest.fail(f"Login test failed: {e}")
    
    def test_user_login_after_registration_works(self):
        """
        Test that user can login after successful registration
        
        Bug Condition: User registration works but login fails with authentication error
        Expected Behavior: Should be able to register and then login successfully
        """
        # First register a user
        registration_data = {
            "username": "logintest456",
            "email": "logintest456@example.com",
            "password": "loginpassword123", 
            "full_name": "Login Test User"
        }
        
        try:
            # Register
            reg_response = requests.post(
                f"{BASE_URL}/api/auth/register",
                json=registration_data,
                timeout=10
            )
            
            assert reg_response.status_code == 201, f"Registration failed: {reg_response.status_code}, {reg_response.text}"
            
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
            
            assert login_response.status_code == 200, f"Login after registration should work, got: {login_response.status_code}, response: {login_response.text}"
            
            response_data = login_response.json()
            assert "access_token" in response_data
            
            print(f"✓ Registration + Login cycle works")
            
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Registration/Login cycle request failed: {e}")
        except Exception as e:
            pytest.fail(f"Registration/Login cycle test failed: {e}")


if __name__ == "__main__":
    print("Running Bug Condition Exploration Tests...")
    print("IMPORTANT: These tests are expected to FAIL on unfixed code!")
    print("Failure confirms the bug exists and needs to be fixed.")
    print("-" * 60)
    
    # Run tests individually to see which ones fail
    test_instance = TestBugConditionExploration()
    
    tests = [
        ("Password Hashing Function", test_instance.test_password_hashing_function_works),
        ("Password Verification Function", test_instance.test_password_verification_function_works), 
        ("Hash/Verify Cycle", test_instance.test_password_hash_verify_cycle_works),
        ("User Registration Endpoint", test_instance.test_user_registration_endpoint_works),
        ("Admin Login Endpoint", test_instance.test_admin_login_endpoint_works),
        ("Registration + Login Cycle", test_instance.test_user_login_after_registration_works)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            print(f"\n🧪 Testing: {test_name}")
            test_func()
            print(f"✅ PASS: {test_name}")
            results.append((test_name, "PASS", None))
        except Exception as e:
            print(f"❌ FAIL: {test_name} - {e}")
            results.append((test_name, "FAIL", str(e)))
    
    print("\n" + "=" * 60)
    print("BUG CONDITION EXPLORATION RESULTS:")
    print("=" * 60)
    
    for test_name, status, error in results:
        if status == "PASS":
            print(f"✅ {test_name}: PASS")
        else:
            print(f"❌ {test_name}: FAIL - {error}")
    
    failed_count = sum(1 for _, status, _ in results if status == "FAIL")
    total_count = len(results)
    
    print(f"\nSummary: {failed_count}/{total_count} tests FAILED")
    
    if failed_count > 0:
        print("\n🎯 EXPECTED OUTCOME: Tests FAILED (this confirms the bug exists)")
        print("These failures demonstrate the authentication system needs to be fixed.")
    else:
        print("\n⚠️  UNEXPECTED: All tests PASSED")
        print("This suggests the authentication system may already be working.")