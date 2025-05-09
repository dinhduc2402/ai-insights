from typing import Optional, List
from pydantic import BaseModel, Field, UUID4
from datetime import datetime
import uuid

# Base model for common template fields
class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "draft"
    llmModel: Optional[str] = None
    mainInstructions: Optional[str] = None
    businessDescription: Optional[str] = None
    customerProfile: Optional[str] = None
    rulesAndFilters: Optional[str] = None
    exampleOutputs: Optional[str] = None
    guidanceOverride: Optional[str] = None
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
    createdAt: datetime
    updatedAt: datetime

    class Config:
        orm_mode = True

# Model for template list response
class TemplateListResponse(BaseModel):
    templates: List[TemplateResponse]
    total: int
    
    class Config:
        orm_mode = True 