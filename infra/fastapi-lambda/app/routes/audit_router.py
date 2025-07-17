from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from db import SessionLocal
from models.logging_models import AuditLog

router = APIRouter()

class AuditIn(BaseModel):
    """Schema for creating an audit entry via the API."""

    actor: str | None = None
    action: str
    details: str | None = None

@router.post("/log")
async def create_audit_log(audit: AuditIn):
    """Persist a new audit event."""
    db = SessionLocal()
    try:
        record = AuditLog(actor=audit.actor, action=audit.action, details=audit.details)
        db.add(record)
        db.commit()
        db.refresh(record)
        return {"id": record.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/logs")
def get_audit_logs():
    """Return all audit logs ordered by newest first."""
    db = SessionLocal()
    try:
        logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
        return [
            {
                "actor": log.actor,
                "action": log.action,
                "details": log.details,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
