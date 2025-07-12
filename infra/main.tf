

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
  enable_nat_gateway = true
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
  family = "postgres17"
  db_name  = var.rds_db_name
  username = var.RDS_USERNAME
  password = var.RDS_PASSWORD
  create_db_subnet_group = true
  db_subnet_group_name = "redroom-db-subnet-group"
  subnet_ids             = module.vpc.private_subnets
  vpc_security_group_ids = [module.rds_sg.security_group_id]

  publicly_accessible = false
  multi_az            = false
  skip_final_snapshot = true
  deletion_protection = false
}
module "rds_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.1.0"

  name        = "rds-sg"
  description = "Allow PostgreSQL from EC2"
  vpc_id      = module.vpc.vpc_id

  ingress_with_source_security_group_id = [
    {
      from_port                = 5432
      to_port                  = 5432
      protocol                 = "tcp"
      source_security_group_id = module.ec2_sg.security_group_id
    }
  ]
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
  version = "3.15.1"

  bucket = var.frontend_bucket_name

  acl    = "private"

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  force_destroy = true
}

resource "aws_s3_bucket_policy" "frontend_bucket" {
  bucket = var.frontend_bucket_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontServicePrincipalReadOnly"
        Effect    = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action    = "s3:GetObject"
        Resource  = "${module.frontend_bucket.s3_bucket_arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = module.cloudfront.cloudfront_distribution_arn
          }
        }
      }
    ]
  })
}
# ------------------------------------------------------------------------------
# CloudFront - uses ACM cert
# ------------------------------------------------------------------------------
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "frontend-oac"
  description                       = "OAC for frontend bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

module "cloudfront" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "3.2.0"

  aliases = [var.domain_name]

  default_root_object = "index.html"
  enabled             = true
  comment             = "Frontend CDN"

  origin = {
    frontend = {
      domain_name = module.frontend_bucket.s3_bucket_bucket_domain_name
      origin_id   = "frontend-origin"

      s3_origin_config = {}  # Leave empty for OAC

      origin_access_control_id = aws_cloudfront_origin_access_control.oac.id
    }
  }

  viewer_certificate = {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  default_cache_behavior = {
    target_origin_id       = "frontend-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }
  }

  depends_on = [aws_cloudfront_origin_access_control.oac]
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

  image_uri    = "${module.ecr.repository_url}:${var.image_tag}"
  package_type = "Image"
  #source_path = "fastapi-lambda/app"
  environment_variables = {
    STAGE = "prod"
  }

  attach_policy_statements = true
  policy_statements = [
    {
      actions   = ["secretsmanager:GetSecretValue"]
      resources = ["arn:aws:secretsmanager:us-east-1:216989113260:secret:rds!db-16eac987-ba6d-4655-9ae6-89bdfaa972ae-q9tHBZ"]
    }
  ]
  create_role = true
  depends_on = [null_resource.docker_build_push]
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

# resource "aws_secretsmanager_secret" "fastapi_secrets" {
#   name = "fastapi-app-secrets-1"
# }


# Build & push Docker image with local-exec
resource "null_resource" "docker_build_push" {
  provisioner "local-exec" {
    command = <<EOT
      aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${module.ecr.repository_url}
      docker build -t fastapi-redroom:${var.image_tag} ./fastapi-lambda
      docker tag fastapi-redroom:${var.image_tag} ${module.ecr.repository_url}:${var.image_tag}
      docker push ${module.ecr.repository_url}:${var.image_tag}
    EOT
  } 
  triggers = {
    image_tag = var.image_tag
    always_run = timestamp()
  }
  depends_on = [module.ecr]
}
#docker tag fastapi-redroom:$IMAGE_TAG ${module.ecr.repository_url}:$IMAGE_TAG

# ------------------------------------------------------------------------------
# API Gateway v2
# ------------------------------------------------------------------------------

module "apigateway" {
  source  = "terraform-aws-modules/apigateway-v2/aws"
  version = "2.1.0"

  name          = "redroom-api"
  protocol_type = "HTTP"
  create_api_domain_name = false
  domain_name   = "api.${var.domain_name}"
  domain_name_certificate_arn = var.acm_certificate_arn
  cors_configuration = {
    allow_origins = ["https://redroomsim.com"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    expose_headers = []
    max_age = 3600
  }
  
}

resource "aws_apigatewayv2_domain_name" "custom" {
  domain_name = "api.redroomsim.com"

  domain_name_configuration {
    certificate_arn = var.acm_certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "custom_mapping" {
  api_id      = module.apigateway.apigatewayv2_api_id
  domain_name = aws_apigatewayv2_domain_name.custom.id
  stage       = "$default"
  api_mapping_key = ""
}

resource "aws_route53_record" "apigateway_alias" {
  zone_id = var.hosted_zone_id
  name    = "api.redroomsim.com"
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.custom.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.custom.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = module.apigateway.apigatewayv2_api_id
  integration_type       = "AWS_PROXY"
  integration_uri        = module.lambda_docker.lambda_function_invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_route" "api_proxy" {
  api_id    = module.apigateway.apigatewayv2_api_id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "allow_apigateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda_docker.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${module.apigateway.apigatewayv2_api_execution_arn}/*/*"
}

# resource "aws_apigatewayv2_stage" "default" {
#   api_id      = module.apigateway.apigatewayv2_api_id
#   name        = "$default"
#   auto_deploy = true

#   default_route_settings {
#   throttling_burst_limit = 5000
#   throttling_rate_limit  = 10000
#   }

#   access_log_settings {
#     destination_arn = aws_cloudwatch_log_group.api_gw.arn
#     format = jsonencode({
#       requestId = "$context.requestId"
#       sourceIp  = "$context.identity.sourceIp"
#     })
#   }
# }
resource "aws_cloudwatch_log_group" "api_gw" {
  name              = "/aws/apigateway/redroom-api"
  retention_in_days = 7
}
# ------------------------------------------------------------------------------
# Bastion Host EC2 Instance
# ------------------------------------------------------------------------------
module "ec2_instance" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "5.5.0"

  name = "Bastion"

  instance_type          = var.ec2_instance_type
  ami                    = var.ami_id
  subnet_id              = module.vpc.public_subnets[0]
  vpc_security_group_ids = [module.ec2_sg.security_group_id]
  key_name               = var.ec2_key_name
  iam_instance_profile   = var.ec2_instance_profile

  tags = {
    Name = "Bastion"
  }
}
module "ec2_sg" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "5.1.0"

  name        = "ec2-sg"
  description = "Allow EC2 to connect to RDS"
  vpc_id      = module.vpc.vpc_id

  egress_with_cidr_blocks = [
    {
      from_port   = 5432
      to_port     = 5432
      protocol    = "tcp"
      cidr_blocks = var.vpc_cidr
    }
  ]
}