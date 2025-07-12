#!/bin/bash
# Fetch secrets from AWS Secrets Manager
SECRETS=$(aws secretsmanager get-secret-value --secret-id fastapi-app-secrets --query SecretString --output text)

# Export each secret as an environment variable
export $(echo $SECRETS | jq -r 'to_entries|map("\(.key)=\(.value|tostring)")|.[]')

# Start the FastAPI app
exec uvicorn app.main:app --host 0.0.0.0 --port 8080
