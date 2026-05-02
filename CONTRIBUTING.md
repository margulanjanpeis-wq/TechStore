# Жобаға үлес қосу

Бұл жоба — TechStore e-commerce платформасы. Егер жобаны жақсартқыңыз келсе немесе қате тапсаңыз, мына нұсқауларды оқыңыз.

---

## Жобаны өз компьютеріңізге орнату

```bash
# 1. Репозиторийді клондаңыз
git clone https://github.com/margulanjanpeis-wq/TechStore.git
cd TechStore

# 2. Docker арқылы іске қосыңыз
docker-compose up -d
```

Немесе жергілікті орнату:

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (жаңа терминалда)
cd frontend
npm install
npm run dev
```

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
feat: жаңа функция қосу
fix: қате түзету
docs: құжаттама жаңарту
style: код форматтау
refactor: кодты қайта жазу
test: тест қосу
```

---

## Жоба құрылымы

```
TechStore/
├── backend/       — FastAPI (Python)
├── frontend/      — React + Vite
├── database/      — PostgreSQL скрипттері
├── nginx/         — Reverse proxy
├── monitoring/    — Prometheus + Grafana
├── terraform/     — Infrastructure as Code
├── scripts/       — Автоматтандыру скрипттері
└── tests/         — Тесттер
```

---

## Код стандарттары

**Backend (Python):**
- PEP 8 стандартын сақтаңыз
- Функцияларға type hints жазыңыз
- Маңызды функцияларға docstring қосыңыз

**Frontend (React):**
- Functional components қолданыңыз
- Zustand store арқылы state басқарыңыз
- CSS модульдерін пайдаланыңыз

---

## Қате тапсаңыз

GitHub Issues бетінде жаңа issue жасаңыз:
- Қатенің қысқаша сипаттамасы
- Қайталау қадамдары
- Скриншот немесе лог

---

## Сұрақтар

Сұрақтарыңыз болса GitHub Discussions немесе Issues арқылы жазыңыз.

Жобаға үлес қосқаныңыз үшін рахмет! 🙏
