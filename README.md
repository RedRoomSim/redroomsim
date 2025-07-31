# Red Room Simulation

Red Room Simulation (RedRoomSim) is a browser‑based training platform that immerses cyber threat intelligence analysts in realistic attack scenarios. Simulations are sourced from authentic threat reports and dark‑web research, helping analysts practice triage and incident response under pressure with real‑time feedback.

## Features

- Scenario‑based exercises informed by real threat intelligence
- React + Vite frontend styled with Tailwind CSS and using Firebase authentication
- FastAPI backend deployed to AWS Lambda with scenario files stored in S3
- PostgreSQL schema for login logs and simulation analytics
- Comprehensive audit logging and progress tracking for each request

## Project structure

- `frontend/` – React application powered by Vite and Tailwind CSS
- `infra/fastapi-lambda/` – Serverless FastAPI application with simulation, logging, progress, and audit routes
- `infra/*.tf` – Terraform scripts for provisioning AWS resources
- `db/` – PostgreSQL schema defining application tables

## Getting started

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL (for logging and analytics)
- AWS CLI and Terraform (for infrastructure deployment)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd infra/fastapi-lambda/app
python -m venv .venv
source .venv/bin/activate   # On Windows use `.venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```

### Database

Load the PostgreSQL schema:

```bash
psql < db/redroomsim.sql
```

### Deploying to AWS Lambda

Package the API for Lambda deployment:

```bash
pip install -t dependencies -r requirements.txt
pip install zip-files
cd dependencies
Get-ChildItem -Recurse | zip-files -o ..\aws_lambda_artifact.zip
zip-files ..\aws_lambda_artifact.zip ..\main.py
```

### Terraform deployment

Infrastructure can be provisioned with Terraform:

```bash
cd infra
terraform init
terraform apply
```

## Proxy considerations

When the API runs behind a reverse proxy or load balancer, set the `X-Forwarded-For` header with the original client IP. The service prefers this header when logging requests; otherwise, it falls back to the socket IP. Both addresses are recorded for auditability.

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

## License

Distributed under the MIT License. See `LICENSE` for details.

