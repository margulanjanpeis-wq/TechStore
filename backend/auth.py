from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import hashlib
import secrets
from fastapi import Depends, HTTPException, status, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import models
from database import get_db
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES  = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS    = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if ':' in hashed_password:
            salt, stored_hash = hashed_password.split(':', 1)
            password_hash = hashlib.sha256((plain_password + salt).encode()).hexdigest()
            return password_hash == stored_hash
        return False
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    try:
        salt = secrets.token_hex(16)
        password_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return f"{salt}:{password_hash}"
    except Exception as e:
        print(f"Password hashing error: {e}")
        raise HTTPException(status_code=500, detail="Password hashing failed")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(username: str) -> str:
    """7 күндік refresh token жасау"""
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    data = {"sub": username, "exp": expire, "type": "refresh"}
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_refresh_token(token: str) -> Optional[str]:
    """Refresh token тексеру → username қайтарады"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            return None
        username: str = payload.get("sub")
        return username
    except JWTError:
        return None

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Авторизация қажет",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise credentials_exception
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Аккаунт блокталған. Әкімшіге хабарласыңыз."
        )
    return user
