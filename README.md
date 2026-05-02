# TechStore — Компьютер бөлшектерін онлайн сату жүйесі

Бұл жоба — DevOps курсы бойынша жасалған e-commerce сайт. Негізгі идея қарапайым: адамдар компьютер бөлшектерін онлайн сатып ала алсын деп жасадым. Видеокарталар, ноутбуктар, мониторлар, пернетақталар, тышқандар, PlayStation және ойын орындықтары — барлығы бір жерде.

Жобаны жасау барысында тек сайт жазумен шектелмедім. Серверді орнату, қауіпсіздікті қамтамасыз ету, мониторинг жүйесін қосу, автоматты backup жасау — осылардың бәрін өзім іске асырдым.

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
Docker Compose файлында 10 сервис бар:

| Сервис | Не үшін |
|---|---|
| frontend | React қосымшасы |
| backend | FastAPI сервері |
| database | PostgreSQL |
| nginx | Reverse proxy + SSL |
| prometheus | Метрика жинау |
| grafana | Графиктер |
| alertmanager | Ескертулерді маршруттау |
| telegram-bot | Telegram хабарламалары |
| node-exporter | Сервер ресурстары |
| ssl-generator | SSL сертификат жасау |

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
├── frontend/        — React + Vite (10 бет)
├── backend/         — FastAPI (27 endpoint)
├── database/        — PostgreSQL + seed деректер
├── nginx/           — Reverse proxy + SSL
├── monitoring/      — Prometheus, Grafana, Alertmanager, Telegram Bot
├── terraform/       — Infrastructure as Code
├── scripts/         — setup.sh, backup.sh, restore.sh
├── tests/           — API тесттері
└── docker-compose.yml
```

---

## Техникалық стек

- **Frontend:** React 18, Vite, Zustand, Axios
- **Backend:** Python, FastAPI, SQLAlchemy, JWT
- **Database:** PostgreSQL 15
- **Proxy:** Nginx (SSL, rate limiting, security headers)
- **Containers:** Docker, Docker Compose
- **Monitoring:** Prometheus, Grafana, Alertmanager
- **Alerts:** Telegram Bot (FastAPI webhook)
- **AI:** OpenAI GPT-3.5 + rule-based fallback
- **IaC:** Terraform (Docker provider)
- **Version Control:** Git, GitHub

---

## Автор

**Мархулан Жанпейс**
GitHub: [@margulanjanpeis-wq](https://github.com/margulanjanpeis-wq)

DevOps курсы жобасы — 2026
