from fastapi import APIRouter, Request, HTTPException
import logging
from db import SessionLocal
from models.logging_models import UserLoginLog
from services.audit_service import record_audit_event

router = APIRouter()

@router.post("/log-login")
async def log_user_login(request: Request):
    data = await request.json()
    db = SessionLocal()
    try:
        ip_address = request.client.host
        log_entry = UserLoginLog(
            uid=data["uid"],
            email=data["email"],
            role=data["role"],
            event="login",
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()
        # Record this login in the audit log
        screen = request.headers.get("x-screen") or request.headers.get("referer")
        record_audit_event(actor=data["email"], action="login", screen=screen)
        return {"message": "Login logged"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "detail": str(e)}
    finally:
        db.close()

@router.post("/log-logout")
async def log_logout(request: Request):
    data = await request.json()
    db = SessionLocal()
    try:
        log = UserLoginLog(
            uid=data["uid"],
            email=data["email"],
            role=data.get("role", "unknown"),
            event="logout"
        )
        db.add(log)
        db.commit()
        # Capture logouts as part of the audit trail
        screen = request.headers.get("x-screen") or request.headers.get("referer")
        record_audit_event(actor=data["email"], action="logout", screen=screen)
        return {"message": "Logout logged"}
    except Exception as e:
        db.rollback()
        logging.exception("Error logging logout")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()
        
@router.post("/log-failed-login")
async def log_failed_login(request: Request):
    data = await request.json()
    db = SessionLocal()
    try:
        ip_address = request.client.host
        log_entry = UserLoginLog(
            uid=data.get("uid", None),
            email=data["email"],
            role=data.get("role", "unknown"),
            event="failed_login",
            ip_address=ip_address
        )
        db.add(log_entry)
        db.commit()
        # Track failed attempts to help with security reviews
        screen = request.headers.get("x-screen") or request.headers.get("referer")
        record_audit_event(actor=data.get("email"), action="failed_login", screen=screen)
        return {"message": "Failed login logged"}
    except Exception as e:
        db.rollback()
        logging.exception("Error logging failed login")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()

@router.post("/log-password-change")
async def log_password_change(request: Request):
    data = await request.json()
    db = SessionLocal()
    try:
        log = UserLoginLog(
            uid=data["uid"],
            email=data["email"],
            role=data.get("role", "unknown"),
            event="password_change"
        )
        db.add(log)
        db.commit()
        # Log any password changes
        screen = request.headers.get("x-screen") or request.headers.get("referer")
        record_audit_event(actor=data["email"], action="password_change", screen=screen)
        return {"message": "Password change logged"}
    except Exception as e:
        db.rollback()
        logging.exception("Error logging password change")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()

@router.get("/login-activity")
def get_login_activity():
    db = SessionLocal()
    try:
        logs = db.query(UserLoginLog).order_by(UserLoginLog.timestamp.desc()).all()
        # Viewing the login history is itself auditable
        record_audit_event(actor=None, action="get_login_activity", screen=None)
        return [
            {
                "email": log.email,
                "role": log.role,
                "event": log.event,
                "timestamp": log.timestamp.isoformat()
            }
            for log in logs
        ]
    finally:
        db.close()
