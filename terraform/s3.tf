module "app_bucket" {
  source        = "terraform-aws-modules/s3-bucket/aws"
  version       = "~> 3.0"
  bucket        = "accept-a-payment-${local.environment}"
  force_destroy = true

  website = {
    index_document = "index.html"
  }

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}


data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions = ["s3:GetObject"]
    resources = [
      "${module.app_bucket.s3_bucket_arn}/*"
    ]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = [module.cloudfront.cloudfront_distribution_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = module.app_bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.s3_policy.json
}
