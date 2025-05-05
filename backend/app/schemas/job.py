from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.job import JobStatus

class JobBase(BaseModel):
    name: str
    description: Optional[str] = None
    workspace_id: str

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[JobStatus] = None
    result: Optional[str] = None
    error: Optional[str] = None

class JobInDB(JobBase):
    id: str
    status: JobStatus
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user_id: str

    class Config:
        from_attributes = True 