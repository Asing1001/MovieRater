output "workload_identity_provider" {
  description = "Set as WORKLOAD_IDENTITY_PROVIDER in GitHub Actions secrets"
  value       = google_iam_workload_identity_pool_provider.github.name
}

output "service_account" {
  description = "Set as SERVICE_ACCOUNT in GitHub Actions secrets"
  value       = google_service_account.main.email
}

output "cloud_run_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.main.uri
}

output "image_repo" {
  description = "Artifact Registry image path"
  value       = local.movierater_image
}

output "www_dns_records" {
  description = "Add these CNAME/A records at your domain registrar"
  value       = google_cloud_run_domain_mapping.www.status[*].resource_records
}
