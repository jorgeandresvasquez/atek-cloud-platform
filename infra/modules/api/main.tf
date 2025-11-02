variable "project" {}
variable "env" {}
variable "lambda_runtime" {}
variable "lambda_zip_s3" {}
output "api_id" { value = "${var.project}-${var.env}-api" }
