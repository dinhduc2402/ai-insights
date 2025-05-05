from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.workspace import WorkspaceStatus

class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    workspace_id: str

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[WorkspaceStatus]
    result: Optional[str] = None
    error: Optional[str] = None

class WorkspaceInDB(WorkspaceBase):
    id: str
    status: WorkspaceStatus
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: str

    class Config:
        from_attributes = True 