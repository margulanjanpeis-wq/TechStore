"""
Pytest configuration and shared fixtures.
"""
import pytest


def pytest_configure(config):
    config.addinivalue_line("markers", "slow: marks tests as slow")
    config.addinivalue_line("markers", "integration: marks tests as integration tests")
