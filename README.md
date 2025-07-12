# Red Room Simulation
##Overview

RedRoomSim is a browser-based, interactive training platform designed to meet the evolving needs of cyber threat intelligence (CTI) professionals. It provides a realistic and immersive environment where users can engage in cyber attack simulations informed by authentic threat reports, dark web intelligence, and curated threat feeds. The platform bridges the gap between theoretical knowledge and real-world application by training analysts in triage and incident response under simulated pressure with real-time feedback. 





API deployment commands

1. pip install -t dependencies -r requirements.txt   
2. pip install zip-files
3. cd .\dependencies 
4. Get-ChildItem -Recurse | zip-files -o ..\aws_lambda_artifact.zip
5. zip-files ..\aws_lambda_artifact.zip ..\main.py
