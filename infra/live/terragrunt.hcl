remote_state {
  backend = "s3"
  config = {
    bucket         = "atek-terraform-state"
    key            = "${path_relative_to_include()}/terraform.tfstate"
    region         = "ca-central-1"
    dynamodb_table = "atek-terraform-locks"
    encrypt        = true
  }
}

generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "aws" { region = "ca-central-1" }
EOF
}

inputs = {
  project = "atek"
  owner   = "platform"
  common_tags = { Project = "atek", ManagedBy = "terragrunt" }
}
