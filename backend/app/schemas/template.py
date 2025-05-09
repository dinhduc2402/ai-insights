from typing import Optional, List
from pydantic import BaseModel, Field, UUID4
from datetime import datetime
import uuid

# Base model for common template fields
class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "active"
    llm_model: Optional[str] = None
    main_instructions: Optional[str] = None
    business_description: Optional[str] = None
    customer_profile: Optional[str] = None
    rules_and_filters: Optional[str] = None
    example_outputs: Optional[str] = None
    guidance_override: Optional[str] = None
    prompt: Optional[str] = None

# Model for creating a new template
class TemplateCreate(TemplateBase):
    workspace_id: UUID4

# Model for updating an existing template
class TemplateUpdate(TemplateBase):
    name: Optional[str] = None
    status: Optional[str] = None
    workspace_id: Optional[UUID4] = None

# Model for returning a template to the client
class TemplateResponse(TemplateBase):
    id: UUID4
    workspace_id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Model for template list response
class TemplateListResponse(BaseModel):
    templates: List[TemplateResponse]
    total: int
    
    class Config:
        from_attributes = True 