from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import models
import schemas
import auth
from database import engine, get_db
from prometheus_client import Counter, Histogram, generate_latest
from fastapi.responses import Response as PrometheusResponse
import time
import chatbot

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TechStore API",
    description="Компьютер бөлшектерін сату жүйесі",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost",
        "https://localhost",
        "http://172.20.10.2",
        "https://172.20.10.2",
        "http://172.20.10.3",
        "https://172.20.10.3",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prometheus metrics
REQUEST_COUNT = Counter('techstore_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('techstore_request_duration_seconds', 'Request duration')

@app.middleware("http")
async def metrics_middleware(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_DURATION.observe(duration)
    
    return response

@app.get("/")
def read_root():
    return {
        "message": "TechStore API қош келдіңіз!",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/metrics")
def metrics():
    return PrometheusResponse(content=generate_latest(), media_type="text/plain")

# Authentication endpoints
@app.post("/api/auth/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email тіркелген")
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Пайдаланушы аты бар")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    response: Response = None
):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Қате логин немесе пароль"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Аккаунт блокталған. Әкімшіге хабарласыңыз."
        )

    access_token  = auth.create_access_token(data={"sub": user.username})
    refresh_token = auth.create_refresh_token(username=user.username)

    # Refresh token → httpOnly cookie (JS оқи алмайды — XSS-тен қорғалған)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,        # HTTPS арқылы ғана
        samesite="lax",
        max_age=7 * 24 * 3600,  # 7 күн
        path="/api/auth/refresh",
    )

    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/auth/refresh")
def refresh_token(
    request: Request,
    db: Session = Depends(get_db),
    response: Response = None
):
    """Cookie-дегі refresh token арқылы жаңа access token алу"""
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Refresh token жоқ, қайта кіріңіз")

    username = auth.verify_refresh_token(token)
    if not username:
        raise HTTPException(status_code=401, detail="Refresh token жарамсыз немесе мерзімі өтті")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Пайдаланушы табылмады немесе блокталған")

    # Жаңа access token
    new_access_token = auth.create_access_token(data={"sub": user.username})

    # Refresh token-ді де жаңарту (rotation)
    new_refresh_token = auth.create_refresh_token(username=user.username)
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=7 * 24 * 3600,
        path="/api/auth/refresh",
    )

    return {"access_token": new_access_token, "token_type": "bearer"}

@app.post("/api/auth/logout")
def logout(response: Response):
    """Cookie-ді тазалау"""
    response.delete_cookie(key="refresh_token", path="/api/auth/refresh")
    return {"message": "Сәтті шықтыңыз"}

# User profile endpoints
@app.get("/api/users/me", response_model=schemas.User)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.put("/api/users/me", response_model=schemas.User)
def update_profile(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if user_update.email and user_update.email != current_user.email:
        existing = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Бұл email тіркелген")
    
    for field, value in user_update.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/api/users/me/password")
def update_password(
    password_update: schemas.UserPasswordUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if not auth.verify_password(password_update.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Ағымдағы пароль қате")
    
    current_user.password_hash = auth.get_password_hash(password_update.new_password)
    db.commit()
    return {"message": "Пароль сәтті өзгертілді"}

# Product endpoints
@app.get("/api/products", response_model=List[schemas.Product])
def get_products(skip: int = 0, limit: int = 500, db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(models.Product.is_active == True).offset(skip).limit(limit).all()
    return products

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Тауар табылмады")
    return product

@app.get("/api/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).all()
    return categories

@app.get("/api/categories/{category_id}/products", response_model=List[schemas.Product])
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(
        models.Product.category_id == category_id,
        models.Product.is_active == True
    ).all()
    return products

# Cart endpoints
@app.post("/api/cart", response_model=schemas.CartItem)
def add_to_cart(
    cart_item: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    existing_item = db.query(models.CartItem).filter(
        models.CartItem.user_id == current_user.id,
        models.CartItem.product_id == cart_item.product_id
    ).first()
    
    if existing_item:
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    db_cart_item = models.CartItem(
        user_id=current_user.id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity
    )
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    return db_cart_item

@app.get("/api/cart", response_model=List[schemas.CartItem])
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    return cart_items

@app.delete("/api/cart/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == item_id,
        models.CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Себет элементі табылмады")
    
    db.delete(cart_item)
    db.commit()
    return {"message": "Себеттен өшірілді"}

# Order endpoints
@app.post("/api/orders", response_model=schemas.Order, status_code=status.HTTP_201_CREATED)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Себет бос")

    # ── Stock тексеру ─────────────────────────────────────────
    for item in cart_items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product or not product.is_active:
            raise HTTPException(status_code=400, detail=f"'{product.name if product else item.product_id}' өнімі қол жетімді емес")
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"'{product.name}' өнімінен тек {product.stock_quantity} дана қалды, сіз {item.quantity} дана сұрадыңыз"
            )

    # ── Жалпы сома ────────────────────────────────────────────
    total_amount = sum(item.product.price * item.quantity for item in cart_items)

    # ── Тапсырыс жасау ───────────────────────────────────────
    db_order = models.Order(
        user_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # ── Order items + Stock азайту ────────────────────────────
    for cart_item in cart_items:
        order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            price=cart_item.product.price
        )
        db.add(order_item)
        # Stock азайту
        product = db.query(models.Product).filter(models.Product.id == cart_item.product_id).first()
        product.stock_quantity -= cart_item.quantity
        if product.stock_quantity <= 0:
            product.stock_quantity = 0

    # ── Себетті тазалау ───────────────────────────────────────
    for cart_item in cart_items:
        db.delete(cart_item)

    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/api/orders", response_model=List[schemas.Order])
def get_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@app.get("/api/orders/{order_id}", response_model=schemas.Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Тапсырыс табылмады")
    
    return order

# ── Admin endpoints ───────────────────────────────────────────────────────────

from sqlalchemy import func as sqlfunc
from datetime import datetime, timedelta

def require_admin(current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Рұқсат жоқ — тек admin")
    return current_user

class OrderStatusUpdate(BaseModel):
    status: str

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int = 0
    brand: Optional[str] = None
    image_url: Optional[str] = None
    category_id: int
    specifications: Optional[dict] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    brand: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    specifications: Optional[dict] = None
    is_active: Optional[bool] = None

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class UserRoleUpdate(BaseModel):
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None

# ── Dashboard ─────────────────────────────────────────────────────────────────
@app.get("/api/admin/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    total_orders   = db.query(models.Order).count()
    total_revenue  = db.query(sqlfunc.sum(models.Order.total_amount)).filter(
        models.Order.status != "cancelled").scalar() or 0
    total_users    = db.query(models.User).filter(models.User.is_admin == False).count()
    total_products = db.query(models.Product).filter(models.Product.is_active == True).count()

    # Статус бойынша санау
    status_counts = {}
    for s in ["pending", "processing", "shipped", "delivered", "cancelled"]:
        status_counts[s] = db.query(models.Order).filter(models.Order.status == s).count()

    # Соңғы 7 күндік сатылым
    daily_sales = []
    for i in range(6, -1, -1):
        day = datetime.utcnow().date() - timedelta(days=i)
        day_start = datetime.combine(day, datetime.min.time())
        day_end   = datetime.combine(day, datetime.max.time())
        revenue = db.query(sqlfunc.sum(models.Order.total_amount)).filter(
            models.Order.created_at >= day_start,
            models.Order.created_at <= day_end,
            models.Order.status != "cancelled"
        ).scalar() or 0
        count = db.query(models.Order).filter(
            models.Order.created_at >= day_start,
            models.Order.created_at <= day_end,
            models.Order.status != "cancelled"
        ).count()
        daily_sales.append({"date": str(day), "revenue": float(revenue), "orders": count})

    # Ең көп сатылған өнімдер (cancelled тапсырыстарды алып тастау)
    top_products = db.query(
        models.Product.name,
        models.Product.brand,
        sqlfunc.sum(models.OrderItem.quantity).label("sold"),
        sqlfunc.sum(models.OrderItem.price * models.OrderItem.quantity).label("revenue")
    ).join(models.OrderItem).join(
        models.Order, models.Order.id == models.OrderItem.order_id
    ).filter(
        models.Order.status != "cancelled"
    ).group_by(models.Product.id).order_by(
        sqlfunc.sum(models.OrderItem.quantity).desc()
    ).limit(5).all()

    # Категория бойынша табыс (cancelled тапсырыстарды алып тастау)
    top_categories = db.query(
        models.Category.name,
        sqlfunc.sum(models.OrderItem.price * models.OrderItem.quantity).label("revenue")
    ).join(models.Product, models.Product.category_id == models.Category.id
    ).join(models.OrderItem, models.OrderItem.product_id == models.Product.id
    ).join(models.Order, models.Order.id == models.OrderItem.order_id
    ).filter(
        models.Order.status != "cancelled"
    ).group_by(models.Category.id).order_by(
        sqlfunc.sum(models.OrderItem.price * models.OrderItem.quantity).desc()
    ).all()

    avg_order = float(total_revenue) / total_orders if total_orders > 0 else 0

    # Аз қалған өнімдер (stock <= 5)
    low_stock = db.query(
        models.Product.id,
        models.Product.name,
        models.Product.brand,
        models.Product.stock_quantity
    ).filter(
        models.Product.is_active == True,
        models.Product.stock_quantity <= 5
    ).order_by(models.Product.stock_quantity.asc()).limit(10).all()

    # Өтпей жатқан категориялар (тапсырыс жоқ немесе аз)
    all_categories = db.query(models.Category).all()
    cat_revenue_map = {c.name: 0 for c in all_categories}
    for c in top_categories:
        cat_revenue_map[c.name] = float(c.revenue)
    slow_categories = [
        {"name": name, "revenue": rev}
        for name, rev in cat_revenue_map.items()
        if rev == 0
    ]

    return {
        "total_orders":     total_orders,
        "total_revenue":    float(total_revenue),
        "total_users":      total_users,
        "total_products":   total_products,
        "avg_order":        avg_order,
        "status_counts":    status_counts,
        "daily_sales":      daily_sales,
        "top_products":     [{"name": p.name, "brand": p.brand, "sold": int(p.sold), "revenue": float(p.revenue)} for p in top_products],
        "top_categories":   [{"name": c.name, "revenue": float(c.revenue)} for c in top_categories],
        "low_stock":        [{"id": p.id, "name": p.name, "brand": p.brand, "stock": p.stock_quantity} for p in low_stock],
        "slow_categories":  slow_categories,
    }

# ── Orders ────────────────────────────────────────────────────────────────────
@app.get("/api/admin/orders")
def admin_get_all_orders(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
    result = []
    for o in orders:
        user = db.query(models.User).filter(models.User.id == o.user_id).first()
        items = db.query(models.OrderItem).filter(models.OrderItem.order_id == o.id).all()
        item_list = []
        for item in items:
            prod = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            item_list.append({
                "id": item.id,
                "product_name": prod.name if prod else "—",
                "product_image": prod.image_url if prod else None,
                "quantity": item.quantity,
                "price": float(item.price),
            })
        result.append({
            "id": o.id,
            "status": o.status,
            "payment_status": o.payment_status,
            "payment_method": o.payment_method,
            "total_amount": float(o.total_amount),
            "shipping_address": o.shipping_address,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "customer": {
                "id": user.id if user else None,
                "username": user.username if user else "—",
                "full_name": user.full_name if user else "—",
                "email": user.email if user else "—",
                "phone": user.phone if user else "—",
            },
            "items": item_list,
        })
    return result

@app.put("/api/admin/orders/{order_id}/status")
def admin_update_order_status(
    order_id: int,
    body: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    allowed = {"pending", "processing", "shipped", "delivered", "cancelled"}
    if body.status not in allowed:
        raise HTTPException(status_code=400, detail="Жарамсыз статус")
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Тапсырыс табылмады")

    prev_status = order.status

    # Cancelled болса — stock қайтару
    if body.status == "cancelled" and prev_status != "cancelled":
        items = db.query(models.OrderItem).filter(models.OrderItem.order_id == order_id).all()
        for item in items:
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            if product:
                product.stock_quantity += item.quantity

    order.status = body.status
    if body.status == "delivered":
        order.payment_status = "paid"
    db.commit()
    return {"status": body.status}

# ── Products CRUD ─────────────────────────────────────────────────────────────
@app.get("/api/admin/products", response_model=List[schemas.Product])
def admin_get_products(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    return db.query(models.Product).order_by(models.Product.id.desc()).all()

@app.post("/api/admin/products", response_model=schemas.Product, status_code=201)
def admin_create_product(
    body: ProductCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    product = models.Product(**body.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@app.put("/api/admin/products/{product_id}", response_model=schemas.Product)
def admin_update_product(
    product_id: int,
    body: ProductUpdate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Өнім табылмады")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product

@app.delete("/api/admin/products/{product_id}")
def admin_delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Өнім табылмады")
    product.is_active = False
    db.commit()
    return {"message": "Өнім өшірілді"}

# ── Categories CRUD ───────────────────────────────────────────────────────────
@app.post("/api/admin/categories", response_model=schemas.Category, status_code=201)
def admin_create_category(
    body: CategoryCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    cat = models.Category(name=body.name, description=body.description)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@app.put("/api/admin/categories/{cat_id}", response_model=schemas.Category)
def admin_update_category(
    cat_id: int,
    body: CategoryCreate,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Категория табылмады")
    cat.name = body.name
    if body.description is not None:
        cat.description = body.description
    db.commit()
    db.refresh(cat)
    return cat

@app.delete("/api/admin/categories/{cat_id}")
def admin_delete_category(
    cat_id: int,
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    cat = db.query(models.Category).filter(models.Category.id == cat_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Категория табылмады")
    db.delete(cat)
    db.commit()
    return {"message": "Категория өшірілді"}

# ── Users ─────────────────────────────────────────────────────────────────────
@app.get("/api/admin/users")
def admin_get_users(
    db: Session = Depends(get_db),
    _: models.User = Depends(require_admin)
):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "full_name": u.full_name,
            "phone": u.phone,
            "is_active": u.is_active,
            "is_admin": u.is_admin,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "order_count": db.query(models.Order).filter(models.Order.user_id == u.id).count(),
        }
        for u in users
    ]

@app.put("/api/admin/users/{user_id}/role")
def admin_update_user_role(
    user_id: int,
    body: UserRoleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Өз рөліңізді өзгерте алмайсыз")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пайдаланушы табылмады")
    if body.is_admin is not None:
        user.is_admin = body.is_admin
    if body.is_active is not None:
        user.is_active = body.is_active
    db.commit()
    return {"message": "Жаңартылды", "is_admin": user.is_admin, "is_active": user.is_active}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ── Chatbot endpoints ─────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    message: str
    use_ai: Optional[bool] = True


class ChatResponse(BaseModel):
    response: str
    source: str
    timestamp: str


@app.post("/api/chat", response_model=ChatResponse)
async def chat(
    body: ChatMessage,
    db: Session = Depends(get_db),
):
    """AI-powered customer support chatbot."""
    result = await chatbot.get_chatbot_response(
        message=body.message,
        db=db,
        use_ai=body.use_ai,
    )
    return ChatResponse(
        response=result["response"],
        source=result["source"],
        timestamp=__import__("datetime").datetime.utcnow().isoformat(),
    )


@app.get("/api/chat/health")
def chat_health():
    return {
        "status": "healthy",
        "openai_configured": bool(__import__("os").getenv("OPENAI_API_KEY")),
    }
