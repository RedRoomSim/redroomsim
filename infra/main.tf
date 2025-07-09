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
  engine_version    = "17.4"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  family = "postgres15"
  db_name  = var.rds_db_name
  username = var.RDS_USERNAME
  password = var.RDS_PASSWORD

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
# S3 Bucket for Frontend
# ------------------------------------------------------------------------------

module "frontend_bucket" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "4.0.0"

  bucket = var.frontend_bucket_name
  
  block_public_acls = false
  block_public_policy = false
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
  version = "3.2.1"

  aliases = [var.domain_name]

  origin = {
    frontend = {
      domain_name = module.frontend_bucket.s3_bucket_website_endpoint
      origin_id   = "frontend-origin"

      custom_origin_config = {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "http-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  default_cache_behavior = {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "frontend-origin"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }
  }

  viewer_certificate = {
    acm_certificate_arn = var.acm_certificate_arn
    ssl_support_method  = "sni-only"
  }

  default_root_object = "index.html"
  enabled             = true
  price_class         = "PriceClass_All"
}

# ------------------------------------------------------------------------------
# Lambda Function
# ------------------------------------------------------------------------------
module "lambda_docker" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "5.2.0"

  function_name = "redroom-fastapi"
  description   = "FastAPI deployed as Lambda using Docker"
   create_package = false

  image_uri    = "${module.ecr.repository_url}:${timestamp()}"
  package_type = "Image"
  #source_path = "fastapi-lambda/app"
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
  version = "2.2.0"

  repository_name   = "fastapi-redroom"
  create_repository = true
  repository_type   = "private"
  create_lifecycle_policy = false
}

# resource "aws_ecr_lifecycle_policy" "this" {
#   repository = module.ecr.repository_name

#   policy = jsonencode({
#     rules = [
#       {
#         rulePriority = 1
#         description  = "Retain last 10 images"
#         selection = {
#           tagStatus     = "any"
#           countType     = "imageCountMoreThan"
#           countNumber   = 10
#         }
#         action = {
#           type = "expire"
#         }
#       }
#     ]
#   })
# }

resource "aws_secretsmanager_secret" "fastapi_secrets" {
  name = "fastapi-app-secrets-1"
}


# Build & push Docker image with local-exec
resource "null_resource" "docker_build_push" {
  provisioner "local-exec" {
    command = <<EOT
      aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${module.ecr.repository_url}
      docker build -t fastapi-redroom ./fastapi-lambda
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
  domain_name   = var.domain_name
  domain_name_certificate_arn = var.acm_certificate_arn
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
  name        = "default"
  auto_deploy = true
}

