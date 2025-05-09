from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.template import AITemplate
from ..schemas.template import TemplateCreate, TemplateResponse, TemplateUpdate
from ..services.template_service import template_service

router = APIRouter()

@router.post("/", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(template: TemplateCreate, db: Session = Depends(get_db)):
    """
    Create a new AI template
    """
    try:
        return template_service.create_template(db, template)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create template: {str(e)}"
        )

@router.get("/", response_model=List[TemplateResponse])
async def get_templates(
    workspace_id: Optional[UUID] = None, 
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all templates with optional filtering by workspace
    """
    try:
        return template_service.get_templates(db, workspace_id, skip, limit)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve templates: {str(e)}"
        )

@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: UUID, db: Session = Depends(get_db)):
    """
    Get a specific template by ID
    """
    template = template_service.get_template(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template with ID {template_id} not found"
        )
    return template

@router.put("/{template_id}", response_model=TemplateResponse)
async def update_template(
    template_id: UUID, 
    template_update: TemplateUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update an existing template
    """
    template = template_service.get_template(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template with ID {template_id} not found"
        )
    
    try:
        return template_service.update_template(db, template_id, template_update)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update template: {str(e)}"
        )

@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(template_id: UUID, db: Session = Depends(get_db)):
    """
    Delete a template
    """
    template = template_service.get_template(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template with ID {template_id} not found"
        )
    
    try:
        template_service.delete_template(db, template_id)
        return {"message": "Template deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete template: {str(e)}"
        )

@router.post("/{template_id}/duplicate", response_model=TemplateResponse)
async def duplicate_template(template_id: UUID, db: Session = Depends(get_db)):
    """
    Duplicate an existing template
    """
    template = template_service.get_template(db, template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template with ID {template_id} not found"
        )
    
    try:
        return template_service.duplicate_template(db, template_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to duplicate template: {str(e)}"
        ) 