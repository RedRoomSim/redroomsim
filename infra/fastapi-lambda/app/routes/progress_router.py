from fastapi import APIRouter, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from db import SessionLocal
from models.progress_models import SimulationProgress, SimulationStepProgress
from pydantic import BaseModel
import uuid

progress_router = APIRouter()


class ProgressIn(BaseModel):
    scenario_id: str
    name: str
    username: str
    score: int | None = None
    completed: bool | None = None
    sim_uuid: str | None = None


class StepProgressIn(BaseModel):
    sim_uuid: str
    step_index: int
    decision: str
    feedback: str | None = None
    time_ms: int | None = None


@progress_router.post("/save")
def save_progress(progress: ProgressIn):
    db = SessionLocal()
    try:
        if progress.sim_uuid:
            record = (
                db.query(SimulationProgress)
                .filter_by(sim_uuid=progress.sim_uuid)
                .first()
            )
            if not record:
                raise HTTPException(status_code=404, detail="Simulation not found")
            record.score = progress.score
            record.completed = progress.completed
            db.commit()
            db.refresh(record)
            return {"simulation_id": record.sim_uuid}
        else:
            existing = (
                db.query(SimulationProgress)
                .filter_by(username=progress.username, scenario_id=progress.scenario_id)
                .first()
            )
            sim_uuid = str(uuid.uuid4())
            if existing:
                existing.sim_uuid = sim_uuid
                existing.name = progress.name
                existing.score = progress.score
                existing.completed = progress.completed
                record = existing
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


@progress_router.post("/step")
def save_step_progress(step: StepProgressIn):
    db = SessionLocal()
    try:
        last_sequence = (
            db.query(func.max(SimulationStepProgress.sequence))
            .filter_by(sim_uuid=step.sim_uuid)
            .scalar()
        )
        next_sequence = (last_sequence or 0) + 1
        record = SimulationStepProgress(
            sim_uuid=step.sim_uuid,
            step_index=step.step_index,
            decision=step.decision,
            feedback=step.feedback,
            time_ms=step.time_ms,
            sequence=next_sequence,
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        return {"status": "saved"}
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


# Retrieve a specific progress record for a user and simulation
@progress_router.get("/detail/{username}/{simulation_id}")
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


@progress_router.get("/timeline/{simulation_id}")
def get_timeline(simulation_id: str):
    db = SessionLocal()
    try:
        records = (
            db.query(SimulationStepProgress)
            .filter_by(sim_uuid=simulation_id)
            .order_by(SimulationStepProgress.sequence)
            .all()
        )
        return [
            {
                "decision": r.decision,
                "feedback": r.feedback,
                "timeMs": r.time_ms,
                "step_index": r.step_index,
            }
            for r in records
        ]
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@progress_router.get("/user/{username}")
def get_user_progress(username: str):
    db = SessionLocal()
    try:
        records = db.query(SimulationProgress).filter_by(username=username).all()
        return [
            {
                "id": r.id,
                "scenario_id": r.scenario_id,
                "score": r.score,
                "completed": r.completed,
                "sim_uuid": r.sim_uuid,
            }
            for r in records
        ]
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
