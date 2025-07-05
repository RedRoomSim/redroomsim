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