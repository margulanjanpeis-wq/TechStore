# TechStore – Компьютер бөлшектерін онлайн сату жүйесі

## 📋 Жобаның сипаттамасы

TechStore – заманауи DevOps тәжірибелерін қолдана отырып құрылған, компьютер бөлшектерін (ноутбук, процессор, монитор, аксессуарлар) сататын толық функционалды e-commerce платформасы.

## 🏗️ Архитектура

- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Reverse Proxy**: Nginx
- **Containerization**: Docker + Docker Compose
- **Monitoring**: Prometheus + Grafana
- **IaC**: Terraform
- **Version Control**: Git

## 📁 Жобаның құрылымы

```
TechStore/
├── frontend/          # React қосымшасы
├── backend/           # FastAPI сервері
├── database/          # PostgreSQL конфигурациялары
├── nginx/             # Nginx конфигурациялары
├── monitoring/        # Prometheus + Grafana
├── terraform/         # Infrastructure as Code
├── scripts/           # Автоматтандыру скрипттері
└── docker-compose.yml # Docker оркестрациясы
```

## 🚀 Жобаны іске қосу

```bash
# Репозиторийді клондау
git clone <repository-url>
cd TechStore

# Docker контейнерлерін іске қосу
docker-compose up -d

# Қосымша http://localhost порты арқылы қолжетімді
```

## 🔧 Әзірлеу

```bash
# Frontend әзірлеу
cd frontend
npm install
npm run dev

# Backend әзірлеу
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📊 Мониторинг

- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090

## 🔐 Қауіпсіздік

- HTTPS SSL сертификаттары
- JWT авторизациясы
- Firewall конфигурациясы
- Автоматты backup жүйесі

## 📝 Лицензия

MIT License

## 👥 Авторлар

DevOps жобасы
