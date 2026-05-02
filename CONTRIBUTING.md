# Жобаға үлес қосу

Бұл жоба — TechStore e-commerce платформасы (DevOps курсы жобасы). Егер жобаны жақсартқыңыз келсе немесе қате тапсаңыз, мына нұсқауларды оқыңыз.

---

## Жобаны өз компьютеріңізге орнату

**Талаптар:** Docker Desktop орнатылған болуы керек.

```bash
# 1. Репозиторийді клондаңыз
git clone https://github.com/margulanjanpeis-wq/TechStore.git
cd TechStore

# 2. .env файлын толтырыңыз
# TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, OPENAI_API_KEY (міндетті емес)

# 3. Docker арқылы іске қосыңыз
docker compose up -d

# 4. Seed деректерді қосыңыз (80 өнім)
docker cp database/seed_final.sql techstore-db:/tmp/seed.sql
docker exec techstore-db psql -U techstore_user -d techstore -f /tmp/seed.sql
```

Сервистер іске қосылғаннан кейін:

| Сервис | Мекенжай |
|---|---|
| Сайт | https://localhost |
| API Docs | http://localhost:8000/docs |
| Grafana | http://localhost:3000 |
| Prometheus | http://localhost:9090 |
| Jenkins | http://localhost:8090 |

---

## Жаңа өзгеріс енгізу

```bash
# 1. Жаңа branch жасаңыз
git checkout -b feature/жаңа-функция

# 2. Өзгерістер жасаңыз

# 3. Commit жасаңыз
git add .
git commit -m "feat: жаңа функция қосылды"

# 4. Push жасаңыз
git push origin feature/жаңа-функция

# 5. GitHub-та Pull Request жасаңыз
```

---

## Commit хабарламалары форматы

```
feat:     жаңа функция қосу
fix:      қате түзету
docs:     құжаттама жаңарту
style:    код форматтау
refactor: кодты қайта жазу
test:     тест қосу
ci:       CI/CD өзгерту (Jenkinsfile)
monitor:  мониторинг конфигурациясы
```

---

## Жоба құрылымы

```
TechStore/
├── backend/             — FastAPI (Python, 27 endpoint)
│   ├── main.py          — Негізгі роутер
│   ├── auth.py          — JWT аутентификация
│   ├── chatbot.py       — AI Chatbot (OpenAI + rule-based)
│   └── models.py        — SQLAlchemy модельдері
├── frontend/            — React 18 + Vite
│   └── src/
│       ├── components/  — Header, Footer, Chatbot, CategorySidebar
│       └── pages/       — 10 бет
├── database/            — PostgreSQL init + seed деректер
├── nginx/               — Reverse proxy + SSL конфигурация
├── monitoring/          — Мониторинг стегі
│   ├── prometheus/      — Метрика жинау + alert ережелері
│   ├── alertmanager/    — Алерт маршруттау
│   ├── grafana/         — Дашборд + datasource
│   └── telegram-bot/    — Webhook алерт боты
├── terraform/           — Infrastructure as Code
├── scripts/             — setup.sh, backup.sh, restore.sh
├── tests/               — API тесттері
├── Jenkinsfile          — CI/CD Pipeline
└── docker-compose.yml   — 13 сервис
```

---

## Код стандарттары

**Backend (Python):**
- PEP 8 стандартын сақтаңыз
- Функцияларға type hints жазыңыз
- Маңызды функцияларға docstring қосыңыз
- Пароль хэштеу: SHA256 + salt (`auth.py`)

**Frontend (React):**
- Functional components қолданыңыз
- Zustand store арқылы state басқарыңыз
- CSS модульдерін пайдаланыңыз

**Docker:**
- Жаңа сервис қосқанда `docker-compose.yml`-ге healthcheck қосыңыз
- Барлық сервистер `techstore-network`-та болуы керек

**Мониторинг:**
- Жаңа алерт ережесі: `monitoring/prometheus/rules/alerts.yml`
- Alertmanager webhook: `http://telegram-bot:8080/alert`

---

## Тесттер іске қосу

```bash
# Python тесттері
pip install pytest httpx
pytest tests/ -v

# Chatbot тексеру
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "сәлем", "use_ai": true}'

# Telegram алерт тексеру
curl http://localhost:8080/test
```

---

## Қате тапсаңыз

GitHub Issues бетінде жаңа issue жасаңыз:
- Қатенің қысқаша сипаттамасы
- Қайталау қадамдары
- Скриншот немесе лог

---

## Сұрақтар

GitHub Issues немесе `margulanjanpeis@gmail.com` арқылы жазыңыз.

Жобаға үлес қосқаныңыз үшін рахмет! 🙏
