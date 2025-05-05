import os
import logging
from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec
from ..config.settings import settings

logger = logging.getLogger(__name__)

class PineconeService:
    def __init__(self):
        self._init_pinecone()
        self.index_name = "ai-insights"
        self.dimension = 1536  # Default dimension for OpenAI embeddings
        self.metric = "cosine"
        self._ensure_index_exists()

    def _init_pinecone(self):
        """Initialize Pinecone client"""
        try:
            self.pc = Pinecone(
                api_key=settings.PINECONE_API_KEY
            )
            logger.info("Pinecone client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Pinecone client: {e}")
            raise

    def _ensure_index_exists(self):
        """Ensure the default index exists, create if it doesn't"""
        try:
            if self.index_name not in self.pc.list_indexes().names():
                self.pc.create_index(
                    name=self.index_name,
                    dimension=self.dimension,
                    metric=self.metric,
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )
                logger.info(f"Created Pinecone index: {self.index_name}")
            else:
                # Check if existing index has correct dimensions
                index = self.pc.Index(self.index_name)
                index_description = index.describe_index_stats()
                if index_description.dimension != self.dimension:
                    logger.warning(f"Existing index has dimension {index_description.dimension}, recreating with dimension {self.dimension}")
                    self.pc.delete_index(self.index_name)
                    self.pc.create_index(
                        name=self.index_name,
                        dimension=self.dimension,
                        metric=self.metric,
                        spec=ServerlessSpec(
                            cloud='aws',
                            region='us-east-1'
                        )
                    )
                    logger.info(f"Recreated Pinecone index: {self.index_name} with correct dimensions")
                else:
                    logger.info(f"Pinecone index {self.index_name} already exists with correct dimensions")
        except Exception as e:
            logger.error(f"Failed to ensure index exists: {e}")
            raise

    def upsert_vectors(self, vectors: List[Dict[str, Any]], namespace: Optional[str] = None):
        """Upsert vectors to Pinecone index"""
        try:
            index = self.pc.Index(self.index_name)
            index.upsert(vectors=vectors, namespace=namespace)
            logger.info(f"Successfully upserted {len(vectors)} vectors to namespace {namespace}")
        except Exception as e:
            logger.error(f"Failed to upsert vectors: {e}")
            raise

    def query_vectors(self, vector: List[float], top_k: int = 5, namespace: Optional[str] = None) -> List[Dict[str, Any]]:
        """Query vectors from Pinecone index"""
        try:
            index = self.pc.Index(self.index_name)
            results = index.query(
                vector=vector,
                top_k=top_k,
                namespace=namespace,
                include_metadata=True
            )
            return results.matches
        except Exception as e:
            logger.error(f"Failed to query vectors: {e}")
            raise

    def delete_vectors(self, ids: List[str], namespace: Optional[str] = None):
        """Delete vectors from Pinecone index"""
        try:
            index = self.pc.Index(self.index_name)
            index.delete(ids=ids, namespace=namespace)
            logger.info(f"Successfully deleted {len(ids)} vectors from namespace {namespace}")
        except Exception as e:
            logger.error(f"Failed to delete vectors: {e}")
            raise

# Initialize the service
pinecone_service = PineconeService() 