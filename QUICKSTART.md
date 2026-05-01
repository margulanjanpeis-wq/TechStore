# TechStore - Жылдам бастау нұсқаулығы

## 5 минутта іске қосу

### 1. Талаптар

- Docker Desktop орнатылған
- Git орнатылған

### 2. Жобаны жүктеу

```bash
git clone <repository-url>
cd TechStore
```

### 3. Іске қосу

```bash
docker-compose up -d
```

### 4. Қосымшаны ашу

Браузерде ашыңыз: **http://localhost**

### 5. Кіру

Әдепкі admin аккаунты:
- **Логин**: admin
- **Пароль**: admin123

## Қосымша мекенжайлар

- 🌐 Frontend: http://localhost
- 🔧 Backend API: http://localhost/api
- 📚 API Docs: http://localhost/docs
- 📊 Grafana: http://localhost:3000 (admin/admin123)
- 📈 Prometheus: http://localhost:9090

## Негізгі командалар

```bash
# Логтарды көру
docker-compose logs -f

# Тоқтату
docker-compose down

# Қайта іске қосу
docker-compose restart

# Backup жасау
.\scripts\backup.sh
```

## Келесі қадамдар

1. ✅ Жобаны іске қостыңыз
2. 📖 README.md оқыңыз
3. 🏗️ ARCHITECTURE.md қараңыз
4. 🚀 DEPLOYMENT.md оқыңыз
5. 🧪 TESTING.md бойынша тестілеңіз

## Көмек керек пе?

- 📋 FAQ.md - Жиі қойылатын сұрақтар
- 🐛 GitHub Issues - Қате хабарлау
- 💬 GitHub Discussions - Талқылау

## Ойдағыдай жұмыс істемесе?

```bash
# Барлығын тазалап қайта бастау
docker-compose down -v
docker-compose up -d --build
```

Сәттілік! 🎉
