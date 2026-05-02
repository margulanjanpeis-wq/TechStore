# TechStore — Компьютер бөлшектерін онлайн сату жүйесі

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=flat&logo=grafana&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=flat&logo=terraform&logoColor=white)

Бұл жоба — DevOps курсы бойынша жасалған e-commerce сайт. Негізгі идея қарапайым: адамдар компьютер бөлшектерін онлайн сатып ала алсын деп жасадым. Видеокарталар, ноутбуктар, мониторлар, пернетақталар, тышқандар, PlayStation және ойын орындықтары — барлығы бір жерде.

Жобаны жасау барысында тек сайт жазумен шектелмедім. Серверді орнату, қауіпсіздікті қамтамасыз ету, мониторинг жүйесін қосу, автоматты backup жасау — осылардың бәрін өзім іске асырдым.

---

## Жүйе архитектурасы

```
                        ┌─────────────────────────────────────────────┐
                        │              ПАЙДАЛАНУШЫ (Browser)           │
                        └──────────────────┬──────────────────────────┘
                                           │ HTTPS :443 / HTTP :80
                        ┌──────────────────▼──────────────────────────┐
                        │           NGINX (Reverse Proxy)              │
                        │     SSL/TLS · Rate Limiting · CORS           │
                        └──────┬───────────────────────┬──────────────┘
                               │                       │
               ┌───────────────▼──────┐   ┌────────────▼─────────────┐
               │  FRONTEND :5173      │   │  BACKEND :8000            │
               │  React 18 + Vite     │   │  FastAPI + SQLAlchemy     │
               │  Zustand · Axios     │   │  JWT Auth · 27 endpoints  │
               └──────────────────────┘   └────────────┬─────────────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │  DATABASE :5432            │
                                          │  PostgreSQL 15             │
                                          │  6 кесте · 80+ өнім       │
                                          └───────────────────────────┘

┌─────────────────────────────── МОНИТОРИНГ СТЕГІ ──────────────────────────────┐
│                                                                                │
│  Backend ──metrics──► Prometheus :9090 ──► Grafana :3000 (дашборд)           │
│  Server  ──metrics──► Node Exporter                                           │
│                            │                                                  │
│                       Alertmanager ──► Telegram Bot ──► Telegram чат         │
│                                                                                │
└────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────── ИНФРАҚҰРЫЛЫМ (IaC) ────────────────────────────────┐
│  Terraform (Docker provider) · setup.sh · backup.sh · restore.sh              │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## Не жасалды

### Модуль 1 — Операциялық жүйе
Docker контейнерлері Alpine Linux негізінде жұмыс істейді. Барлық сервистер оқшауланған ортада іске қосылады.

### Модуль 2 — Қауіпсіздік және желі
- Nginx reverse proxy арқылы барлық сұраныстар өтеді
- SSL сертификаты орнатылды, сайт HTTPS арқылы жұмыс істейді
- HTTP сұраныстар автоматты HTTPS-ке бағытталады
- Rate limiting қосылды — бір IP-дан тым көп сұраныс жіберсе блокталады
- JWT токен + Refresh Token жүйесі: кіргенде 15 минуттық access token және 7 күндік refresh token беріледі
- Пайдаланушыны блоктау мүмкіндігі бар
- Автоматты backup скрипті жазылды — деректер базасы күн сайын сақталады

### Модуль 3 — Деректер базасы
PostgreSQL 15 орнатылды. 6 кесте бар: пайдаланушылар, категориялар, өнімдер, себет, тапсырыстар, тапсырыс элементтері. Seed деректер ретінде 80 өнім, 8 категория қосылды.

### Модуль 4 — Қосымша
**Backend:** FastAPI (Python) — 27 endpoint жазылды. Тіркелу, кіру, өнімдер, себет, тапсырыс беру, admin панелі — бәрі бар.

**Frontend:** React + Vite — 10 бет жасалды:
- Басты бет
- Тауарлар каталогы (іздеу + санат бойынша сүзгі)
- Тауар деталдары
- Себет
- Checkout (банк картасы формасы + чек)
- Тапсырыстарым
- Профайл
- Кіру / Тіркелу
- Admin панелі

**Admin панелі** бөлек жасалды — Dashboard (статистика, графиктер), тапсырыстарды басқару, өнімдер CRUD, пайдаланушыларды блоктау.

Тапсырыс берілгенде өнімнің қалдығы автоматты азаяды. Егер тапсырыс бас тартылса — қалдық қайтарылады.

### Модуль 5 — Контейнерлеу
Docker Compose файлында 13 сервис бар:

| Сервис | Не үшін | Порт |
|---|---|---|
| frontend | React қосымшасы | 5173 |
| backend | FastAPI сервері | 8000 |
| database | PostgreSQL | 5432 |
| nginx | Reverse proxy + SSL | 80, 443 |
| prometheus | Метрика жинау | 9090 |
| grafana | Графиктер | 3000 |
| alertmanager | Ескертулерді маршруттау | 9093 |
| telegram-bot | Telegram хабарламалары | 8080 |
| node-exporter | Сервер ресурстары | 9100 |
| nginx-exporter | Nginx метрикалары | 9113 |
| postgres-exporter | PostgreSQL метрикалары | 9187 |
| jenkins | CI/CD Pipeline | 8090 |
| ssl-generator | SSL сертификат жасау | — |

### Модуль 6 — Нұсқаларды басқару
Git репозиторийі инициализацияланды. Код GitHub-та жарияланды:
[github.com/margulanjanpeis-wq/TechStore](https://github.com/margulanjanpeis-wq/TechStore)

### Модуль 7 — Мониторинг
Prometheus метрикаларды жинайды, Grafana-да графиктер көрінеді. Alertmanager ескертулерді Telegram Bot арқылы жібереді. Node Exporter сервердің CPU, RAM, диск ресурстарын бақылайды.

### Модуль 8 — AI интеграция
OpenAI GPT-3.5 API арқылы чатбот қосылды. API кілті болмаса — rule-based жауаптар береді. Чатбот қазақша, орысша және ағылшынша сұрақтарға жауап береді.

### Модуль 9 — Автоматтандыру (IaC)
Terraform арқылы Docker ресурстары (network, volumes, containers) код ретінде сипатталды. Bash скрипттері жазылды: `setup.sh`, `backup.sh`, `restore.sh`.

---

## Жобаны іске қосу

**Талаптар:** Docker Desktop орнатылған болуы керек.

```bash
# 1. Репозиторийді клондау
git clone https://github.com/margulanjanpeis-wq/TechStore.git
cd TechStore

# 2. Контейнерлерді іске қосу
docker-compose up -d

# 3. Seed деректерді қосу (80 өнім)
docker cp database/seed_final.sql techstore-db:/tmp/seed.sql
docker exec techstore-db psql -U techstore_user -d techstore -f /tmp/seed.sql
```

Іске қосылғаннан кейін браузерде ашыңыз: **https://localhost**

SSL сертификаты self-signed болғандықтан браузер ескерту шығарады — "Advanced → Proceed" басыңыз.

### Контейнерлер жағдайын тексеру

```bash
# Барлық сервистер іске қосылды ма?
docker-compose ps

# Backend логтарын көру
docker-compose logs backend

# Деректер базасына қосылу
docker exec -it techstore-db psql -U techstore_user -d techstore
```

---

## Тесттер

`tests/` папкасында API тесттері бар.

```bash
# Тәуелділіктерді орнату
pip install pytest httpx

# Барлық тесттерді іске қосу
pytest tests/ -v

# Нақты файлды тестілеу
pytest tests/test_auth.py -v
pytest tests/test_products.py -v
```

---

## Кіру деректері

| Не | Мекенжай | Логин / Пароль |
|---|---|---|
| Сайт | https://localhost | — |
| Admin панелі | https://localhost/admin | admin / admin123 |
| API Docs | https://localhost/docs | — |
| Grafana | http://localhost:3000 | admin / admin123 |
| Prometheus | http://localhost:9090 | — |

---

## Жоба құрылымы

```
TechStore/
├── frontend/            — React + Vite (10 бет)
│   └── src/
│       ├── components/  — Header, Footer, CategorySidebar
│       └── pages/       — Home, Products, Cart, Orders, Admin...
├── backend/             — FastAPI (27 endpoint)
│   ├── main.py          — Негізгі роутер
│   ├── auth.py          — JWT аутентификация
│   ├── chatbot.py       — AI Chatbot (OpenAI + rule-based)
│   ├── models.py        — SQLAlchemy модельдері
│   └── database.py      — DB байланысы
├── database/            — PostgreSQL init + seed деректер
├── nginx/               — Reverse proxy + SSL конфигурация
├── monitoring/          — Prometheus, Grafana, Alertmanager, Telegram Bot
├── terraform/           — Infrastructure as Code
├── scripts/             — setup.sh, backup.sh, restore.sh
├── tests/               — API тесттері
└── docker-compose.yml
```

---

## Техникалық стек

| Қабат | Технология |
|---|---|
| Frontend | React 18, Vite, Zustand, Axios |
| Backend | Python 3.11, FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 15 |
| Auth | JWT (access 15 мин) + Refresh Token (7 күн) |
| Proxy | Nginx (SSL, rate limiting, security headers) |
| Containers | Docker, Docker Compose |
| Monitoring | Prometheus, Grafana, Alertmanager, Node Exporter |
| Alerts | Telegram Bot |
| AI | OpenAI GPT-3.5 + rule-based fallback |
| IaC | Terraform (Docker provider) |
| Version Control | Git, GitHub |

---

## Автор

**Мархулан Жанпейс**
GitHub: [@margulanjanpeis-wq](https://github.com/margulanjanpeis-wq)

DevOps курсы жобасы — 2026

---

## Құжаттама

| Файл | Мазмұны |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Жобаға үлес қосу нұсқаулығы |
| [SECURITY.md](SECURITY.md) | Қауіпсіздік саясаты және алерт ережелері |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Толық деплой нұсқаулығы |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Жүйе архитектурасының сипаттамасы |
| [CHANGELOG.md](CHANGELOG.md) | Өзгерістер тарихы |
| [LICENSE](LICENSE) | MIT лицензиясы |
