terraform { source = "../../../modules//s3_static_website" }
include "root" { path = find_in_parent_folders() }
inputs = {
  project = "atek"
  env     = "staging"
  domain_name = "app.staging.example.com"
  acm_cert_arn = "arn:aws:acm:us-east-1:123456789012:certificate/example"
  enable_waf = true
  tags = { System = "frontend", Env = "staging" }
}
