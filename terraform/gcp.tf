terraform {
  backend "gcs" {
    bucket = "movierater-react-tf-state"
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

# ── Service account for GitHub Actions CI/CD ──────────────────────────────────
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

# ── Workload Identity Federation for keyless GitHub Actions auth ───────────────
resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "gh-pool"
  display_name              = "GitHub Actions Pool"
  depends_on                = [google_project_service.apis]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "gh-provider"
  display_name                       = "GitHub Actions Provider"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.actor"      = "assertion.actor"
    "attribute.aud"        = "assertion.aud"
  }
  attribute_condition = "assertion.repository == 'Asing1001/MovieRater'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}

resource "google_service_account_iam_member" "github_wif" {
  service_account_id = google_service_account.main.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/Asing1001/MovieRater"
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

# ── GCS bucket for Terraform state (created manually before tf init) ──────────
resource "google_storage_bucket" "tf_state" {
  name                        = "movierater-react-tf-state"
  location                    = var.region
  uniform_bucket_level_access = true
  versioning {
    enabled = true
  }
}

# ── Secrets ───────────────────────────────────────────────────────────────────
resource "google_secret_manager_secret" "db_url" {
  secret_id  = "db-url"
  depends_on = [google_project_service.apis]
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "omdb_api_key" {
  secret_id  = "omdb-api-key"
  depends_on = [google_project_service.apis]
  replication {
    auto {}
  }
}

# ── Cloud Run service account ──────────────────────────────────────────────────
resource "google_service_account" "cloudrun" {
  account_id   = "cloudrun-sa"
  display_name = "MovieRater Cloud Run"
}

resource "google_secret_manager_secret_iam_member" "db_url" {
  secret_id = google_secret_manager_secret.db_url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun.email}"
}

resource "google_secret_manager_secret_iam_member" "omdb_api_key" {
  secret_id = google_secret_manager_secret.omdb_api_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.cloudrun.email}"
}

# ── Cloud Run service ─────────────────────────────────────────────────────────
# Bootstrapped with a public placeholder image; GitHub Actions updates the image
# on every push to master via `gcloud run deploy`.
resource "google_cloud_run_v2_service" "main" {
  name     = "movierater"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.main,
    google_secret_manager_secret.db_url,
    google_secret_manager_secret.omdb_api_key,
  ]

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  template {
    service_account = google_service_account.cloudrun.email

    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }

    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello:latest"

      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
        startup_cpu_boost = true
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "TZ"
        value = "Asia/Taipei"
      }
      env {
        name  = "WEBSITE_URL"
        value = "https://www.mvrater.com"
      }
      env {
        name  = "ENABLE_SCHEDULER"
        value = "false"
      }
      env {
        name  = "ENABLE_GRAPHIQL"
        value = "false"
      }

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
resource "google_cloud_run_v2_service_iam_binding" "public" {
  project  = var.project_id
  location = google_cloud_run_v2_service.main.location
  name     = google_cloud_run_v2_service.main.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

# ── Custom domain ─────────────────────────────────────────────────────────────
resource "google_cloud_run_domain_mapping" "www" {
  name     = "www.mvrater.com"
  location = google_cloud_run_v2_service.main.location
  metadata { namespace = var.project_id }
  spec {
    route_name     = google_cloud_run_v2_service.main.name
    force_override = true
  }
}

resource "google_cloud_run_domain_mapping" "apex" {
  name     = "mvrater.com"
  location = google_cloud_run_v2_service.main.location
  metadata { namespace = var.project_id }
  spec {
    route_name     = google_cloud_run_v2_service.main.name
    force_override = true
  }
}

# ── Cloud Scheduler (3 free jobs/project) ────────────────────────────────────
resource "google_service_account" "scheduler" {
  account_id   = "scheduler-sa"
  display_name = "MovieRater Cloud Scheduler"
}

resource "google_cloud_run_v2_service_iam_member" "scheduler_invoker" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.main.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.scheduler.email}"
}

# Job 1 — LINE movies + theater schedules, hourly
resource "google_cloud_scheduler_job" "line_hourly" {
  name             = "line-hourly"
  description      = "Update LINE movies and theater schedules"
  schedule         = "10 * * * *"
  time_zone        = "Asia/Taipei"
  attempt_deadline = "320s"
  depends_on       = [google_project_service.apis]

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_v2_service.main.uri}/api/tasks/line"
    oidc_token {
      service_account_email = google_service_account.scheduler.email
    }
  }
}

# Job 2 — IMDB ratings backfill, daily
resource "google_cloud_scheduler_job" "imdb_daily" {
  name             = "imdb-daily"
  description      = "Daily IMDB ratings backfill"
  schedule         = "40 6 * * *"
  time_zone        = "Asia/Taipei"
  attempt_deadline = "540s"
  depends_on       = [google_project_service.apis]

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_v2_service.main.uri}/api/tasks/imdb"
    oidc_token {
      service_account_email = google_service_account.scheduler.email
    }
  }
}

# Job 3 — PTT articles crawl, daily
resource "google_cloud_scheduler_job" "ptt_daily" {
  name             = "ptt-daily"
  description      = "Daily PTT movie article crawl"
  schedule         = "0 4 * * *"
  time_zone        = "Asia/Taipei"
  attempt_deadline = "320s"
  depends_on       = [google_project_service.apis]

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_v2_service.main.uri}/api/tasks/ptt"
    oidc_token {
      service_account_email = google_service_account.scheduler.email
    }
  }
}
