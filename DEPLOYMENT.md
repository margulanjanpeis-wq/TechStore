# TechStore Deployment Guide

## Жүйе талаптары

- Windows 11
- Docker Desktop
- Git
- Node.js 20+
- Python 3.11+

## Орнату қадамдары

### 1. Репозиторийді клондау

```bash
git clone <repository-url>
cd TechStore
```

### 2. Docker Desktop іске қосу

Docker Desktop қосымшасын іске қосыңыз және ол толық жүктелгенін тексеріңіз.

### 3. Автоматты орнату (ұсынылады)

```bash
# Windows PowerShell
.\scripts\setup.sh
```

### 4. Қолмен орнату

#### Backend орнату

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

#### Frontend орнату

```bash
cd frontend
npm install
```

#### Docker контейнерлерін іске қосу

```bash
docker-compose up -d --build
```

## Қосымшаны тексеру

Барлық сервистер іске қосылғаннан кейін:

- Frontend: http://localhost
- Backend API: http://localhost/api
- API Documentation: http://localhost/docs
- Grafana: http://localhost:3000 (admin/admin123)
- Prometheus: http://localhost:9090

## Тестілік деректер

Әдепкі әкімші аккаунты:
- Логин: `admin`
- Пароль: `admin123`

## Backup және Restore

### Backup жасау

```bash
.\scripts\backup.sh
```

Backup файлдары `backups/` қалтасында сақталады.

### Restore жасау

```bash
.\scripts\restore.sh backups/techstore_backup_YYYYMMDD_HHMMSS.sql.gz
```

## Мониторинг

### Grafana Dashboard

1. http://localhost:3000 ашыңыз
2. admin/admin123 арқылы кіріңіз
3. Dashboards бөліміне өтіңіз

### Prometheus Metrics

http://localhost:9090 арқылы метрикаларды көре аласыз.

## Қауіпсіздік

### SSL сертификаттарын орнату

```bash
# Self-signed сертификат жасау (тестілеу үшін)
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

Nginx конфигурациясында HTTPS бөлімін іске қосыңыз.

### Firewall конфигурациясы

Windows Defender Firewall арқылы қажетті порттарды ашыңыз:
- 80 (HTTP)
- 443 (HTTPS)
- 3000 (Grafana)
- 9090 (Prometheus)

## Troubleshooting

### Контейнерлер іске қосылмаса

```bash
# Логтарды көру
docker-compose logs -f

# Контейнерлерді қайта іске қосу
docker-compose restart

# Барлығын тазалап қайта бастау
docker-compose down -v
docker-compose up -d --build
```

### Database қосылу қатесі

```bash
# Database контейнерін тексеру
docker exec -it techstore-db psql -U techstore_user -d techstore

# Database логтарын көру
docker logs techstore-db
```

### Frontend қосылмаса

```bash
# Frontend контейнерін қайта іске қосу
docker-compose restart frontend

# Node modules қайта орнату
docker-compose exec frontend npm install
```

## Өндірістік орналастыру

Өндірістік ортаға орналастыру үшін:

1. `.env` файлдарындағы құпия кілттерді өзгертіңіз
2. SSL сертификаттарын орнатыңыз
3. Database паролін өзгертіңіз
4. CORS параметрлерін өндірістік доменге бейімдеңіз
5. Автоматты backup жүйесін орнатыңыз
6. Мониторинг alert жүйесін конфигурациялаңыз

## Қосымша ақпарат

Қосымша сұрақтар үшін README.md файлын қараңыз.
