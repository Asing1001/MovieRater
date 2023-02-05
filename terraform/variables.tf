variable "project_id" {
  type        = string
  description = "The GCP project id"
}

variable "region" { default = "asia-east1" }

variable "db_url" {
  default = "mongodb://localhost:27018/movierater"
}

variable "enable_graphiql" {
  default = false
}

variable "enable_scheduler" {
  default = true
}

variable "node_env" {
  default = true
}

variable "website_url" {
  default = ""
}

variable "keep_alive" {
  default = false
  description = "whether to keep request the website_url to make it awake"
}

variable "upstash_email" {
}

variable "upstash_apikey" {
}