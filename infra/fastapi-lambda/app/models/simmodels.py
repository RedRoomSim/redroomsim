from pydantic import BaseModel
from typing import List, Optional

class SimStep(BaseModel):
    id: int
    title: str
    description: str
    options: List[str]
    correct_option: Optional[int] = None
    user_choice: Optional[int] = None

class SimScenario(BaseModel):
    scenario_id: str
    name: str
    description: str
    steps: List[SimStep]
