terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
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
  environment = module.environment.values.name
  domain_name = "finixsamplestore.com"
}

module "domain" {
  source           = "git@github.com:finix-payments/finix-terraform.git//aws/modules/eks/domain"
  environment      = local.environment
  domain           = var.domain
  namespace        = var.namespace
  cluster_oidc_arn = data.aws_iam_openid_connect_provider.cluster_oidc.arn

  applications = [
    {
      name               = "accept-a-payment"
      create_ecr_repo    = terraform.workspace == "qa"
      image_name         = "accept-a-payment"
      custom_policy_arns = []
      secret_template    = {"key": "value"} 
    }
  ]
}
