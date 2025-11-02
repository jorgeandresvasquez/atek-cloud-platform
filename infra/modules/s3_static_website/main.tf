terraform { required_version = ">= 1.6.0" }
variable "project" {}
variable "env" {}
variable "domain_name" {}
resource "aws_s3_bucket" "site" {
  bucket = "${var.project}-${var.env}-web"
}
output "bucket" { value = aws_s3_bucket.site.id }
