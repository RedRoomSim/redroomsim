from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from db import SessionLocal
from models.progress_models import SimulationProgress, SimulationStepProgress
from pydantic import BaseModel
import uuid

progress_router = APIRouter()

class ProgressIn(BaseModel):
    sim_uuid: str | None = None
    scenario_id: str
    name: str
    username: str
    score: int | None = None
    completed: bool | None = None


class StepProgressIn(BaseModel):
    sim_uuid: str
    step_index: int
    decision: str
    feedback: str
    time_ms: int

@progress_router.post("/save")
def save_progress(progress: ProgressIn):
    db = SessionLocal()
    try:
        sim_uuid = progress.sim_uuid or str(uuid.uuid4())
        record = (
            db.query(SimulationProgress)
            .filter_by(sim_uuid=sim_uuid)
            .first()
        )
        if record:
            record.score = progress.score
            record.completed = progress.completed
            db.commit()
            db.refresh(record)
        else:
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


@progress_router.post("/step")
def save_step(progress: StepProgressIn):
    db = SessionLocal()
    try:
        record = SimulationStepProgress(
            sim_uuid=progress.sim_uuid,
            step_index=progress.step_index,
            decision=progress.decision,
            feedback=progress.feedback,
            time_ms=progress.time_ms,
        )
        db.add(record)
        db.commit()
        return {"status": "ok"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@progress_router.get("/timeline/{sim_uuid}")
def get_timeline(sim_uuid: str):
    db = SessionLocal()
    try:
        rows = (
            db.query(SimulationStepProgress)
            .filter_by(sim_uuid=sim_uuid)
            .order_by(SimulationStepProgress.step_index.asc())
            .all()
        )
        return [
            {
                "decision": r.decision,
                "feedback": r.feedback,
                "time_ms": r.time_ms,
                "step_index": r.step_index,
            }
            for r in rows
        ]
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

