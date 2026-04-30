terraform {
  backend "gcs" {
    bucket = "movierater-tf-state"
    prefix = "terraform/state"
  }
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── APIs ──────────────────────────────────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "cloudscheduler.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "storage.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# ── Service account & OIDC for GitHub Actions ─────────────────────────────────
resource "google_service_account" "main" {
  account_id   = "terraform-sa"
  display_name = "MovieRater CI/CD"
}

resource "google_project_iam_member" "sa_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.main.email}"
}

resource "google_project_iam_member" "sa_ar_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.main.email}"
}

resource "google_project_iam_member" "sa_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.main.email}"
}

resource "google_project_iam_member" "sa_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.main.email}"
}

module "gh_oidc" {
  source      = "terraform-google-modules/github-actions-runners/google//modules/gh-oidc"
  project_id  = var.project_id
  pool_id     = "movierater-pool"
  provider_id = "movierater-gh-provider"
  sa_mapping = {
    (google_service_account.main.account_id) = {
      sa_name   = google_service_account.main.name
      attribute = "attribute.repository/Asing1001/movieRater.React"
    }
  }
}

# ── Artifact Registry ─────────────────────────────────────────────────────────
resource "google_artifact_registry_repository" "main" {
  repository_id = "movierater"
  location      = var.region
  format        = "DOCKER"
  depends_on    = [google_project_service.apis]
}

locals {
  movierater_image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.main.repository_id}/movierater"
}

# ── GCS bucket for Terraform state (bootstrap: create manually before tf init) ─
resource "google_storage_bucket" "tf_state" {
  name                        = "movierater-tf-state"
  location                    = var.region
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

# ── Secrets ───────────────────────────────────────────────────────────────────
# Secrets are created by Terraform but values must be set manually:
#   gcloud secrets versions add db-url --data-file=- <<< "mongodb+srv://..."
#   gcloud secrets versions add task-trigger-key --data-file=- <<< "your-key"
#   gcloud secrets versions add omdb-api-key --data-file=- <<< "your-key"

resource "google_secret_manager_secret" "db_url" {
  secret_id = "db-url"
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret" "task_trigger_key" {
  secret_id = "task-trigger-key"
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret" "omdb_api_key" {
  secret_id = "omdb-api-key"
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

# Allow Cloud Run service account to access secrets
resource "google_secret_manager_secret_iam_member" "db_url" {
  secret_id = google_secret_manager_secret.db_url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun.email}"
}

resource "google_secret_manager_secret_iam_member" "task_trigger_key" {
  secret_id = google_secret_manager_secret.task_trigger_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun.email}"
}

resource "google_secret_manager_secret_iam_member" "omdb_api_key" {
  secret_id = google_secret_manager_secret.omdb_api_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun.email}"
}

# ── Cloud Run service account ──────────────────────────────────────────────────
resource "google_service_account" "cloudrun" {
  account_id   = "cloudrun-sa"
  display_name = "MovieRater Cloud Run"
}

# ── Cloud Run service ─────────────────────────────────────────────────────────
resource "google_cloud_run_v2_service" "main" {
  name     = "movierater"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.main,
  ]

  template {
    service_account = google_service_account.cloudrun.email

    scaling {
      min_instance_count = 1
      max_instance_count = 1
    }

    containers {
      image = "${local.movierater_image}:latest"

      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
        startup_cpu_boost = true
      }

      # Non-sensitive env vars
      env { name = "NODE_ENV";        value = "production" }
      env { name = "TZ";              value = "Asia/Taipei" }
      env { name = "WEBSITE_URL";     value = "https://www.mvrater.com" }
      env { name = "ENABLE_SCHEDULER"; value = "true" }
      env { name = "ENABLE_GRAPHIQL"; value = "false" }

      # Redis from Upstash (built at apply time)
      env {
        name  = "REDIS_URL"
        value = "redis://default:${upstash_redis_database.main.password}@${upstash_redis_database.main.endpoint}:${upstash_redis_database.main.port}"
      }
      env {
        name  = "REDISCLOUD_URL"
        value = "redis://default:${upstash_redis_database.main.password}@${upstash_redis_database.main.endpoint}:${upstash_redis_database.main.port}"
      }

      # Sensitive vars from Secret Manager
      env {
        name = "DB_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "TASK_TRIGGER_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.task_trigger_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "OMDB_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.omdb_api_key.secret_id
            version = "latest"
          }
        }
      }
    }
  }
}

# Allow public access
resource "google_cloud_run_service_iam_binding" "public" {
  location = google_cloud_run_v2_service.main.location
  service  = google_cloud_run_v2_service.main.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

# ── Custom domain ─────────────────────────────────────────────────────────────
resource "google_cloud_run_domain_mapping" "www" {
  name     = "www.mvrater.com"
  location = google_cloud_run_v2_service.main.location
  metadata { namespace = var.project_id }
  spec { route_name = google_cloud_run_v2_service.main.name }
}

resource "google_cloud_run_domain_mapping" "apex" {
  name     = "mvrater.com"
  location = google_cloud_run_v2_service.main.location
  metadata { namespace = var.project_id }
  spec { route_name = google_cloud_run_v2_service.main.name }
}
