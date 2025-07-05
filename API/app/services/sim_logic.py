import json
from pathlib import Path
from models.simmodels import SimScenario

def load_scenario_from_file(file_name: str) -> SimScenario:
    file_path = Path(__file__).resolve().parent.parent / "data" / file_name
    with open(file_path) as f:
        data = json.load(f)
    return SimScenario(**data)
