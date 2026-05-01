# Жиі қойылатын сұрақтар (FAQ)

## Жалпы сұрақтар

### TechStore дегеніміз не?

TechStore – компьютер бөлшектерін онлайн сататын e-commerce платформасы. Жоба DevOps тәжірибелерін қолдана отырып, заманауи технологиялармен құрылған.

### Қандай технологиялар қолданылған?

- **Frontend**: React, Vite, Zustand
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus, Grafana
- **IaC**: Terraform

### Жобаны қалай іске қосуға болады?

```bash
git clone <repository-url>
cd TechStore
docker-compose up -d
```

Толық нұсқау үшін DEPLOYMENT.md қараңыз.

## Орнату сұрақтары

### Docker Desktop орнатылмаған болса?

Docker Desktop-ты [ресми сайттан](https://www.docker.com/products/docker-desktop) жүктеп орнатыңыз.

### Port 80 бос емес болса?

docker-compose.yml файлында портты өзгертіңіз:

```yaml
nginx:
  ports:
    - "8080:80"  # 80 орнына 8080
```

### Database қосылу қатесі шықса?

1. Database контейнері іске қосылғанын тексеріңіз:
```bash
docker ps | grep techstore-db
```

2. Логтарды қараңыз:
```bash
docker logs techstore-db
```

3. Database қайта іске қосыңыз:
```bash
docker-compose restart database
```

## Пайдалану сұрақтары

### Әдепкі admin аккаунты қандай?

- Логин: `admin`
- Пароль: `admin123`

**Маңызды**: Өндірістік ортада паролді өзгертіңіз!

### Жаңа тауар қалай қосуға болады?

Қазіргі уақытта тауарларды тікелей database арқылы қосуға болады:

```sql
INSERT INTO products (category_id, name, description, price, stock_quantity, brand)
VALUES (1, 'Жаңа тауар', 'Сипаттама', 99999.00, 10, 'Brand');
```

Admin панелі болашақта қосылады.

### Тапсырыс статусын қалай өзгертуге болады?

```sql
UPDATE orders SET status = 'completed' WHERE id = 1;
```

## Техникалық сұрақтар

### Backup қалай жасалады?

```bash
.\scripts\backup.sh
```

Backup файлдары `backups/` қалтасында сақталады.

### Restore қалай жасалады?

```bash
.\scripts\restore.sh backups/techstore_backup_YYYYMMDD_HHMMSS.sql.gz
```

### Логтарды қалай көруге болады?

```bash
# Барлық логтар
docker-compose logs -f

# Белгілі бір сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Контейнерлерді қалай қайта іске қосуға болады?

```bash
# Барлық контейнерлер
docker-compose restart

# Белгілі бір контейнер
docker-compose restart backend
```

### Мониторинг қалай жұмыс істейді?

- **Prometheus**: http://localhost:9090 - метрикаларды жинайды
- **Grafana**: http://localhost:3000 - визуализация жасайды

Grafana-ға кіру: admin/admin123

## Әзірлеу сұрақтары

### Backend-ті қалай әзірлеуге болады?

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend-ті қалай әзірлеуге болады?

```bash
cd frontend
npm install
npm run dev
```

### Жаңа API endpoint қалай қосуға болады?

`backend/main.py` файлына қосыңыз:

```python
@app.get("/api/new-endpoint")
def new_endpoint():
    return {"message": "Hello"}
```

### Жаңа React компонент қалай қосуға болады?

`frontend/src/components/` қалтасында жаңа файл жасаңыз:

```javascript
function NewComponent() {
  return <div>New Component</div>;
}

export default NewComponent;
```

## Қауіпсіздік сұрақтары

### HTTPS қалай орнатуға болады?

1. SSL сертификаттарын алыңыз
2. `nginx/ssl/` қалтасына орналастырыңыз
3. `nginx/nginx.conf` файлында HTTPS бөлімін іске қосыңыз

### Паролдарды қалай өзгертуге болады?

Backend `.env` файлында:
```
SECRET_KEY=жаңа-құпия-кілт
```

Database паролі:
```
POSTGRES_PASSWORD=жаңа-пароль
```

### JWT токен мерзімін қалай өзгертуге болады?

`.env` файлында:
```
ACCESS_TOKEN_EXPIRE_MINUTES=60  # 1 сағат
```

## Өнімділік сұрақтары

### Жүктеме артса не істеу керек?

1. **Horizontal scaling**: Контейнерлер санын арттыру
2. **Vertical scaling**: CPU/RAM ресурстарын арттыру
3. **Caching**: Redis қосу
4. **Database optimization**: Индекстер қосу

### Database баяу жұмыс істесе?

1. Индекстерді тексеріңіз
2. Сұрауларды оптимизациялаңыз
3. Connection pool параметрлерін реттеңіз
4. Database статистикасын талдаңыз

## Қате шешу

### "Port already in use" қатесі

Портты өзгертіңіз немесе басқа процессті тоқтатыңыз:

```bash
# Windows
netstat -ano | findstr :80
taskkill /PID <process_id> /F
```

### "Cannot connect to Docker daemon" қатесі

Docker Desktop іске қосылғанын тексеріңіз.

### Frontend жүктелмейді

1. Контейнер іске қосылғанын тексеріңіз
2. Логтарды қараңыз
3. Node modules қайта орнатыңыз:
```bash
docker-compose exec frontend npm install
```

## Қосымша көмек

### Құжаттама қайда?

- README.md - Жалпы ақпарат
- ARCHITECTURE.md - Архитектура
- DEPLOYMENT.md - Орналастыру
- TESTING.md - Тестілеу
- CONTRIBUTING.md - Үлес қосу

### Қате тапсам не істеу керек?

GitHub Issues-те жаңа issue жасаңыз немесе CONTRIBUTING.md қараңыз.

### Жаңа функция ұсынғым келсе?

GitHub Discussions-те талқылаңыз немесе feature request жасаңыз.
