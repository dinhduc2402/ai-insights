from fastapi import APIRouter, HTTPException, status, Depends, Response
from typing import List, Optional
from uuid import UUID
import uuid
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from ..database import get_db
from ..models.template import AITemplate
from ..schemas.template import (
    TemplateCreate, 
    TemplateResponse, 
    TemplateUpdate, 
    ProcessTemplateRequest,
    ProcessTemplateResponse
)
from ..services.template_service import template_service
import json
import asyncio
import logging

logger = logging.getLogger(__name__)
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

async def template_event_generator(request_id: str, template_id: UUID, request: ProcessTemplateRequest, db: Session):
    """Generate SSE events for streaming responses when processing with a template"""
    try:
        # Start the streaming process
        yield f"data: {json.dumps({'type': 'start', 'id': request_id})}\n\n"
        
        # Get streaming response
        async for chunk in template_service.process_workspace_with_template_stream(
            db=db,
            template_id=template_id,
            workspace_id=request.workspace_id,
            user_input=request.user_input,
            additional_context=request.additional_context
        ):
            if isinstance(chunk, dict):
                # Format as SSE event
                yield f"data: {json.dumps({'type': 'chunk', 'id': request_id, 'content': chunk})}\n\n"
            else:
                # Plain text chunk
                yield f"data: {json.dumps({'type': 'chunk', 'id': request_id, 'content': {'text': chunk}})}\n\n"
            
            # Small delay to prevent overwhelming the client
            await asyncio.sleep(0.01)
        
        # Signal completion
        yield f"data: {json.dumps({'type': 'end', 'id': request_id})}\n\n"
            
    except Exception as e:
        logger.error(f"Error in template processing stream: {str(e)}", exc_info=True)
        error_json = json.dumps({'type': 'error', 'id': request_id, 'error': str(e)})
        yield f"data: {error_json}\n\n"

@router.post("/process", response_model=ProcessTemplateResponse)
async def process_workspace_with_template(
    request: ProcessTemplateRequest,
    db: Session = Depends(get_db)
):
    """
    Process a workspace using a prompt template
    """
    # Generate a unique request ID
    request_id = str(uuid.uuid4())
    
    # Check if template exists
    template = template_service.get_template(db, request.template_id)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template with ID {request.template_id} not found"
        )
    
    try:
        # Handle streaming request
        if request.stream:
            return StreamingResponse(
                template_event_generator(request_id, request.template_id, request, db),
                media_type="text/event-stream"
            )
        
        # Handle regular request
        result, metadata = await template_service.process_workspace_with_template(
            db=db,
            template_id=request.template_id,
            workspace_id=request.workspace_id,
            user_input=request.user_input,
            additional_context=request.additional_context
        )
        
        return ProcessTemplateResponse(
            id=request_id, 
            result=result,
            metadata=metadata
        )
    except Exception as e:
        logger.error(f"Error processing workspace with template: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 