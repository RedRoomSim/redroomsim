from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from db import SessionLocal
from models.progress_models import SimulationProgress
from pydantic import BaseModel
import uuid

progress_router = APIRouter()

class ProgressIn(BaseModel):
    scenario_id: str
    name: str
    username: str
    score: int | None = None
    completed: bool | None = None

@progress_router.post("/save")
def save_progress(progress: ProgressIn):
    db = SessionLocal()
    try:
        sim_uuid = str(uuid.uuid4())
        record = SimulationProgress(
            sim_uuid=sim_uuid,
            scenario_id=progress.scenario_id,
            name=progress.name,
            username=progress.username,
            score=progress.score,
            completed=progress.completed,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return {"simulation_id": sim_uuid}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@progress_router.get("/{username}/{simulation_id}")
def get_progress(username: str, simulation_id: str):
    db = SessionLocal()
    try:
        record = (
            db.query(SimulationProgress)
            .filter_by(username=username, sim_uuid=simulation_id)
            .first()
        )
        if not record:
            raise HTTPException(status_code=404, detail="Progress not found")
        return {
            "name": record.name,
            "id": record.scenario_id,
            "score": record.score,
            "username": record.username,
            "completed": record.completed,
            "simulation_id": record.sim_uuid,
        }
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

