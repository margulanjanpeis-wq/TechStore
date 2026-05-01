# TechStore Architecture Documentation

## Жүйенің жалпы архитектурасы

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│                    (Web Browser / Mobile)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Nginx (Port 80/443)                     │
│                    Reverse Proxy / SSL                       │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│   Frontend (Port 5173)   │  │    Backend API (Port 8000)   │
│      React + Vite        │  │         FastAPI              │
│   - UI Components        │  │   - REST API                 │
│   - State Management     │  │   - Business Logic           │
│   - Routing              │  │   - Authentication           │
└──────────────────────────┘  └──────────┬───────────────────┘
                                         │
                                         ▼
                              ┌──────────────────────────────┐
                              │  PostgreSQL (Port 5432)      │
                              │      Database                │
                              │   - Users                    │
                              │   - Products                 │
                              │   - Orders                   │
                              │   - Cart                     │
                              └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Monitoring Layer                         │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │ Prometheus:9090  │────────▶│   Grafana:3000       │     │
│  │  Metrics         │         │   Dashboards         │     │
│  └──────────────────┘         └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Компоненттер

### 1. Frontend (React)

**Технологиялар:**
- React 18
- Vite (Build tool)
- React Router (Routing)
- Zustand (State management)
- Axios (HTTP client)

**Құрылымы:**
```
frontend/
├── src/
│   ├── components/     # Қайта пайдаланылатын компоненттер
│   ├── pages/          # Бет компоненттері
│   ├── store/          # State management
│   ├── api/            # API клиенті
│   └── App.jsx         # Негізгі қосымша
```

**Негізгі функциялар:**
- Пайдаланушы интерфейсі
- Тауарларды көрсету
- Себет басқару
- Авторизация
- Тапсырыс беру

### 2. Backend (FastAPI)

**Технологиялар:**
- FastAPI (Web framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- JWT (Authentication)
- Prometheus Client (Metrics)

**Құрылымы:**
```
backend/
├── main.py           # Негізгі қосымша
├── models.py         # Database моделдері
├── schemas.py        # Pydantic схемалары
├── auth.py           # Авторизация логикасы
├── database.py       # Database қосылуы
└── requirements.txt  # Python тәуелділіктері
```

**API Endpoints:**
- `POST /api/auth/register` - Тіркелу
- `POST /api/auth/login` - Кіру
- `GET /api/products` - Тауарлар тізімі
- `GET /api/products/{id}` - Тауар деталдары
- `GET /api/categories` - Санаттар
- `POST /api/cart` - Себетке қосу
- `GET /api/cart` - Себетті көру
- `DELETE /api/cart/{id}` - Себеттен өшіру
- `POST /api/orders` - Тапсырыс жасау
- `GET /api/orders` - Тапсырыстар тізімі

### 3. Database (PostgreSQL)

**Кестелер:**

1. **users** - Пайдаланушылар
   - id, username, email, password_hash
   - full_name, phone, address
   - is_active, is_admin

2. **categories** - Санаттар
   - id, name, description

3. **products** - Тауарлар
   - id, category_id, name, description
   - price, stock_quantity, brand
   - specifications (JSONB)

4. **orders** - Тапсырыстар
   - id, user_id, total_amount
   - status, shipping_address
   - payment_method, payment_status

5. **order_items** - Тапсырыс элементтері
   - id, order_id, product_id
   - quantity, price

6. **cart** - Себет
   - id, user_id, product_id, quantity

### 4. Nginx (Reverse Proxy)

**Функциялар:**
- HTTP/HTTPS қолдауы
- Load balancing
- SSL termination
- Static файлдарды беру
- API proxy

### 5. Monitoring (Prometheus + Grafana)

**Prometheus:**
- Backend метрикаларын жинау
- Request count, duration
- System metrics

**Grafana:**
- Визуализация
- Dashboards
- Alerts

## Қауіпсіздік

### Авторизация
- JWT токендер
- Bcrypt пароль хэштеу
- Token expiration

### HTTPS
- SSL/TLS шифрлау
- Сертификаттар

### Database
- Параметрленген сұраулар (SQL injection қорғанысы)
- Пароль хэштеу
- Connection pooling

## Масштабтау

### Horizontal Scaling
- Frontend: Бірнеше контейнерлер
- Backend: Load balancer арқылы
- Database: Read replicas

### Vertical Scaling
- CPU/RAM ресурстарын арттыру
- Database optimization
- Caching (Redis)

## DevOps Pipeline

```
Code → Git → Docker Build → Docker Compose → Deploy
                                    ↓
                              Monitoring
                                    ↓
                              Alerts
```

## Backup стратегиясы

1. **Database Backup**
   - Күнделікті автоматты backup
   - 7 күнгі retention
   - Compressed SQL dumps

2. **Volume Backup**
   - Docker volumes
   - Configuration files

## Мониторинг метрикалары

- Request rate (req/s)
- Response time (ms)
- Error rate (%)
- CPU usage (%)
- Memory usage (MB)
- Database connections
- Active users

## Болашақ жақсартулар

1. **Caching** - Redis қосу
2. **CDN** - Static файлдар үшін
3. **Message Queue** - RabbitMQ/Kafka
4. **Microservices** - Сервистерді бөлу
5. **CI/CD** - GitHub Actions
6. **Testing** - Unit, Integration тесттер
7. **API Gateway** - Kong/Traefik
8. **Service Mesh** - Istio
