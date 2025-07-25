# Red Room Simulation
##Overview

RedRoomSim is a browser-based, interactive training platform designed to meet the evolving needs of cyber threat intelligence (CTI) professionals. It provides a realistic and immersive environment where users can engage in cyber attack simulations informed by authentic threat reports, dark web intelligence, and curated threat feeds. The platform bridges the gap between theoretical knowledge and real-world application by training analysts in triage and incident response under simulated pressure with real-time feedback. 





API deployment commands

1. pip install -t dependencies -r requirements.txt
2. pip install zip-files
3. cd .\dependencies
4. Get-ChildItem -Recurse | zip-files -o ..\aws_lambda_artifact.zip
5. zip-files ..\aws_lambda_artifact.zip ..\main.py

## Proxy considerations

When the API is deployed behind a reverse proxy or load balancer, the proxy
should set the `X-Forwarded-For` header with the original client IP address. The
logging endpoints will prefer this header when it contains a valid IP. If the
header is missing or invalid, the FastAPI `request.client.host` value will be
used instead. Both the forwarded address and the original host are included in
audit log entries for traceability.
