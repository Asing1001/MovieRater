variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type    = string
  default = "asia-east1"
}

variable "schedule_task_api_token" {
  type        = string
  description = "Shared secret sent by Cloud Scheduler to protected /api/tasks endpoints."
  sensitive   = true

  validation {
    condition     = length(var.schedule_task_api_token) >= 32
    error_message = "schedule_task_api_token must be at least 32 characters."
  }
}
