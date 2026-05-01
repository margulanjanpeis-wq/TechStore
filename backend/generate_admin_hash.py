#!/usr/bin/env python3
"""
Generate correct admin hash for admin123 password
"""

import hashlib
import secrets

def get_password_hash(password: str) -> str:
    """Hash a password using SHA256 with random salt"""
    try:
        # Generate a random salt
        salt = secrets.token_hex(16)
        # Hash password with salt
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        # Return salt:hash format
        return f"{salt}:{password_hash}"
    except Exception as e:
        print(f"Password hashing error: {e}")
        raise

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using SHA256 with salt"""
    try:
        # Extract salt and hash from stored password
        if ':' in hashed_password:
            salt, stored_hash = hashed_password.split(':', 1)
            # Hash the plain password with the same salt
            password_hash = hashlib.sha256((plain_password + salt).encode()).hexdigest()
            return password_hash == stored_hash
        else:
            return False
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

if __name__ == "__main__":
    password = "admin123"
    
    print("Generating new admin hash...")
    new_hash = get_password_hash(password)
    print(f"New hash: {new_hash}")
    
    print("\nVerifying new hash...")
    is_valid = verify_password(password, new_hash)
    print(f"Verification result: {is_valid}")
    
    print("\nTesting with existing hash...")
    existing_hash = "78b1fb4933ead1f2d636ab6ceaec1360:8f98853e9377f9ea7789d32a7b97ea4f2dc9665935fff702b424da99e18bca735"
    is_valid_existing = verify_password(password, existing_hash)
    print(f"Existing hash verification: {is_valid_existing}")
    
    if not is_valid_existing:
        print(f"\n🔧 SOLUTION: Update database with new hash:")
        print(f"UPDATE users SET password_hash = '{new_hash}' WHERE username = 'admin';")