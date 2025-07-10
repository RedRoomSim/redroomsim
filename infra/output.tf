output "frontend_url" {
  value = module.frontend_bucket.s3_bucket_website_endpoint
}

output "api_gateway_url" {
  description = "The default endpoint for the API Gateway deployment"
  value       = module.apigateway.apigatewayv2_api_api_endpoint
}
output "cloudfront_distribution_id" {
  value = module.cloudfront.cloudfront_distribution_id
}

output "cloudfront_app_url" {
  value = module.cloudfront.cloudfront_distribution_domain_name
}

output "bucket_domain_name" {
  value = aws_s3_bucket.this[0].bucket_regional_domain_name
}

output "origin_access_identity_path" {
  value = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
}