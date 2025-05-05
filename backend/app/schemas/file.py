from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FileBase(BaseModel):
    filename: str
    content_type: Optional[str] = None
    size: Optional[int] = None

class FileCreate(FileBase):
    workspace_name: str

class FileResponse(FileBase):
    key: str
    bucket: str
    last_modified: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class FileProcessRequest(BaseModel):
    file_key: str
    index_name: Optional[str] = "default-index"

class FileProcessResponse(BaseModel):
    message: str
    workspace: str
    file_key: str
    index_name: str 