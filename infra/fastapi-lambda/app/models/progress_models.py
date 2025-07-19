from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    func,
    ForeignKey,
    UniqueConstraint,
)
from db import Base

class SimulationProgress(Base):
    __tablename__ = "simulation_progress"
    __table_args__ = (
        UniqueConstraint("username", "scenario_id", name="username_scenario_uc"),
        {"schema": "redroomsimdb"},
    )

    id = Column(Integer, primary_key=True, index=True)
    sim_uuid = Column(String, unique=True, nullable=False)
    scenario_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    username = Column(String, nullable=False)
    score = Column(Integer)
    completed = Column(Boolean)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SimulationStepProgress(Base):
    __tablename__ = "simulation_step_progress"
    __table_args__ = {"schema": "redroomsimdb"}

    id = Column(Integer, primary_key=True, index=True)
    sim_uuid = Column(
        String,
        ForeignKey("redroomsimdb.simulation_progress.sim_uuid"),
        nullable=False,
        index=True,
    )
    step_index = Column(Integer, nullable=False)
    decision = Column(String, nullable=False)
    feedback = Column(String)
    time_ms = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

