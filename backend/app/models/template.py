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
    status = Column(String(20), nullable=False, default="active")
    llm_model = Column(String(100))
    main_instructions = Column(Text)
    business_description = Column(Text)
    customer_profile = Column(Text)
    rules_and_filters = Column(Text)
    example_outputs = Column(Text)
    guidance_override = Column(Text)
    prompt = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Define relationships
    workspace = relationship("Workspace") 