#!/bin/bash

# TechStore Setup Script

echo "==================================="
echo "TechStore жобасын орнату"
echo "==================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker орнатылмаған. Docker Desktop орнатыңыз."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose орнатылмаған."
    exit 1
fi

echo "✓ Docker орнатылған"
echo "✓ Docker Compose орнатылған"

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "Backend .env файлын құру..."
    cp backend/.env.example backend/.env
    echo "✓ Backend .env файлы құрылды"
fi

# Build and start containers
echo ""
echo "Docker контейнерлерін құру және іске қосу..."
docker-compose up -d --build

echo ""
echo "==================================="
echo "Орнату аяқталды!"
echo "==================================="
echo ""
echo "Қосымша мына мекенжайларда қолжетімді:"
echo "  Frontend:   http://localhost"
echo "  Backend:    http://localhost/api"
echo "  API Docs:   http://localhost/docs"
echo "  Grafana:    http://localhost:3000 (admin/admin123)"
echo "  Prometheus: http://localhost:9090"
echo ""
echo "Логтарды көру үшін: docker-compose logs -f"
echo "Тоқтату үшін: docker-compose down"
echo ""
