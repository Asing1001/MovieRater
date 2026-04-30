variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type    = string
  default = "asia-east1"
}

variable "upstash_email" {
  type        = string
  description = "Upstash account email"
}

variable "upstash_apikey" {
  type        = string
  sensitive   = true
  description = "Upstash API key"
}
