terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
    }
  }

  backend "s3" {
    bucket         = "finix-terraform-qa"
    region         = "us-west-2"
    key            = "applications/accept-a-payment/terraform.tfstate"
    encrypt        = true
    use_lockfile   = true
  }
}

module "environment" {
  source    = "git@github.com:finix-payments/finix-terraform.git//aws/modules/constants/environments"
  workspace = terraform.workspace
}

provider "aws" {
  region = "us-east-1" # CloudFront requires ACM certificate to be in us-east-1
  assume_role {
    role_arn = "arn:aws:iam::${module.environment.values.account_id}:role/terraform-admin"
  }
}

locals {
  domain_name   = "finixsamplestore.com"
  environment   = terraform.workspace
}
