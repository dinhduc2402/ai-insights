import logging
from typing import List, Dict, Any, AsyncGenerator
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from ..services.pinecone_service import pinecone_service
from ..config.settings import settings

logger = logging.getLogger(__name__)

class AssistantService:
    def __init__(self):
        # Models configuration
        self.models = {
            "gpt-3.5-turbo": self._create_openai_model("gpt-3.5-turbo"),
            "gpt-4": self._create_openai_model("gpt-4"),
            "gpt-4o": self._create_openai_model("gpt-4o"),
            "claude-3-sonnet": self._create_anthropic_model("claude-3-sonnet"),
            "claude-3-opus": self._create_anthropic_model("claude-3-opus"),
        }
        
        self.default_model = "gpt-3.5-turbo"
        
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            api_key=settings.OPENAI_API_KEY
        )
        
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that answers questions based on the provided context. Use the context to provide accurate and relevant answers."),
            ("human", "Context: {context}\n\nQuestion: {question}")
        ])

    def _create_openai_model(self, model_name: str):
        """Create an OpenAI model instance"""
        return ChatOpenAI(
            model_name=model_name,
            temperature=0.7,
            streaming=True,
            api_key=settings.OPENAI_API_KEY
        )
        
    def _create_anthropic_model(self, model_name: str):
        """Create an Anthropic model instance"""
        return ChatAnthropic(
            model_name=model_name,
            temperature=0.7,
            streaming=True,
            anthropic_api_key=settings.ANTHROPIC_API_KEY
        )
        
    def _get_model(self, model_name: str):
        """Get the appropriate model"""
        if model_name in self.models:
            return self.models[model_name]
        logger.warning(f"Model {model_name} not found, using default {self.default_model}")
        return self.models[self.default_model]

    async def process_prompt(self, workspace_id: str, prompt: str, model: str = None) -> str:
        """
        Process a prompt using the workspace context from Pinecone
        """
        try:
            # Get relevant context from Pinecone
            context = await self._get_relevant_context(workspace_id, prompt)
            
            # Get the appropriate model
            llm = self._get_model(model or self.default_model)
            
            # Create a new chain with the selected model
            chain = (
                {"context": RunnablePassthrough(), "question": RunnablePassthrough()}
                | self.prompt_template
                | llm
                | StrOutputParser()
            )
            
            # Process the prompt with the context
            response = await chain.ainvoke(
                {"context": context, "question": prompt}
            )
            
            return response
        except Exception as e:
            logger.error(f"Error processing prompt: {str(e)}", exc_info=True)
            raise

    async def process_prompt_stream(self, workspace_id: str, prompt: str, model: str = None) -> AsyncGenerator[str, None]:
        """
        Process a prompt using the workspace context from Pinecone and stream the response
        """
        try:
            # Get relevant context from Pinecone
            context = await self._get_relevant_context(workspace_id, prompt)
            
            # Get the appropriate model
            llm = self._get_model(model or self.default_model)
            
            # Set streaming to true
            if hasattr(llm, "streaming"):
                llm.streaming = True
            
            # Create a new chain with the selected model
            chain = (
                {"context": RunnablePassthrough(), "question": RunnablePassthrough()}
                | self.prompt_template
                | llm
                | StrOutputParser()
            )
            
            # Process the prompt with streaming
            async for chunk in chain.astream(
                {"context": context, "question": prompt}
            ):
                yield chunk
                
        except Exception as e:
            logger.error(f"Error processing streaming prompt: {str(e)}", exc_info=True)
            yield {"error": str(e)}
            raise

    async def _get_relevant_context(self, workspace_name: str, prompt: str) -> str:
        """
        Get relevant context from Pinecone based on the prompt
        """
        try:
            # Get embeddings for the prompt
            embeddings = await self.embeddings.aembed_query(prompt)
            
            # Query Pinecone for relevant documents
            results = pinecone_service.query_vectors(
                vector=embeddings,
                top_k=5,
                namespace=workspace_name
            )
            
            # Combine the relevant text chunks
            context = "\n".join([match.metadata["text"] for match in results])
            return context
        except Exception as e:
            logger.error(f"Error getting context: {str(e)}", exc_info=True)
            raise

# Initialize the service
assistant_service = AssistantService() 