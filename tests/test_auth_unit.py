"""
Unit tests for password hashing logic.
These tests run standalone — no FastAPI or database needed.
Run with: python -m pytest TechStore/tests/test_auth_unit.py -v
"""

import hashlib
import secrets
import pytest


# ── Inline the pure hashing functions (no FastAPI dependency) ─────────────────

def get_password_hash(password: str) -> str:
    salt = secrets.token_hex(16)
    h = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{h}"


def verify_password(plain: str, hashed: str) -> bool:
    try:
        if ":" not in hashed:
            return False
        salt, stored = hashed.split(":", 1)
        return hashlib.sha256((plain + salt).encode()).hexdigest() == stored
    except Exception:
        return False


# ── Tests ─────────────────────────────────────────────────────────────────────

class TestPasswordHashing:
    def test_hash_returns_string(self):
        assert isinstance(get_password_hash("mypassword"), str)

    def test_hash_contains_separator(self):
        assert ":" in get_password_hash("mypassword")

    def test_hash_has_correct_format(self):
        salt, h = get_password_hash("mypassword").split(":", 1)
        assert len(salt) == 32   # 16 bytes hex
        assert len(h) == 64      # SHA-256 hex

    def test_same_password_produces_different_hashes(self):
        assert get_password_hash("same") != get_password_hash("same")

    def test_empty_password_hashes_successfully(self):
        assert ":" in get_password_hash("")


class TestPasswordVerification:
    def test_correct_password_returns_true(self):
        h = get_password_hash("correctpassword")
        assert verify_password("correctpassword", h) is True

    def test_wrong_password_returns_false(self):
        h = get_password_hash("correctpassword")
        assert verify_password("wrongpassword", h) is False

    def test_hash_verify_cycle(self):
        for pwd in ["simple", "C0mpl3x!Pass", "123456", "a" * 100]:
            h = get_password_hash(pwd)
            assert verify_password(pwd, h) is True
            assert verify_password(pwd + "x", h) is False

    def test_malformed_hash_returns_false(self):
        assert verify_password("password", "nocolon") is False
        assert verify_password("password", "") is False

    def test_admin_hash_from_database(self):
        """The exact hash stored in init.sql must verify correctly."""
        admin_hash = (
            "5dc4029c8e5679a2b5036320a7cbfd61:"
            "5752904af9228cfc8c0929fa251425653b47958eb7df0555ecbf5ff93a33e019"
        )
        assert verify_password("admin123", admin_hash) is True
        assert verify_password("wrongpassword", admin_hash) is False
