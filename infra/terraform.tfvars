aws_region            = "us-east-1"
project_name          = "redroomsim"
azs                   = ["us-east-1a", "us-east-1b"]
vpc_cidr              = "10.0.0.0/16"
public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs  = ["10.0.101.0/24", "10.0.102.0/24"]
domain_name           = "redroomsim.com"
subdomain             = "app"
acm_certificate_arn   = "arn:aws:acm:us-east-1:216989113260:certificate/d9b66497-2763-40b0-b4e8-fcc16df77b96"
hosted_zone_id        = "Z05036852BLZGTJXB03MG"
rds_instance_class    = "db.t3.micro"
rds_db_name           = "redroomsimdb"
lambda_memory_size    = 512
lambda_timeout        = 30
frontend_bucket_name  = "redroomsim-frontend-bucket"
acm_validation_method = "DNS"
environment           = "development"
ec2_instance_type     = "t2.micro"
ec2_key_name          = "bastion"
ami_id                = "ami-020cba7c55df1f615"
ec2_instance_profile  = "Bastion-role"