.PHONY: help build up down restart logs clean backup restore test

help:
	@echo "TechStore Makefile Commands:"
	@echo "  make build    - Docker контейнерлерін құру"
	@echo "  make up       - Қосымшаны іске қосу"
	@echo "  make down     - Қосымшаны тоқтату"
	@echo "  make restart  - Қосымшаны қайта іске қосу"
	@echo "  make logs     - Логтарды көру"
	@echo "  make clean    - Барлық контейнерлер мен volumes өшіру"
	@echo "  make backup   - Database backup жасау"
	@echo "  make restore  - Database restore жасау"
	@echo "  make test     - Тесттерді іске қосу"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo "Қосымша іске қосылды!"
	@echo "Frontend: http://localhost"
	@echo "Backend: http://localhost/api"
	@echo "Grafana: http://localhost:3000"

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	@echo "Барлық контейнерлер мен volumes өшірілді"

backup:
	bash scripts/backup.sh

restore:
	@read -p "Backup файлын енгізіңіз: " file; \
	bash scripts/restore.sh $$file

test:
	@echo "API тестілеу..."
	curl -f http://localhost:8000/health || exit 1
	@echo "Frontend тестілеу..."
	curl -f http://localhost:5173 || exit 1
	@echo "Барлық тесттер өтті!"

install:
	@echo "Backend тәуелділіктерін орнату..."
	cd backend && pip install -r requirements.txt
	@echo "Frontend тәуелділіктерін орнату..."
	cd frontend && npm install
	@echo "Орнату аяқталды!"

dev-backend:
	cd backend && uvicorn main:app --reload

dev-frontend:
	cd frontend && npm run dev
