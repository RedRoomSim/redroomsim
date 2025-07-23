from urllib.parse import urlparse

from db import SessionLocal
from models.logging_models import AuditLog


def _normalize_screen(screen: str | None) -> str | None:
    """Return only the path portion of a URL-like screen value."""
    if not screen:
        return None

    screen = screen.strip()
    parsed = urlparse(screen)

    if parsed.scheme and parsed.netloc:
        # Only keep the path when a full URL is supplied
        if parsed.path and parsed.path != "/":
            return parsed.path
        return None

    # Already a relative path
    return screen or None


def record_audit_event(actor: str | None, action: str, details: str | None = None, screen: str | None = None) -> None:
    """Persist an audit log entry.

    Errors are suppressed to avoid affecting API responses.
    """
    db = SessionLocal()
    try:
        # Build the ORM object and commit to the DB
        entry = AuditLog(
            actor=actor,
            action=action,
            details=details,
            screen=_normalize_screen(screen),
        )
        db.add(entry)
        db.commit()
    except Exception:
        # Ignore failures so we don't break the primary request
        db.rollback()
    finally:
        db.close()

