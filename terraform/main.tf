locals {
  environment = module.environment.values.name
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
