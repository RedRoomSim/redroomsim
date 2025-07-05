
# ------------------------------------------------------------------------------



# VPC
# ------------------------------------------------------------------------------
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.0"

  name = "redroom-vpc"
  cidr = var.vpc_cidr

  azs             = var.azs
  public_subnets  = var.public_subnet_cidrs
  private_subnets = var.private_subnet_cidrs

  enable_dns_hostnames = true
  enable_dns_support   = true
}


# ------------------------------------------------------------------------------
# RDS - PostgreSQL instance
# ------------------------------------------------------------------------------

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.1.0"

  identifier = "redroom-db"

  engine            = "postgres"
  engine_version    = "14.6"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = var.rds_db_name
  username = var.rds_username
  password = var.rds_password

  vpc_security_group_ids = [module.vpc.default_security_group_id]
  subnet_ids             = module.vpc.private_subnets
  publicly_accessible    = false
  skip_final_snapshot    = true
}


# ------------------------------------------------------------------------------
# Route53 
# ------------------------------------------------------------------------------
resource "aws_route53_record" "frontend_alias" {
  zone_id = var.hosted_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# ------------------------------------------------------------------------------
# ACM Certificate - validated via Route53
# ------------------------------------------------------------------------------
module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "4.1.0"

  domain_name = var.domain_name
  zone_id     = var.hosted_zone_id

  validation_method = "DNS"
}

# ------------------------------------------------------------------------------
# S3 Bucket for Frontend
# ------------------------------------------------------------------------------
module "frontend_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "3.15.1"

  bucket = var.frontend_bucket_name
  acl    = "public-read"

  website = {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# ------------------------------------------------------------------------------
# CloudFront - uses ACM cert
# ------------------------------------------------------------------------------
module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "3.3.0"

  aliases = [var.domain_name]

  default_root_object = "index.html"
  enabled             = true

  origin = {
    domain_name = module.frontend_bucket.s3_bucket_website_endpoint
    origin_id   = "frontend"
    custom_origin_config = {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
    }
  }

  default_cache_behavior = {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "frontend"

    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate = {
    acm_certificate_arn      = module.acm.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}


# ------------------------------------------------------------------------------
# Lambda Function
# ------------------------------------------------------------------------------
module "lambda_docker" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "5.2.0"

  function_name = "redroom-fastapi"
  description   = "FastAPI deployed as Lambda using Docker"
  handler       = "app.main.handler"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 512

  image_uri    = module.ecr.repository_url
  package_type = "Image"

  environment_variables = {
    STAGE = "prod"
  }

  attach_policy_statements = true
  policy_statements = [
    {
      actions   = ["secretsmanager:GetSecretValue"]
      resources = [aws_secretsmanager_secret.fastapi_secrets.arn]
    }
  ]
  create_role = true
}


module "ecr" {
  source  = "terraform-aws-modules/ecr/aws"
  version = "1.5.0"

  repository_name   = "fastapi-redroom"
  create_repository = true
  repository_type   = "private"
}

resource "aws_secretsmanager_secret" "fastapi_secrets" {
  name = "fastapi-app-secrets"
}

# Build & push Docker image with local-exec
resource "null_resource" "docker_build_push" {
  provisioner "local-exec" {
    command = <<EOT
      aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${module.ecr.repository_url}
      docker build -t fastapi-redroom ./lambda
      docker tag fastapi-redroom:latest ${module.ecr.repository_url}:latest
      docker push ${module.ecr.repository_url}:latest
    EOT
  }
  triggers = {
    always_run = timestamp()
  }
  depends_on = [module.ecr]
}


# ------------------------------------------------------------------------------
# API Gateway v2
# ------------------------------------------------------------------------------

module "apigateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.1.0"

  name          = "redroom-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = module.apigateway.apigatewayv2_api_id
  integration_type       = "AWS_PROXY"
  integration_uri        = module.lambda_docker.lambda_function_invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = module.apigateway.apigatewayv2_api_id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "allow_apigateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_docker.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.apigateway.apigatewayv2_api_execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = module.apigateway.apigatewayv2_api_id
  name        = "$default"
  auto_deploy = true
}

