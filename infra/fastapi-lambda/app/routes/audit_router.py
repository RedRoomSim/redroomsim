from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from datetime import datetime
import io
from openpyxl import Workbook
from pydantic import BaseModel
from urllib.parse import urlparse

from db import SessionLocal
from models.logging_models import AuditLog


def _normalize_screen(screen: str | None) -> str | None:
    if not screen:
        return None

    screen = screen.strip()
    parsed = urlparse(screen)

    if parsed.scheme and parsed.netloc:
        if parsed.path and parsed.path != "/":
            return parsed.path
        return None

    return screen or None

router = APIRouter()

class AuditIn(BaseModel):
    """Schema for creating an audit entry via the API."""

    actor: str | None = None
    action: str
    details: str | None = None
    screen: str | None = None

@router.post("/log")
async def create_audit_log(audit: AuditIn):
    """Persist a new audit event."""
    db = SessionLocal()
    try:
        record = AuditLog(
            actor=audit.actor,
            action=audit.action,
            details=audit.details,
            screen=_normalize_screen(audit.screen),
        )
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
def get_audit_logs(
    actor: str | None = None,
    action: str | None = None,
    details: str | None = None,
    screen: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    """Return audit logs filtered by optional query parameters."""    
    db = SessionLocal()
    try:
        query = db.query(AuditLog)
        if actor:
            query = query.filter(AuditLog.actor.ilike(f"%{actor}%"))
        if action:
            query = query.filter(AuditLog.action.ilike(f"%{action}%"))
        if details:
            query = query.filter(AuditLog.details.ilike(f"%{details}%"))
        if screen:
            query = query.filter(AuditLog.screen.ilike(f"%{screen}%"))
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(AuditLog.timestamp >= start_dt)
        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(AuditLog.timestamp <= end_dt)
        logs = query.order_by(AuditLog.timestamp.desc()).all()
        return [
            {
                "actor": log.actor,
                "action": log.action,
                "details": log.details,
                "screen": log.screen,
                "timestamp": log.timestamp.isoformat(),
            }
            for log in logs
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/export")
def export_audit_logs(start_date: str, end_date: str):
    """Export logs within a date range as an Excel file."""
    db = SessionLocal()
    try:
        start_dt = datetime.fromisoformat(start_date)
        end_dt = datetime.fromisoformat(end_date)
        logs = (
            db.query(AuditLog)
            .filter(AuditLog.timestamp >= start_dt, AuditLog.timestamp <= end_dt)
            .order_by(AuditLog.timestamp)
            .all()
        )

        wb = Workbook()
        ws = wb.active
        ws.append(["Actor", "Action", "Details", "Screen", "Timestamp"])
        for log in logs:
            ws.append([
                log.actor,
                log.action,
                log.details,
                log.screen,
                log.timestamp.isoformat(),
            ])

        buffer = io.BytesIO()
        wb.save(buffer)
        buffer.seek(0)

        headers = {
            "Content-Disposition": "attachment; filename=audit_logs.xlsx"
        }
        return StreamingResponse(
            buffer,
            media_type=
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers=headers,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
