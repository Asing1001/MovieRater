output "provider_name" {
  description = "Github actions WORKLOAD_IDENTITY_PROVIDER"
  value       = module.gh_oidc.provider_name
}

output "sa_email" {
  description = "Github actions SERVICE_ACCOUNT, see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-google-cloud-platform"
  value       = google_service_account.main.email
}