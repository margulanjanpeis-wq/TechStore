# TechStore Testing Guide

## Тестілеу түрлері

### 1. API тестілеу (Postman)

#### Тіркелу тесті

```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpass123",
  "full_name": "Test User"
}
```

#### Кіру тесті

```http
POST http://localhost:8000/api/auth/login
Content-Type: application/x-www-form-urlencoded

username=testuser&password=testpass123
```

#### Тауарларды алу

```http
GET http://localhost:8000/api/products
```

#### Себетке қосу

```http
POST http://localhost:8000/api/cart
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

### 2. Frontend тестілеу

#### Қолмен тестілеу

1. **Басты бет**
   - Санаттар көрсетілуі
   - Танымал тауарлар көрсетілуі
   - Навигация жұмыс істеуі

2. **Тауарлар беті**
   - Тауарлар тізімі
   - Санаттар бойынша фильтрлеу
   - Тауар деталдарына өту

3. **Авторизация**
   - Тіркелу формасы
   - Кіру формасы
   - Қате хабарламалар

4. **Себет**
   - Тауарларды қосу
   - Тауарларды өшіру
   - Жалпы сома есептелуі

5. **Тапсырыс**
   - Тапсырыс жасау
   - Тапсырыстар тізімі
   - Статус көрсетілуі

### 3. Database тестілеу

```sql
-- Пайдаланушыларды тексеру
SELECT * FROM users;

-- Тауарларды тексеру
SELECT p.*, c.name as category_name 
FROM products p 
JOIN categories c ON p.category_id = c.id;

-- Тапсырыстарды тексеру
SELECT o.*, u.username 
FROM orders o 
JOIN users u ON o.user_id = u.id;

-- Себетті тексеру
SELECT c.*, p.name, u.username 
FROM cart c 
JOIN products p ON c.product_id = p.id 
JOIN users u ON c.user_id = u.id;
```

### 4. Жүктеме тесті

#### Apache Bench арқылы

```bash
# 100 сұраныс, 10 параллель
ab -n 100 -c 10 http://localhost:8000/api/products

# Авторизациямен
ab -n 100 -c 10 -H "Authorization: Bearer <token>" http://localhost:8000/api/cart
```

### 5. Қауіпсіздік тесті

#### SQL Injection тесті

```http
GET http://localhost:8000/api/products?id=1' OR '1'='1
```

Күтілетін нәтиже: Қате немесе бос жауап (қорғаныс жұмыс істеуі керек)

#### XSS тесті

```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "<script>alert('XSS')</script>",
  "email": "test@example.com",
  "password": "test123"
}
```

Күтілетін нәтиже: Script орындалмауы керек

### 6. Мониторинг тесті

#### Prometheus метрикаларын тексеру

```bash
curl http://localhost:8000/metrics
```

Күтілетін метрикалар:
- `techstore_requests_total`
- `techstore_request_duration_seconds`

#### Grafana Dashboard

1. http://localhost:3000 ашу
2. Prometheus datasource қосылуын тексеру
3. Метрикалар көрсетілуін тексеру

### 7. Docker тестілеу

```bash
# Барлық контейнерлер іске қосылғанын тексеру
docker-compose ps

# Контейнерлер health status
docker inspect techstore-db | grep Health

# Логтарды тексеру
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### 8. Backup/Restore тесті

```bash
# Backup жасау
.\scripts\backup.sh

# Тестілік деректерді өзгерту
docker exec -it techstore-db psql -U techstore_user -d techstore -c "DELETE FROM products WHERE id > 10;"

# Restore жасау
.\scripts\restore.sh backups/techstore_backup_*.sql.gz

# Деректер қалпына келгенін тексеру
docker exec -it techstore-db psql -U techstore_user -d techstore -c "SELECT COUNT(*) FROM products;"
```

## Автоматты тестілеу

### Backend Unit тесттері (болашақта)

```python
# test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_register_user():
    response = client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@test.com",
        "password": "test123"
    })
    assert response.status_code == 201
```

### Frontend тесттері (болашақта)

```javascript
// App.test.jsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const headerElement = screen.getByText(/TechStore/i);
  expect(headerElement).toBeInTheDocument();
});
```

## Тестілеу чек-листі

- [ ] Барлық API endpoints жұмыс істейді
- [ ] Авторизация дұрыс жұмыс істейді
- [ ] Frontend барлық беттер жүктеледі
- [ ] Тауарларды себетке қосуға болады
- [ ] Тапсырыс беруге болады
- [ ] Database деректері дұрыс сақталады
- [ ] Мониторинг метрикалары жиналады
- [ ] Backup/Restore жұмыс істейді
- [ ] Қауіпсіздік тесттері өтті
- [ ] Жүктеме тесті өтті

## Қате табылса

1. Логтарды тексеріңіз
2. Database деректерін тексеріңіз
3. Network қосылуын тексеріңіз
4. Конфигурация файлдарын тексеріңіз
5. GitHub Issues-ке хабарлаңыз
