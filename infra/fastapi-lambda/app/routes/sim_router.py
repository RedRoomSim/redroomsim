from fastapi import APIRouter, UploadFile, File, HTTPException, Path
import shutil
import os
from models.simmodels import SimScenario
from services.sim_logic import load_scenario_from_file
import json
from datetime import datetime



SCENARIO_DIR = os.path.join(os.path.dirname(__file__), "../../../data")
SCENARIO_DIR = os.path.abspath(SCENARIO_DIR)

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
        for filename in os.listdir(SCENARIO_DIR):
            if filename.endswith(".json"):
                file_path = os.path.join(SCENARIO_DIR, filename)
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    scenario_list.append({
                        "id": data.get("scenario_id", filename),
                        "name": data.get("name", os.path.splitext(filename)[0]),
                        "description": data.get("description", "No description provided"),
                        "type": data.get("type","Default"),
                        "difficulty": data.get("difficulty","Easy")
                    })
    except Exception as e:

        raise HTTPException(status_code=500, detail=f"Failed to read scenarios: {str(e)}")

    return {"scenarios": scenario_list}

@sim_router.get("/{scenario_id}")
def get_scenario(scenario_id: str):
    try:
        files = [f for f in os.listdir(SCENARIO_DIR) if f.endswith(".json")]
        for f in files:
            path = os.path.join(SCENARIO_DIR, f)
            with open(path, "r", encoding="utf-8") as file:
                data = json.load(file)
                if data.get("scenario_id") == scenario_id:
                    return data
        raise HTTPException(status_code=404, detail="Scenario ID not found in any JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading scenario: {str(e)}")

@sim_router.post("/upload-scenario")
async def upload_scenario(file: UploadFile = File(...)):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .json files are allowed.")

    file_path = os.path.join(SCENARIO_DIR, file.filename)

    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        parsed = json.loads(decoded)

        # Validate using Pydantic model
        scenario = SimScenario(**parsed)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(decoded)

        return {
        "filename": file.filename,
        "size": len(decoded),
        "upload_time": datetime.utcnow().isoformat() + "Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


    


