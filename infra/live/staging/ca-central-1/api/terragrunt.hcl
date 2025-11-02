terraform { source = "../../../modules//api" }
include "root" { path = find_in_parent_folders() }
inputs = {
  project = "atek"
  env     = "staging"
  lambda_runtime = "nodejs20.x"
  lambda_zip_s3  = "s3://atek-artifacts-staging/api/app-<gitsha>.zip"
  tags = { System = "api", Env = "staging" }
}
