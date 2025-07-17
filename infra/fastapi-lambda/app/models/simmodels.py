from pydantic import BaseModel, validator  # validator used to preprocess options
from typing import List, Optional, Union  # Union allows string or StepOption


class StepOption(BaseModel):
    text: str  # option text displayed to the user
    next_step: Optional[int] = None  # ID of step to jump to when chosen

class SimStep(BaseModel):
    id: int
    title: str
    description: str
    options: List[Union[str, StepOption]]  # support simple strings or StepOption objects
    correct_option: Optional[int] = None  # index of correct option if any
    hint: Optional[str] = None  # optional hint shown to user
    mitre_attack: Optional[str] = None  # MITRE ATT&CK technique reference
    user_choice: Optional[int] = None

    @validator("options", pre=True)
    def convert_options(cls, v: List[Union[str, StepOption]]):
        # convert raw strings to StepOption objects for consistency
        return [opt if isinstance(opt, dict) else StepOption(text=opt) for opt in v]

class SimScenario(BaseModel):
    scenario_id: str
    name: str
    description: str
    steps: List[SimStep]
