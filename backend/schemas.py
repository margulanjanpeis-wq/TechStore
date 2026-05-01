from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

# User schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    phone: Optional[str] = None
    address: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    stock_quantity: int = 0
    brand: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None

class ProductCreate(ProductBase):
    category_id: int

class Product(ProductBase):
    id: int
    category_id: int
    image_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    category: Optional[Category] = None
    
    class Config:
        from_attributes = True

# Cart schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True

# Order schemas
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    created_at: datetime
    product: Optional[Product] = None
    
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    total_amount: Decimal
    status: str
    payment_status: str
    created_at: datetime
    order_items: List[OrderItem] = []
    
    class Config:
        from_attributes = True

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
