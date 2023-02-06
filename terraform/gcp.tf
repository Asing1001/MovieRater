provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_service_account" "main" {
  account_id = "terraform-sa"
}

resource "google_project_iam_member" "main" {
  project = var.project_id
  role    = "roles/editor"
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

resource "google_cloud_run_service" "main" {
  name     = "movierater"
  location = "asia-east1"

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"  = "1"
        "autoscaling.knative.dev/maxScale"  = "1"
        "run.googleapis.com/cpu-throttling" = false
      }
    }
    spec {
      containers {
        image = "asia-east1-docker.pkg.dev/movierater-1492834745733/movierater/movierater"

        env {
          name  = "DB_URL"
          value = var.db_url
        }

        env {
          name  = "WEBSITE_URL"
          value = var.website_url
        }

        env {
          name  = "ENABLE_GRAPHIQL"
          value = var.enable_graphiql
        }

        env {
          name  = "ENABLE_SCHEDULER"
          value = var.enable_scheduler
        }

        env {
          name  = "NODE_ENV"
          value = var.node_env
        }

        env {
          name  = "KEEP_ALIVE"
          value = var.keep_alive
        }

        env {
          name  = "REDIS_URL"
          value = "redis://default:${upstash_redis_database.main.password}@${upstash_redis_database.main.endpoint}:${upstash_redis_database.main.port}"
        }

        env {
          name  = "REDISCLOUD_URL"
          value = "redis://default:${upstash_redis_database.main.password}@${upstash_redis_database.main.endpoint}:${upstash_redis_database.main.port}"
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_binding" "main" {
  location = google_cloud_run_service.main.location
  service  = google_cloud_run_service.main.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}

resource "google_cloud_run_domain_mapping" "www_mvrater" {
  name     = "www.mvrater.com"
  location = google_cloud_run_service.main.location
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_service.main.name
  }
}

resource "google_cloud_run_domain_mapping" "mvrater" {
  name     = "mvrater.com"
  location = google_cloud_run_service.main.location
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_service.main.name
  }
}
