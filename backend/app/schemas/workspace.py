from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
from ..models.workspace import WorkspaceStatus

class WorkspaceBase(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    # user_id: Optional[str] = None
    status: WorkspaceStatus = WorkspaceStatus.ACTIVE

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkspaceStatus] = None

class WorkspaceInDB(WorkspaceBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_validator('id', mode='before')
    def cast_id_to_str(cls, value):
        return str(value)

    class Config:
        from_attributes = True