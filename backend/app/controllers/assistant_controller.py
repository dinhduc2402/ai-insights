from fastapi import APIRouter, HTTPException, status, Request, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ..services.assistant_service import assistant_service
import logging
import json
import asyncio

logger = logging.getLogger(__name__)
router = APIRouter()

class QueryRequest(BaseModel):
    id: str
    prompt: str
    model: str = "gpt-3.5-turbo"  # Default model
    stream: bool = False

async def event_generator(workspace_id: str, request: QueryRequest):
    """Generate SSE events for streaming responses"""
    try:
        # Start the streaming process
        yield f"data: {json.dumps({'type': 'start', 'id': request.id})}\n\n"
        
        # Get streaming response
        async for chunk in assistant_service.process_prompt_stream(
            workspace_id=workspace_id, 
            prompt=request.prompt,
            model=request.model
        ):
            if isinstance(chunk, dict):
                # Format as SSE event
                yield f"data: {json.dumps({'type': 'chunk', 'id': request.id, 'content': chunk})}\n\n"
            else:
                # Plain text chunk
                yield f"data: {json.dumps({'type': 'chunk', 'id': request.id, 'content': {'text': chunk}})}\n\n"
            
            # Small delay to prevent overwhelming the client
            await asyncio.sleep(0.01)
        
        # Signal completion
        yield f"data: {json.dumps({'type': 'end', 'id': request.id})}\n\n"
            
    except Exception as e:
        logger.error(f"Error in streaming: {str(e)}", exc_info=True)
        error_json = json.dumps({'type': 'error', 'id': request.id, 'error': str(e)})
        yield f"data: {error_json}\n\n"

@router.post("/{workspace_id}")
async def query_workspace(
    workspace_id: str,
    request: QueryRequest,
):
    """
    Query a workspace with a prompt, with optional streaming response
    """
    try:
        # Handle streaming request
        if request.stream:
            return StreamingResponse(
                event_generator(workspace_id, request),
                media_type="text/event-stream"
            )
        
        # Handle regular request
        response = await assistant_service.process_prompt(
            workspace_id=workspace_id, 
            prompt=request.prompt,
            model=request.model
        )
        return {"id": request.id, "response": response}
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 