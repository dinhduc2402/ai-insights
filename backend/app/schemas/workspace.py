from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from ..models.workspace import WorkspaceStatus

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    workspace_id: Optional[str] = None
    user_id: Optional[str] = None
    status: WorkspaceStatus = WorkspaceStatus.ACTIVE

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkspaceStatus] = None

class WorkspaceInDB(WorkspaceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Updated from orm_mode to from_attributes