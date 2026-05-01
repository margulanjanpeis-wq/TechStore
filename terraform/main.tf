terraform {
  required_version = ">= 1.5"

  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }

  # Uncomment for remote state (production)
  # backend "s3" {
  #   bucket = "techstore-terraform-state"
  #   key    = "techstore/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "docker" {
  # Windows Docker Desktop
  host = "npipe:////./pipe/docker_engine"
}

locals {
  project     = "techstore"
  environment = var.environment
  common_labels = {
    project     = local.project
    environment = local.environment
    managed_by  = "terraform"
  }
}

# ── Network ───────────────────────────────────────────────────────────────────

resource "docker_network" "main" {
  name   = "${local.project}-network"
  driver = "bridge"

  labels {
    label = "project"
    value = local.project
  }
}

# ── Volumes ───────────────────────────────────────────────────────────────────

resource "docker_volume" "postgres" {
  name = "${local.project}-postgres-data"
}

resource "docker_volume" "prometheus" {
  name = "${local.project}-prometheus-data"
}

resource "docker_volume" "grafana" {
  name = "${local.project}-grafana-data"
}

# ── PostgreSQL ────────────────────────────────────────────────────────────────

resource "docker_image" "postgres" {
  name         = "postgres:15-alpine"
  keep_locally = true
}

resource "docker_container" "database" {
  name  = "${local.project}-db"
  image = docker_image.postgres.image_id

  restart = "unless-stopped"

  env = [
    "POSTGRES_DB=${local.project}",
    "POSTGRES_USER=${local.project}_user",
    "POSTGRES_PASSWORD=${var.postgres_password}",
  ]

  ports {
    internal = 5432
    external = 5432
  }

  volumes {
    volume_name    = docker_volume.postgres.name
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name = docker_network.main.name
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U ${local.project}_user -d ${local.project}"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }

  labels {
    label = "project"
    value = local.project
  }
}

# ── Prometheus ────────────────────────────────────────────────────────────────

resource "docker_image" "prometheus" {
  name         = "prom/prometheus:latest"
  keep_locally = true
}

resource "docker_container" "prometheus" {
  name  = "${local.project}-prometheus"
  image = docker_image.prometheus.image_id

  restart = "unless-stopped"

  command = [
    "--config.file=/etc/prometheus/prometheus.yml",
    "--storage.tsdb.path=/prometheus",
    "--storage.tsdb.retention.time=15d",
    "--web.enable-lifecycle",
  ]

  ports {
    internal = 9090
    external = 9090
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/prometheus/prometheus.yml")
    container_path = "/etc/prometheus/prometheus.yml"
    read_only      = true
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/prometheus/rules")
    container_path = "/etc/prometheus/rules"
    read_only      = true
  }

  volumes {
    volume_name    = docker_volume.prometheus.name
    container_path = "/prometheus"
  }

  networks_advanced {
    name = docker_network.main.name
  }

  labels {
    label = "project"
    value = local.project
  }
}

# ── Grafana ───────────────────────────────────────────────────────────────────

resource "docker_image" "grafana" {
  name         = "grafana/grafana:latest"
  keep_locally = true
}

resource "docker_container" "grafana" {
  name  = "${local.project}-grafana"
  image = docker_image.grafana.image_id

  restart = "unless-stopped"

  env = [
    "GF_SECURITY_ADMIN_USER=admin",
    "GF_SECURITY_ADMIN_PASSWORD=${var.grafana_password}",
    "GF_USERS_ALLOW_SIGN_UP=false",
    "GF_SERVER_ROOT_URL=https://localhost/grafana",
  ]

  ports {
    internal = 3000
    external = 3000
  }

  volumes {
    volume_name    = docker_volume.grafana.name
    container_path = "/var/lib/grafana"
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/grafana/datasources")
    container_path = "/etc/grafana/provisioning/datasources"
    read_only      = true
  }

  volumes {
    host_path      = abspath("${path.module}/../monitoring/grafana/dashboards")
    container_path = "/etc/grafana/provisioning/dashboards"
    read_only      = true
  }

  networks_advanced {
    name = docker_network.main.name
  }

  depends_on = [docker_container.prometheus]

  labels {
    label = "project"
    value = local.project
  }
}
