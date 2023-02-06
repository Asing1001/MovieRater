variable "project_id" {
  type        = string
  description = "The GCP project id"
}

variable "region" {
  default = "asia-east1"
}

variable "db_url" {
  default     = "mongodb://localhost:27018/movierater"
  description = "mongodb url"
}

variable "enable_graphiql" {
  default = false
}

variable "enable_scheduler" {
  default     = true
  description = "whether to schedule the background tasks, see movieRater.React/src/backgroundService/scheduler.ts"
}

variable "node_env" {
  default = true
}

variable "keep_alive" {
  default     = false
  description = "whether to keep request the website_url to make it awake"
}

variable "website_url" {
  default     = ""
  description = "if you set to true, the application will request website_url in every 15 seconds to keep it awake."
}

variable "upstash_email" {
  description = "upstash redis module required param"
}

variable "upstash_apikey" {
  description = "upstash redis module required param"
}
