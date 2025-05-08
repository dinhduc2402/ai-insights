import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import Base, engine
from app.models.user import User
from app.models.job import Job, JobStatus
from app.models.workspace import Workspace
from app.models.prompt import Prompt
from app.config.settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_tables():
    """Create all database tables"""
    try:
        logger.info(f"Creating database tables using {settings.DATABASE_URL}...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        logger.info("Tables created successfully!")
        logger.info("The following tables were created:")
        for table in Base.metadata.tables:
            logger.info(f"- {table}")
            
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
        raise

if __name__ == "__main__":
    create_tables() 