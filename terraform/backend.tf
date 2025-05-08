terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }
  backend "s3" {
    bucket         = "finix-terraform-qa"
    region         = "us-west-2"
    key            = "applications/accept-a-payment/terraform.tfstate"
    encrypt        = true
    use_lockfile = true
    assume_role  = {
      role_arn = "arn:aws:iam::830706739344:role/terraform-admin"
    }
  }
}

module "environment" {
  source    = "git@github.com:finix-payments/finix-terraform.git//aws/modules/constants/environments"
  workspace = terraform.workspace
}

module "cluster" {
  source    = "git@github.com:finix-payments/finix-terraform.git//aws/modules/constants/clusters"
  workspace = terraform.workspace
}

provider "aws" {
  region = module.environment.values.region
  assume_role {
    role_arn = "arn:aws:iam::${module.environment.values.account_id}:role/terraform-admin"
  }
}

data "aws_eks_cluster" "cluster" {
  name = module.environment.values.cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.environment.values.k8s_domain_name
}

data "aws_iam_openid_connect_provider" "cluster_oidc" {
  url = data.aws_eks_cluster.cluster.identity[0].oidc[0].issuer
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  # https://developer.hashicorp.com/terraform/tutorials/kubernetes/kubernetes-provider
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args = [
      "eks",
      "get-token",
      "--cluster-name",
      data.aws_eks_cluster.cluster.name
    ]
  }
}
