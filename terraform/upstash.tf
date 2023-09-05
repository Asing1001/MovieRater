terraform {
  required_providers {
    upstash = {
      source = "upstash/upstash"
    }
  }
}

provider "upstash" {
  email   = var.upstash_email
  api_key = var.upstash_apikey
}

resource "upstash_redis_database" "main" {
  database_name = "movierater_redis"
  region        = "ap-northeast-1"
  lifecycle {
    prevent_destroy = true
  }
}
