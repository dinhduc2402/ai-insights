from sqlalchemy import Column, String, DateTime, ForeignKey, Text, func, UUID
from sqlalchemy.orm import relationship
import uuid

from ..database import Base

class AITemplate(Base):
    __tablename__ = "ai_templates"

    id = Column(UUID, primary_key=True, default=lambda: str(uuid.uuid4()))
    workspace_id = Column(UUID, ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String(20), nullable=False, default="draft")
    llmModel = Column(String(100))
    mainInstructions = Column(Text)
    businessDescription = Column(Text)
    customerProfile = Column(Text)
    rulesAndFilters = Column(Text)
    exampleOutputs = Column(Text)
    guidanceOverride = Column(Text)
    prompt = Column(Text)
    createdAt = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updatedAt = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Define relationships
    workspace = relationship("Workspace") 