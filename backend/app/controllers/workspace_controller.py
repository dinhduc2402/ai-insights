from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.workspace import Workspace, WorkspaceStatus
from ..schemas.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspaceInDB

router = APIRouter()

@router.post("/", response_model=WorkspaceInDB)
def create_workspace(workspace: WorkspaceCreate, db: Session = Depends(get_db)):
    db_workspace = Workspace(**workspace.model_dump())
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

@router.get("/", response_model=List[WorkspaceInDB])
def read_workspaces(
    skip: int = 0,
    limit: int = 100,
    workspace_id: str = None,
    user_id: str = None,
    status: WorkspaceStatus = None,
    db: Session = Depends(get_db)
):
    query = db.query(Workspace)
    
    if workspace_id:
        query = query.filter(Workspace.workspace_id == workspace_id)
    if user_id:
        query = query.filter(Workspace.user_id == user_id)
    if status:
        query = query.filter(Workspace.status == status)
    
    workspaces = query.offset(skip).limit(limit).all()
    return workspaces

@router.get("/{workspace_id}", response_model=WorkspaceInDB)
def read_workspace(workspace_id: str, db: Session = Depends(get_db)):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return db_workspace

@router.put("/{workspace_id}", response_model=WorkspaceInDB)
def update_workspace(workspace_id: str, workspace: WorkspaceUpdate, db: Session = Depends(get_db)):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    update_data = workspace.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_workspace, field, value)
    
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

@router.delete("/{workspace_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workspace(workspace_id: str, db: Session = Depends(get_db)):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if db_workspace is None:
        raise HTTPException(status_code=404, detail="Workspace not found")
    
    db.delete(db_workspace)
    db.commit()
    return None 