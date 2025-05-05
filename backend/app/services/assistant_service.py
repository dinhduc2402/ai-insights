import logging
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from ..services.pinecone_service import pinecone_service
from ..config.settings import settings

logger = logging.getLogger(__name__)

class AssistantService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            temperature=0.7,
            api_key=settings.OPENAI_API_KEY
        )
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            api_key=settings.OPENAI_API_KEY
        )
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that answers questions based on the provided context. Use the context to provide accurate and relevant answers."),
            ("human", "Context: {context}\n\nQuestion: {question}")
        ])
        self.chain = (
            {"context": RunnablePassthrough(), "question": RunnablePassthrough()}
            | self.prompt_template
            | self.llm
            | StrOutputParser()
        )

    async def process_prompt(self, workspace_name: str, prompt: str) -> str:
        """
        Process a prompt using the workspace context from Pinecone
        """
        try:
            # Get relevant context from Pinecone
            context = await self._get_relevant_context(workspace_name, prompt)
            
            # Process the prompt with the context
            response = await self.chain.ainvoke(
                {"context": context, "question": prompt}
            )
            
            return response
        except Exception as e:
            logger.error(f"Error processing prompt: {str(e)}", exc_info=True)
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