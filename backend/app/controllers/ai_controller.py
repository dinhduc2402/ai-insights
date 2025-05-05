from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from ..schemas.ai_processing import AITextRequest, AIProcessingResponse
from ..services.ai_service import AIService
from ..database import get_db
from ..models.prompt import Prompt
import asyncio

router = APIRouter()
ai_service = AIService()

@router.post("/process", response_model=AIProcessingResponse)
async def process_text(request: AITextRequest, db: Session = Depends(get_db)):
    try:
        # Process the text using AI
        result = await ai_service.process_text(
            text=request.text,
            model=request.model,
            temperature=request.temperature
        )

        # Save prompts to database
        for prompt in result.prompts:
            db_prompt = Prompt(
                id=prompt.id,
                text=prompt.text,
                category=prompt.category,
                workspace_id=request.workspace_id  # You'll need to add this to the request schema
            )
            db.add(db_prompt)
        
        db.commit()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def stream_response(request: AITextRequest):
    async def generate():
        async for chunk in ai_service.stream_response(
            text=request.text,
            model=request.model,
            temperature=request.temperature
        ):
            yield f"data: {chunk}\n\n"
            await asyncio.sleep(0.1)  # Add small delay to prevent overwhelming the client

    return StreamingResponse(
        generate(),
        media_type="text/event-stream"
    ) 