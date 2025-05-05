from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
import uuid

from ..database import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    text = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False) 