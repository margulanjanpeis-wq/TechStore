# TechStore Terraform Configuration

Бұл Terraform конфигурациясы TechStore жобасының инфрақұрылымын автоматты түрде орнатады.

## Талаптар

- Terraform >= 1.0
- Docker Desktop (Windows)

## Орнату

```bash
# Terraform инициализациялау
terraform init

# Жоспарды көру
terraform plan

# Қолдану
terraform apply

# Жою
terraform destroy
```

## Құрылатын ресурстар

- Docker Network: techstore-network
- PostgreSQL Database контейнері
- Prometheus контейнері
- Grafana контейнері
- Docker volumes деректерді сақтау үшін

## Outputs

- `database_connection`: PostgreSQL қосылу жолы
- `grafana_url`: Grafana веб интерфейсі
- `prometheus_url`: Prometheus веб интерфейсі
