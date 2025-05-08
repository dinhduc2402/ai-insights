import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app.models.user import User
from app.models.workspace import Workspace
from app.models.job import Job, JobStatus
from app.utils.security import get_password_hash
import logging
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_database():
    """Seed the database with sample data"""
    try:
        db = SessionLocal()
        
        # Add users
        logger.info("Creating sample users...")
        admin_user = User(
            id=str(uuid.uuid4()),
            email="admin@example.com",
            username="admin",
            hashed_password=get_password_hash("adminpassword"),
            is_superuser=True
        )
        
        test_user = User(
            id=str(uuid.uuid4()),
            email="user@example.com",
            username="testuser",
            hashed_password=get_password_hash("userpassword")
        )
        
        db.add(admin_user)
        db.add(test_user)
        db.commit()
        
        # Add workspaces
        logger.info("Creating sample workspaces...")
        workspace1 = Workspace(
            id=str(uuid.uuid4()),
            name="Research Project",
            description="Workspace for research-related documents and analysis"
        )
        
        workspace2 = Workspace(
            id=str(uuid.uuid4()),
            name="Marketing Content",
            description="Workspace for marketing materials and content"
        )
        
        db.add(workspace1)
        db.add(workspace2)
        db.commit()
        
        # Add jobs
        logger.info("Creating sample jobs...")
        job1 = Job(
            id=str(uuid.uuid4()),
            name="Text Analysis",
            description="Analyze research papers for key insights",
            status=JobStatus.COMPLETED,
            result="Found 5 key insights in the research papers",
            workspace_id=workspace1.id,
            user_id=admin_user.id
        )
        
        job2 = Job(
            id=str(uuid.uuid4()),
            name="Content Generation",
            description="Generate blog post ideas",
            status=JobStatus.RUNNING,
            workspace_id=workspace2.id,
            user_id=test_user.id
        )
        
        job3 = Job(
            id=str(uuid.uuid4()),
            name="Data Import",
            description="Import documents for analysis",
            status=JobStatus.PENDING,
            workspace_id=workspace1.id,
            user_id=test_user.id
        )
        
        db.add(job1)
        db.add(job2)
        db.add(job3)
        db.commit()
        
        logger.info("Database seeded successfully!")
        
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 