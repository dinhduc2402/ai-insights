from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Path, Depends
from typing import List
from sqlalchemy.orm import Session
from ..services.r2_service import r2_service
from ..services.file_processing_service import file_processing_service
from ..schemas.file import FileResponse, FileProcessRequest, FileProcessResponse
from ..database import get_db
from ..models.file import File as FileModel
import uuid
import logging
import io

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/upload/{workspace_id}", status_code=201)
async def upload_file(
    background_tasks: BackgroundTasks,
    workspace_id: str = Path(..., title="Workspace Name"),
    file: UploadFile = File(..., description="The file to upload"),
    db: Session = Depends(get_db),
    user_id: str = "system"  # TODO: Replace with actual user authentication
):
    """
    Upload a file to workspace:
    1. Store file in R2 storage
    2. Save file metadata to PostgreSQL
    3. Process file and store chunks in Pinecone
    """
    try:
        logger.debug(f"Starting upload for file: {file.filename} in workspace: {workspace_id}")
        if not file.filename:
            logger.debug("No file provided")
            raise HTTPException(status_code=400, detail="No file provided")

        # Read file content first before any operations
        file_content = await file.read()
        file_size = len(file_content)

        # 1. Upload to R2 (create a new bytes object from content)
        file_bytes = io.BytesIO(file_content)
        result = await r2_service.upload_file(
            file_obj=file_bytes,
            workspace_name=workspace_id,
            filename=file.filename
        )
            
        # 2. Save file metadata to PostgreSQL using the service function
        file_data = {
            'filename': file.filename,
            'file_path': result["stored_key"],
            'file_size': file_size,
            'content_type': file.content_type,
            'workspace_id': workspace_id,
            'user_id': user_id
        }
        
        try:
            file_record = await file_processing_service.save_file(db, file_data)
            logger.debug("File metadata saved to database")
        except Exception as db_error:
            logger.error(f"Error saving file to database: {str(db_error)}")
            # Continue with other operations even if database save fails
            file_record = None
        
        # 3. Process file in background for Pinecone indexing
        background_tasks.add_task(
            file_processing_service.process_file,
            workspace_id,
            result["stored_key"]
        )
        logger.debug("File processing task added to background tasks")
        
        # Create response
        if file_record:
            return {
                "message": "File uploaded successfully",
                "filename": file_record.filename,
                "file_id": str(file_record.id),
                "workspace_id": str(file_record.workspace_id),
                "processing_status": "started"
            }
        else:
            return {
                "message": "File uploaded successfully but metadata could not be saved",
                "filename": file.filename,
                "workspace_id": str(workspace_id),
                "processing_status": "started"
            }
    except Exception as e:
        logger.error(f"Error during file upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await file.close()
        logger.debug(f"File {file.filename} closed after upload process")

@router.get("/{workspace_id}", response_model=List[FileResponse])
async def list_files(
    workspace_id: str = Path(..., title="Workspace Name"),
    db: Session = Depends(get_db)
):
    """List files in a workspace"""
    try:
        # Get files from the database instead of directly from R2
        files = db.query(FileModel).filter(FileModel.workspace_id == workspace_id).all()
        return [
            FileResponse(
                id=str(file.id),
                filename=file.filename,
                content_type=file.content_type,
                file_size=file.file_size,
                workspace_id=str(file.workspace_id),
                created_at=file.created_at
            )
            for file in files
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{workspace_id}/process-file", response_model=FileProcessResponse, status_code=202)
async def process_file(
    background_tasks: BackgroundTasks,
    workspace_id: str = Path(..., title="Workspace Name"),
    request: FileProcessRequest = None
):
    """Process a file and store its embeddings in Pinecone"""
    try:
        if not request.file_key:
            raise HTTPException(status_code=400, detail="file_key is required in request body")

        # Add the processing task to background tasks
        background_tasks.add_task(
            file_processing_service.process_file,
            workspace_id,
            request.file_key,
            request.index_name
        )

        return FileProcessResponse(
            message="File processing started in background",
            workspace=workspace_id,
            file_key=request.file_key,
            index_name=request.index_name
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 