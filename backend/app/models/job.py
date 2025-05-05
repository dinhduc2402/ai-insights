from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.sql import func
import uuid
import enum

from ..database import Base

class JobStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(JobStatus), default=JobStatus.PENDING)
    result = Column(Text)
    error = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False) 