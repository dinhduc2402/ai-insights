from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AITextRequest(BaseModel):
    text: str
    model: Optional[str] = "gpt-4"  # Default to GPT-4
    temperature: Optional[float] = 0.7

class Prompt(BaseModel):
    id: str
    text: str
    category: str
    created_at: datetime

class AIProcessingResponse(BaseModel):
    prompts: List[Prompt]
    summary: str
    created_at: datetime 