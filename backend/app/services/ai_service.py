from typing import List, Dict
import openai
from ..config.settings import settings
from ..schemas.ai_processing import Prompt, AIProcessingResponse
from datetime import datetime
import uuid

class AIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY

    async def process_text(self, text: str, model: str = "gpt-4", temperature: float = 0.7) -> AIProcessingResponse:
        # First, analyze the text to break it down into meaningful prompts
        system_prompt = """
        Analyze the following text and break it down into meaningful prompts.
        For each prompt, identify its category (e.g., 'question', 'task', 'idea', 'observation').
        Also provide a brief summary of the overall text.
        Return the response in JSON format with the following structure:
        {
            "prompts": [
                {
                    "id": "unique_id",
                    "text": "prompt text",
                    "category": "category name"
                }
            ],
            "summary": "brief summary"
        }
        """

        response = await openai.ChatCompletion.acreate(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=temperature
        )

        # Parse the response and create Prompt objects
        result = response.choices[0].message.content
        parsed_result = eval(result)  # In production, use proper JSON parsing with error handling

        prompts = [
            Prompt(
                id=str(uuid.uuid4()),
                text=prompt["text"],
                category=prompt["category"],
                created_at=datetime.now()
            )
            for prompt in parsed_result["prompts"]
        ]

        return AIProcessingResponse(
            prompts=prompts,
            summary=parsed_result["summary"],
            created_at=datetime.now()
        )

    async def stream_response(self, text: str, model: str = "gpt-4", temperature: float = 0.7):
        """Stream the AI response for chat-like interaction"""
        response = await openai.ChatCompletion.acreate(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": text}
            ],
            temperature=temperature,
            stream=True
        )

        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content 