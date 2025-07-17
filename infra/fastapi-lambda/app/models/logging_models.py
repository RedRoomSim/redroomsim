from sqlalchemy import Column, Integer, String, DateTime, func
from db import Base

class UserLoginLog(Base):
    __tablename__ = "user_login_logs"
    __table_args__ = {"schema": "redroomsimdb"}
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String, nullable=False)
    email = Column(String)
    role = Column(String)
    event = Column(String, nullable=False)  
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    ip_address = Column(String)


class AuditLog(Base):
    """Model for persistent audit trail."""

    __tablename__ = "audit_logs"
    __table_args__ = {"schema": "redroomsimdb"}
    id = Column(Integer, primary_key=True, index=True)
    actor = Column(String)  # optional user email or identifier
    action = Column(String, nullable=False)  # short description
    details = Column(String)  # any extra details
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
