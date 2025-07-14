from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from db import Base

class SimulationProgress(Base):
    __tablename__ = "simulation_progress"
    __table_args__ = {"schema": "redroomsimdb"}

    id = Column(Integer, primary_key=True, index=True)
    sim_uuid = Column(String, unique=True, nullable=False)
    scenario_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    score = Column(Integer)
    completed = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

