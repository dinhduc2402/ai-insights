from fastapi import APIRouter, UploadFile, File, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from ..services.assistant_service import assistant_service
from ..services.file_processing_service import file_processing_service
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class QueryRequest(BaseModel):
    prompt: str

@router.post("/upload/{workspace_name}")
async def upload_to_workspace(
    workspace_name: str,
    file: UploadFile = File(...),
    prompt: Optional[str] = None
):
    """
    Upload a file to a workspace and process it with an optional prompt
    """
    try:
        # Process the file
        await file_processing_service.process_file(workspace_name, file.filename)
        
        # If prompt is provided, process it with the assistant
        if prompt:
            response = await assistant_service.process_prompt(workspace_name, prompt)
            return {
                "message": "File uploaded and processed successfully",
                "assistant_response": response
            }
        
        return {"message": "File uploaded successfully"}
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/query/{workspace_name}")
async def query_workspace(
    workspace_name: str,
    request: QueryRequest
):
    """
    Query a workspace with a prompt
    """
    try:
        response = await assistant_service.process_prompt(workspace_name, request.prompt)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 