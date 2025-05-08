import tempfile
import logging
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from .r2_service import r2_service
from .pinecone_service import pinecone_service

logger = logging.getLogger(__name__)

class FileProcessingService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()

    async def process_file(self, workspace_name: str, file_key: str):
        """Process a file from R2 and store its embeddings in Pinecone"""
        try:
            # Download file from R2
            file_content = await r2_service.download_file(file_key)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_content)
                temp_file_path = temp_file.name

            try:
                # Load and process the file
                loader = TextLoader(temp_file_path)
                documents = loader.load()

                # Split text into chunks
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=1000,
                    chunk_overlap=200
                )
                chunks = text_splitter.split_documents(documents)

                # Create vectors for Pinecone
                vectors = []
                for i, chunk in enumerate(chunks):
                    # Generate embedding for the chunk
                    embedding = self.embeddings.embed_query(chunk.page_content)
                    
                    # Create vector with metadata
                    vector = {
                        "id": f"{file_key}-chunk-{i}",
                        "values": embedding,
                        "metadata": {
                            "text": chunk.page_content,
                            "source": file_key,
                            "workspace": workspace_name
                        }
                    }
                    vectors.append(vector)

                # Upsert vectors to Pinecone
                pinecone_service.upsert_vectors(vectors, namespace=workspace_name)

                logger.info(f"Successfully processed file {file_key} and stored {len(vectors)} chunks in Pinecone")
                return True

            finally:
                # Clean up temporary file
                import os
                os.unlink(temp_file_path)

        except Exception as e:
            logger.error(f"Error processing file {file_key}: {str(e)}", exc_info=True)
            raise

file_processing_service = FileProcessingService() 