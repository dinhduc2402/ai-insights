from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config.settings import settings
import logging
from typing import Generator

logger = logging.getLogger(__name__)

# PostgreSQL connection settings
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
if SQLALCHEMY_DATABASE_URL.startswith('postgresql'):
    try:
        # Create PostgreSQL engine with appropriate settings
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_pre_ping=True,  # Enable automatic reconnection
            pool_size=5,         # Maximum number of connections in the pool
            max_overflow=10,     # Maximum number of connections that can be created beyond pool_size
            pool_timeout=30,     # Timeout for getting connection from pool
            connect_args={
                "connect_timeout": 10,  # Connection timeout in seconds
                "application_name": "ai-insights"  # Application identifier in PostgreSQL
            }
        )
        
        # Test the connection
        engine.connect()
        logger.info("Successfully connected to PostgreSQL database")
        
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {str(e)}")
        raise
else:
    logger.error("Invalid DATABASE_URL: Must start with 'postgresql'")
    raise ValueError("Database URL must be a PostgreSQL connection string")

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db() -> Generator:
    """
    Dependency function to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()