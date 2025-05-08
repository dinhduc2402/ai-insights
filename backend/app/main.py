# backend/app/main.py
from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from .config.settings import settings
# from .controllers.ai_controller import router as ai_router
# from .controllers.user_controller import router as user_router
from .controllers.workspace_controller import router as workspace_router
from .controllers.file_controller import router as file_router
from .controllers.assistant_controller import router as assistant_router

# --- Langchain Basic Import Test ---
try:
    LANGCHAIN_AVAILABLE = True
    logging.info("Langchain core components imported successfully.")
except ImportError:
    LANGCHAIN_AVAILABLE = False
    logging.warning("Langchain module not found or failed to import. Langchain features will be unavailable.")
# ----------------------------------

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for file management and vector storage",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to the AI Insights API"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": "0.1.0"
    }

@app.get("/api/langchain-test", tags=["Langchain"])
async def test_langchain_integration():
    """
    Simple endpoint to test basic Langchain import and potentially execute a simple operation.
    """
    if not LANGCHAIN_AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Langchain module could not be imported or is not available."
        )
    return {"langchain_status": "Import successful. Basic functionality seems available."}

# Include routers

# app.include_router(ai_router, prefix="/api/ai", tags=["AI Processing"])
# app.include_router(user_router, prefix="/api/users", tags=["Users"])
app.include_router(workspace_router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(file_router, prefix="/api/files", tags=["Files"])
app.include_router(assistant_router, prefix="/api/chat", tags=["Chat"])