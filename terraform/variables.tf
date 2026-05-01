variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "development"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "postgres_password" {
  description = "PostgreSQL password"
  type        = string
  sensitive   = true
  default     = "techstore_pass_2024"
}

variable "secret_key" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
  default     = "change-me-in-production"
}

variable "grafana_password" {
  description = "Grafana admin password"
  type        = string
  sensitive   = true
  default     = "admin123"
}

variable "telegram_bot_token" {
  description = "Telegram bot token for alerts"
  type        = string
  sensitive   = true
  default     = ""
}

variable "telegram_chat_id" {
  description = "Telegram chat ID for alerts"
  type        = string
  default     = ""
}

variable "openai_api_key" {
  description = "OpenAI API key for chatbot"
  type        = string
  sensitive   = true
  default     = ""
}
