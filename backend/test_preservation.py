"""
Preservation Property Tests
===========================

IMPORTANT: Follow observation-first methodology
These tests observe behavior on UNFIXED code for non-authentication endpoints
and ensure they remain unchanged after the authentication fix.

Property 2: Preservation - Non-Authentication Functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

class TestPreservationProperties:
    """
    Preservation Property Tests
    
    These tests capture the baseline behavior of non-authentication endpoints
    and ensure they remain unchanged after authentication fixes.
    """
    
    def test_health_endpoint_preservation(self):
        """
        Test that health endpoint continues to work correctly
        
        Preservation: Health check endpoint should remain unchanged
        """
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            
            # Observe baseline behavior
            assert response.status_code == 200, f"Health endpoint should return 200, got: {response.status_code}"
            
            response_data = response.json()
            assert response_data == {"status": "healthy"}, f"Health response should be {{'status': 'healthy'}}, got: {response_data}"
            
            # Check response headers
            assert "application/json" in response.headers.get("content-type", ""), "Health endpoint should return JSON"
            
            print(f"✓ Health endpoint preservation: {response.status_code} - {response_data}")
            return True
            
        except Exception as e:
            print(f"Health endpoint preservation failed: {e}")
            return False
    
    def test_metrics_endpoint_preservation(self):
        """
        Test that metrics endpoint continues to work correctly
        
        Preservation: Prometheus metrics endpoint should remain unchanged
        """
        try:
            response = requests.get(f"{BASE_URL}/metrics", timeout=5)
            
            # Observe baseline behavior
            assert response.status_code == 200, f"Metrics endpoint should return 200, got: {response.status_code}"
            
            # Check that it returns Prometheus format
            content = response.text
            assert "techstore_requests_total" in content, "Metrics should contain techstore_requests_total"
            assert "techstore_request_duration_seconds" in content, "Metrics should contain techstore_request_duration_seconds"
            
            # Check content type
            assert "text/plain" in response.headers.get("content-type", ""), "Metrics should return text/plain"
            
            print(f"✓ Metrics endpoint preservation: {response.status_code} - {len(content)} bytes")
            return True
            
        except Exception as e:
            print(f"Metrics endpoint preservation failed: {e}")
            return False
    
    def test_root_endpoint_preservation(self):
        """
        Test that root endpoint continues to work correctly
        
        Preservation: Root API endpoint should remain unchanged
        """
        try:
            response = requests.get(f"{BASE_URL}/", timeout=5)
            
            # Observe baseline behavior
            assert response.status_code == 200, f"Root endpoint should return 200, got: {response.status_code}"
            
            response_data = response.json()
            expected_keys = ["message", "version", "docs"]
            for key in expected_keys:
                assert key in response_data, f"Root response should contain '{key}', got: {response_data}"
            
            assert response_data["version"] == "1.0.0", f"Version should be 1.0.0, got: {response_data['version']}"
            assert response_data["docs"] == "/docs", f"Docs should be /docs, got: {response_data['docs']}"
            
            print(f"✓ Root endpoint preservation: {response_data}")
            return True
            
        except Exception as e:
            print(f"Root endpoint preservation failed: {e}")
            return False
    
    def test_products_endpoint_preservation(self):
        """
        Test that products endpoint continues to work correctly (without auth)
        
        Preservation: Product listing should remain unchanged
        """
        try:
            response = requests.get(f"{BASE_URL}/api/products", timeout=10)
            
            # Observe baseline behavior
            assert response.status_code == 200, f"Products endpoint should return 200, got: {response.status_code}"
            
            products = response.json()
            assert isinstance(products, list), f"Products should return a list, got: {type(products)}"
            
            # Check that we have sample products
            assert len(products) > 0, "Should have sample products in database"
            
            # Check product structure
            if products:
                product = products[0]
                expected_fields = ["id", "name", "price", "category_id", "is_active"]
                for field in expected_fields:
                    assert field in product, f"Product should have '{field}' field, got: {product.keys()}"
            
            print(f"✓ Products endpoint preservation: {len(products)} products")
            return True
            
        except Exception as e:
            print(f"Products endpoint preservation failed: {e}")
            return False
    
    def test_categories_endpoint_preservation(self):
        """
        Test that categories endpoint continues to work correctly
        
        Preservation: Category listing should remain unchanged
        """
        try:
            response = requests.get(f"{BASE_URL}/api/categories", timeout=10)
            
            # Observe baseline behavior
            assert response.status_code == 200, f"Categories endpoint should return 200, got: {response.status_code}"
            
            categories = response.json()
            assert isinstance(categories, list), f"Categories should return a list, got: {type(categories)}"
            
            # Check that we have sample categories
            assert len(categories) > 0, "Should have sample categories in database"
            
            # Check category structure
            if categories:
                category = categories[0]
                expected_fields = ["id", "name", "created_at"]
                for field in expected_fields:
                    assert field in category, f"Category should have '{field}' field, got: {category.keys()}"
            
            print(f"✓ Categories endpoint preservation: {len(categories)} categories")
            return True
            
        except Exception as e:
            print(f"Categories endpoint preservation failed: {e}")
            return False
    
    def test_specific_product_endpoint_preservation(self):
        """
        Test that specific product endpoint continues to work correctly
        
        Preservation: Individual product retrieval should remain unchanged
        """
        try:
            # First get a product ID
            products_response = requests.get(f"{BASE_URL}/api/products", timeout=10)
            assert products_response.status_code == 200, "Need products list to test specific product"
            
            products = products_response.json()
            assert len(products) > 0, "Need at least one product to test"
            
            product_id = products[0]["id"]
            
            # Test specific product endpoint
            response = requests.get(f"{BASE_URL}/api/products/{product_id}", timeout=10)
            
            # Observe baseline behavior
            assert response.status_code == 200, f"Specific product endpoint should return 200, got: {response.status_code}"
            
            product = response.json()
            assert product["id"] == product_id, f"Product ID should match requested ID {product_id}, got: {product['id']}"
            
            expected_fields = ["id", "name", "price", "category_id", "is_active"]
            for field in expected_fields:
                assert field in product, f"Product should have '{field}' field, got: {product.keys()}"
            
            print(f"✓ Specific product endpoint preservation: product {product_id}")
            return True
            
        except Exception as e:
            print(f"Specific product endpoint preservation failed: {e}")
            return False
    
    def test_cors_headers_preservation(self):
        """
        Test that CORS headers continue to work correctly
        
        Preservation: CORS middleware should remain unchanged
        """
        try:
            # Test with OPTIONS request (preflight)
            response = requests.options(f"{BASE_URL}/api/products", timeout=5)
            
            # CORS headers should be present
            cors_headers = [
                "access-control-allow-origin",
                "access-control-allow-methods", 
                "access-control-allow-headers"
            ]
            
            for header in cors_headers:
                assert header in [h.lower() for h in response.headers.keys()], f"CORS header '{header}' should be present"
            
            print(f"✓ CORS headers preservation: {response.status_code}")
            return True
            
        except Exception as e:
            print(f"CORS headers preservation failed: {e}")
            return False
    
    def test_database_connection_preservation(self):
        """
        Test that database connection continues to work correctly
        
        Preservation: Database queries should remain unchanged
        """
        try:
            # Test multiple endpoints that use database
            endpoints = [
                "/api/products",
                "/api/categories"
            ]
            
            for endpoint in endpoints:
                response = requests.get(f"{BASE_URL}{endpoint}", timeout=10)
                assert response.status_code == 200, f"Database-dependent endpoint {endpoint} should work, got: {response.status_code}"
                
                data = response.json()
                assert isinstance(data, list), f"Endpoint {endpoint} should return list from database"
                assert len(data) > 0, f"Endpoint {endpoint} should return data from database"
            
            print(f"✓ Database connection preservation: {len(endpoints)} endpoints tested")
            return True
            
        except Exception as e:
            print(f"Database connection preservation failed: {e}")
            return False


def main():
    print("=" * 60)
    print("PRESERVATION PROPERTY TESTS")
    print("=" * 60)
    print("Observing baseline behavior on UNFIXED code...")
    print("These tests capture behavior that should remain unchanged after authentication fix.")
    print()
    
    test_instance = TestPreservationProperties()
    
    tests = [
        ("Health Endpoint", test_instance.test_health_endpoint_preservation),
        ("Metrics Endpoint", test_instance.test_metrics_endpoint_preservation),
        ("Root Endpoint", test_instance.test_root_endpoint_preservation),
        ("Products Endpoint", test_instance.test_products_endpoint_preservation),
        ("Categories Endpoint", test_instance.test_categories_endpoint_preservation),
        ("Specific Product Endpoint", test_instance.test_specific_product_endpoint_preservation),
        ("CORS Headers", test_instance.test_cors_headers_preservation),
        ("Database Connection", test_instance.test_database_connection_preservation)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"🔍 Observing: {test_name}")
        try:
            success = test_func()
            if success:
                print(f"✅ BASELINE: {test_name}")
                results.append((test_name, "BASELINE", None))
            else:
                print(f"❌ ISSUE: {test_name}")
                results.append((test_name, "ISSUE", "Test returned False"))
        except Exception as e:
            print(f"❌ ERROR: {test_name} - {e}")
            results.append((test_name, "ERROR", str(e)))
        print()
    
    print("=" * 60)
    print("BASELINE BEHAVIOR CAPTURED:")
    print("=" * 60)
    
    for test_name, status, error in results:
        if status == "BASELINE":
            print(f"✅ {test_name}: BASELINE CAPTURED")
        else:
            print(f"❌ {test_name}: {status} - {error}")
    
    issues_count = sum(1 for _, status, _ in results if status != "BASELINE")
    total_count = len(results)
    
    print(f"\nSummary: {issues_count}/{total_count} tests had ISSUES")
    
    if issues_count == 0:
        print("\n✅ EXPECTED OUTCOME: All baseline behaviors captured successfully")
        print("These behaviors should remain unchanged after authentication fix.")
    else:
        print("\n⚠️  WARNING: Some baseline behaviors have issues")
        print("These issues exist before the authentication fix and should be noted.")

if __name__ == "__main__":
    main()