output "frontend_url" {
  description = "Frontend URL"
  value       = "https://localhost"
}

output "api_url" {
  description = "Backend API URL"
  value       = "https://localhost/api"
}

output "api_docs_url" {
  description = "API documentation URL"
  value       = "https://localhost/docs"
}

output "grafana_url" {
  description = "Grafana dashboard URL"
  value       = "http://localhost:3000"
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://localhost:9090"
}

output "database_host" {
  description = "Database host"
  value       = "localhost:5432"
}

output "network_name" {
  description = "Docker network name"
  value       = docker_network.main.name
}
