variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
}

variable "azs" {
  description = "A list of availability zones in the region"
  type        = list(string)
}

variable "project_name" {
  description = "Name prefix for resources"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "List of public subnet CIDRs"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "List of private subnet CIDRs"
  type        = list(string)
}

variable "domain_name" {
  description = "Primary domain name"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for frontend"
  type        = string
}

variable "certificate_arn" {
  description = "ARN for the ACM certificate"
  type        = string
}

variable "rds_instance_class" {
  description = "Instance class for RDS"
  type        = string
}

variable "rds_db_name" {
  description = "Database name"
  type        = string
}

variable "rds_username" {
  description = "Master username for RDS"
  type        = string
}

variable "rds_password" {
  description = "Master password for RDS"
  type        = string
  sensitive   = true
}

variable "lambda_memory_size" {
  description = "Memory size for backend Lambda"
  type        = number
}

variable "lambda_timeout" {
  description = "Timeout for backend Lambda"
  type        = number
}

variable "lambda_runtime" {
  description = "Runtime for backend Lambda"
  type        = string
}

variable "frontend_bucket_name" {
  description = "S3 bucket name for frontend static files"
  type        = string
}

variable "acm_validation_method" {
  description = "Validation method for ACM certificate"
  type        = string
  default     = "DNS"
}

variable "environment" {
  description = "Deployment environment (e.g., dev, prod)"
  type        = string
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "RedRoomSim"
    Environment = "Development"
  }
}

variable "hosted_zone_id" {
  description = "Route53 hosted zone ID for the domain"
  type        = string
}