module "acm" {
  source              = "terraform-aws-modules/acm/aws"
  version             = "~> 4.0"
  domain_name         = local.domain_name
  zone_id             = data.aws_route53_zone.root.id
  wait_for_validation = true
}

module "cloudfront" {
  source              = "terraform-aws-modules/cloudfront/aws"
  comment             = "Accept-a-Payment distribution"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  wait_for_deployment = false

  aliases = [
    local.domain_name
  ]

  create_origin_access_control = true
  origin_access_control = {
    accept_payment = {
      description      = "CloudFront access to Accept-a-Payment app"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }


  origin = {
    accept_payment = {
      domain_name           = module.app_bucket.s3_bucket_bucket_regional_domain_name
      origin_access_control = "accept_payment"
    }
  }

  default_cache_behavior = {
    target_origin_id       = "accept_payment"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true
  }

  viewer_certificate = {
    acm_certificate_arn = module.acm.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

}
