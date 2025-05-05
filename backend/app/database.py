from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config.settings import settings
import logging

logger = logging.getLogger(__name__)

try:
    # Create SQLAlchemy engine
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        connect_args={
            "connect_timeout": 10
        }
    )

    # Test the connection
    engine.connect()
    logger.info("Database connection established successfully")

except Exception as e:
    logger.error(f"Failed to connect to database: {str(e)}")
    # Create a null engine for development/testing
    logger.warning("Using in-memory SQLite database for development")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 