from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Path, Form
from typing import List
from ..services.r2_service import r2_service
from ..services.file_processing_service import file_processing_service
from ..schemas.file import FileResponse, FileProcessRequest, FileProcessResponse

router = APIRouter(prefix="/api/v1")

@router.post("/workspaces/{workspace_name}/files", response_model=FileResponse, status_code=201)
async def upload_file(
    workspace_name: str = Path(..., title="Workspace Name"),
    file: UploadFile = File(..., description="The file to upload")
):
    """Upload a file to R2"""
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        result = await r2_service.upload_file(
            file_obj=file.file,
            workspace_name=workspace_name,
            filename=file.filename
        )
        return FileResponse(
            filename=file.filename,
            content_type=file.content_type,
            key=result["stored_key"],
            bucket=result["bucket"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await file.close()

@router.get("/workspaces/{workspace_name}/files", response_model=List[FileResponse])
async def list_files(workspace_name: str = Path(..., title="Workspace Name")):
    """List files in a workspace"""
    try:
        files = await r2_service.list_files(workspace_name)
        return [
            FileResponse(
                filename=file["name"],
                key=file["key"],
                size=file["size"],
                last_modified=file["last_modified"]
            )
            for file in files
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/workspaces/{workspace_name}/process-file", response_model=FileProcessResponse, status_code=202)
async def process_file(
    background_tasks: BackgroundTasks,
    workspace_name: str = Path(..., title="Workspace Name"),
    request: FileProcessRequest = None
):
    """Process a file and store its embeddings in Pinecone"""
    try:
        if not request.file_key:
            raise HTTPException(status_code=400, detail="file_key is required in request body")

        # Add the processing task to background tasks
        background_tasks.add_task(
            file_processing_service.process_file,
            workspace_name,
            request.file_key,
            request.index_name
        )

        return FileProcessResponse(
            message="File processing started in background",
            workspace=workspace_name,
            file_key=request.file_key,
            index_name=request.index_name
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 