"""
TechStore API Integration Tests
================================
Run with:  pytest tests/ -v
"""

import pytest
import requests

BASE_URL = "http://localhost:8000"


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def api():
    """Verify the API is reachable before running tests."""
    try:
        r = requests.get(f"{BASE_URL}/health", timeout=5)
        assert r.status_code == 200, "API is not reachable"
    except Exception as e:
        pytest.skip(f"API not available: {e}")
    return BASE_URL


@pytest.fixture(scope="session")
def registered_user(api):
    """Register a test user and return credentials."""
    import time
    suffix = int(time.time())
    data = {
        "username": f"pytest_user_{suffix}",
        "email": f"pytest_{suffix}@test.com",
        "password": "TestPass123!",
        "full_name": "Pytest User",
    }
    r = requests.post(f"{api}/api/auth/register", json=data, timeout=10)
    assert r.status_code == 201, f"Registration failed: {r.text}"
    return data


@pytest.fixture(scope="session")
def auth_token(api, registered_user):
    """Log in and return a Bearer token."""
    r = requests.post(
        f"{api}/api/auth/login",
        data={"username": registered_user["username"], "password": registered_user["password"]},
        timeout=10,
    )
    assert r.status_code == 200, f"Login failed: {r.text}"
    return r.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


# ── Health & Root ─────────────────────────────────────────────────────────────

class TestHealth:
    def test_health_returns_200(self, api):
        r = requests.get(f"{api}/health", timeout=5)
        assert r.status_code == 200
        assert r.json() == {"status": "healthy"}

    def test_root_returns_version(self, api):
        r = requests.get(f"{api}/", timeout=5)
        assert r.status_code == 200
        data = r.json()
        assert "version" in data
        assert data["version"] == "1.0.0"

    def test_metrics_endpoint(self, api):
        r = requests.get(f"{api}/metrics", timeout=5)
        assert r.status_code == 200
        assert "techstore_requests_total" in r.text


# ── Authentication ────────────────────────────────────────────────────────────

class TestAuthentication:
    def test_register_new_user(self, api):
        import time
        suffix = int(time.time()) + 1
        data = {
            "username": f"new_user_{suffix}",
            "email": f"new_{suffix}@test.com",
            "password": "Password123!",
            "full_name": "New User",
        }
        r = requests.post(f"{api}/api/auth/register", json=data, timeout=10)
        assert r.status_code == 201
        body = r.json()
        assert body["username"] == data["username"]
        assert "id" in body
        assert "password" not in body  # password must never be returned

    def test_register_duplicate_username_fails(self, api, registered_user):
        data = {
            "username": registered_user["username"],
            "email": "different@test.com",
            "password": "Password123!",
        }
        r = requests.post(f"{api}/api/auth/register", json=data, timeout=10)
        assert r.status_code == 400

    def test_login_valid_credentials(self, api, registered_user):
        r = requests.post(
            f"{api}/api/auth/login",
            data={"username": registered_user["username"], "password": registered_user["password"]},
            timeout=10,
        )
        assert r.status_code == 200
        body = r.json()
        assert "access_token" in body
        assert body["token_type"] == "bearer"

    def test_login_wrong_password_fails(self, api, registered_user):
        r = requests.post(
            f"{api}/api/auth/login",
            data={"username": registered_user["username"], "password": "wrongpassword"},
            timeout=10,
        )
        assert r.status_code == 401

    def test_admin_login(self, api):
        r = requests.post(
            f"{api}/api/auth/login",
            data={"username": "admin", "password": "admin123"},
            timeout=10,
        )
        assert r.status_code == 200
        assert "access_token" in r.json()

    def test_protected_endpoint_without_token(self, api):
        r = requests.get(f"{api}/api/cart", timeout=5)
        assert r.status_code == 401

    def test_protected_endpoint_with_token(self, api, auth_headers):
        r = requests.get(f"{api}/api/cart", headers=auth_headers, timeout=5)
        assert r.status_code == 200


# ── Products ──────────────────────────────────────────────────────────────────

class TestProducts:
    def test_list_products(self, api):
        r = requests.get(f"{api}/api/products", timeout=10)
        assert r.status_code == 200
        products = r.json()
        assert isinstance(products, list)
        assert len(products) > 0

    def test_product_has_required_fields(self, api):
        r = requests.get(f"{api}/api/products", timeout=10)
        product = r.json()[0]
        for field in ["id", "name", "price", "category_id", "is_active"]:
            assert field in product, f"Missing field: {field}"

    def test_get_product_by_id(self, api):
        products = requests.get(f"{api}/api/products", timeout=10).json()
        pid = products[0]["id"]
        r = requests.get(f"{api}/api/products/{pid}", timeout=10)
        assert r.status_code == 200
        assert r.json()["id"] == pid

    def test_get_nonexistent_product_returns_404(self, api):
        r = requests.get(f"{api}/api/products/999999", timeout=10)
        assert r.status_code == 404

    def test_list_categories(self, api):
        r = requests.get(f"{api}/api/categories", timeout=10)
        assert r.status_code == 200
        categories = r.json()
        assert isinstance(categories, list)
        assert len(categories) > 0

    def test_products_by_category(self, api):
        categories = requests.get(f"{api}/api/categories", timeout=10).json()
        cid = categories[0]["id"]
        r = requests.get(f"{api}/api/categories/{cid}/products", timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ── Cart ──────────────────────────────────────────────────────────────────────

class TestCart:
    def test_get_empty_cart(self, api, auth_headers):
        r = requests.get(f"{api}/api/cart", headers=auth_headers, timeout=10)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_add_item_to_cart(self, api, auth_headers):
        products = requests.get(f"{api}/api/products", timeout=10).json()
        pid = products[0]["id"]
        r = requests.post(
            f"{api}/api/cart",
            json={"product_id": pid, "quantity": 1},
            headers=auth_headers,
            timeout=10,
        )
        assert r.status_code == 200
        body = r.json()
        assert body["product_id"] == pid
        assert body["quantity"] >= 1

    def test_remove_item_from_cart(self, api, auth_headers):
        # Add first
        products = requests.get(f"{api}/api/products", timeout=10).json()
        pid = products[1]["id"]
        add_r = requests.post(
            f"{api}/api/cart",
            json={"product_id": pid, "quantity": 1},
            headers=auth_headers,
            timeout=10,
        )
        assert add_r.status_code == 200
        item_id = add_r.json()["id"]

        # Then remove
        del_r = requests.delete(
            f"{api}/api/cart/{item_id}",
            headers=auth_headers,
            timeout=10,
        )
        assert del_r.status_code == 200


# ── Chatbot ───────────────────────────────────────────────────────────────────

class TestChatbot:
    def test_chatbot_health(self, api):
        r = requests.get(f"{api}/api/chat/health", timeout=5)
        assert r.status_code == 200
        assert r.json()["status"] == "healthy"

    def test_chatbot_greeting(self, api):
        r = requests.post(
            f"{api}/api/chat",
            json={"message": "hello", "use_ai": False},
            timeout=10,
        )
        assert r.status_code == 200
        body = r.json()
        assert "response" in body
        assert len(body["response"]) > 0
        assert "source" in body

    def test_chatbot_product_query(self, api):
        r = requests.post(
            f"{api}/api/chat",
            json={"message": "laptop", "use_ai": False},
            timeout=10,
        )
        assert r.status_code == 200
        assert len(r.json()["response"]) > 0

    def test_chatbot_empty_message(self, api):
        r = requests.post(
            f"{api}/api/chat",
            json={"message": "", "use_ai": False},
            timeout=10,
        )
        assert r.status_code == 200  # graceful handling
