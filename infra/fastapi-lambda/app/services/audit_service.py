from db import SessionLocal
from models.logging_models import AuditLog


def record_audit_event(actor: str | None, action: str, details: str | None = None, screen: str | None = None) -> None:
    """Persist an audit log entry.

    Errors are suppressed to avoid affecting API responses.
    """
    db = SessionLocal()
    try:
        # Build the ORM object and commit to the DB
        entry = AuditLog(actor=actor, action=action, details=details, screen=screen)
        db.add(entry)
        db.commit()
    except Exception:
        # Ignore failures so we don't break the primary request
        db.rollback()
    finally:
        db.close()

