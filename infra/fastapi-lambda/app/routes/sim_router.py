from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import json
from datetime import datetime
import boto3
from botocore.exceptions import BotoCoreError, ClientError
from models.simmodels import SimScenario



SCENARIO_DIR = os.path.join(os.path.dirname(__file__), "../../../data")
SCENARIO_DIR = os.path.abspath(SCENARIO_DIR)

BUCKET_NAME = "redroomsimbucket"
s3_client = boto3.client("s3")

sim_router = APIRouter()

def normalize_name(name):
    return name.lower().replace("_", "-").replace(".json", "").strip()

@sim_router.get("/test")
def test_connection():
    return {"message": "Router is active"}

@sim_router.get("/list")
def list_scenarios():
    scenario_list = []

    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        for obj in response.get("Contents", []):
            key = obj["Key"]
            if key.endswith(".json"):
                file_obj = s3_client.get_object(Bucket=BUCKET_NAME, Key=key)
                data = json.loads(file_obj["Body"].read().decode("utf-8"))
                scenario_list.append({
                    "id": data.get("scenario_id", key),
                    "name": data.get("name", os.path.splitext(key)[0]),
                    "description": data.get("description", "No description provided"),
                    "type": data.get("type", "Default"),
                    "difficulty": data.get("difficulty", "Easy")
                })
    except (BotoCoreError, ClientError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"Failed to read scenarios: {str(e)}")

    return {"scenarios": scenario_list}

@sim_router.get("/{scenario_id}")
def get_scenario(scenario_id: str):
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        for obj in response.get("Contents", []):
            key = obj["Key"]
            if key.endswith(".json"):
                file_obj = s3_client.get_object(Bucket=BUCKET_NAME, Key=key)
                data = json.loads(file_obj["Body"].read().decode("utf-8"))
                if data.get("scenario_id") == scenario_id:
                    return data
        raise HTTPException(status_code=404, detail="Scenario ID not found in any JSON.")
    except (BotoCoreError, ClientError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"Error reading scenario: {str(e)}")

@sim_router.post("/upload-scenario")
async def upload_scenario(file: UploadFile = File(...)):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .json files are allowed.")

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        parsed = json.loads(decoded)

        # Validate using Pydantic model
        SimScenario(**parsed)

        s3_client.put_object(Bucket=BUCKET_NAME, Key=file.filename, Body=contents)

        return {
            "filename": file.filename,
            "size": len(decoded),
            "upload_time": datetime.utcnow().isoformat() + "Z"
        }
    except (BotoCoreError, ClientError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


    


