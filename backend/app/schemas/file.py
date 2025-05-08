from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FileBase(BaseModel):
    filename: str
    content_type: Optional[str] = None
    workspace_id: str
    job_id: Optional[str] = None

class FileCreate(FileBase):
    pass

class FileInDB(FileBase):
    id: str
    file_path: str
    file_size: int
    created_at: datetime
    user_id: str

    class Config:
        from_attributes = True

class FileResponse(BaseModel):
    id: str
    filename: str
    content_type: Optional[str] = None
    file_size: int
    workspace_id: str
    created_at: datetime

class FileProcessRequest(BaseModel):
    file_key: str
    index_name: Optional[str] = "default-index"

class FileProcessResponse(BaseModel):
    message: str
    workspace: str
    file_key: str
    index_name: str 