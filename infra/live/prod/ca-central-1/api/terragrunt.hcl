terraform { source = "../../../modules//api" }
include "root" { path = find_in_parent_folders() }
inputs = {
  project = "atek"
  env     = "prod"
  lambda_runtime = "nodejs20.x"
  lambda_zip_s3  = "s3://atek-artifacts-prod/api/app-<gitsha>.zip"
  tags = { System = "api", Env = "prod" }
}
