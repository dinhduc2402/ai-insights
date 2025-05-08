from sqlalchemy import Column, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.sql import func
import uuid

from ..database import Base

class File(Base):
    __tablename__ = "files"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(BigInteger, nullable=False)
    content_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    workspace_id = Column(String(36), ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False) 