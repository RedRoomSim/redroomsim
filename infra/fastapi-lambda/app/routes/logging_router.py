from fastapi import APIRouter, Request, HTTPException
import logging
from ipaddress import ip_address as _validate_ip
from db import SessionLocal
from models.logging_models import UserLoginLog
from services.audit_service import record_audit_event

router = APIRouter()


def _get_client_ip(request: Request) -> tuple[str | None, str | None, str | None]:
    """Return best-guess client IP and the raw host/forwarded values."""
    client_host = request.client.host if request.client else None
    forwarded_for = request.headers.get("x-forwarded-for")
    chosen_ip = client_host
    forwarded_ip = None
    if forwarded_for:
        candidate = forwarded_for.split(",")[0].strip()
        try:
            _validate_ip(candidate)
            chosen_ip = candidate
            forwarded_ip = candidate
        except ValueError:
            # Ignore invalid forwarded header
            pass
    return chosen_ip, client_host, forwarded_ip

@router.post("/log-login")
async def log_user_login(request: Request):
    data = await request.json()
    db = SessionLocal()
    try:
        ip_address, client_host, forwarded_ip = _get_client_ip(request)
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
        details = f"forwarded_for={forwarded_ip or 'N/A'} client_host={client_host}"
        record_audit_event(actor=data["email"], action="login", screen=screen, details=details)
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
        ip_address, client_host, forwarded_ip = _get_client_ip(request)
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
        details = f"forwarded_for={forwarded_ip or 'N/A'} client_host={client_host}"
        record_audit_event(actor=data.get("email"), action="failed_login", screen=screen, details=details)
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
