from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
from app.core.config import settings
from app.core.logging import logger
from app.database.base import Base

def build_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    connect_args = {}
    if db_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    try:
        eng = create_engine(
            db_url,
            connect_args=connect_args,
            echo=False,
            pool_pre_ping=True
        )
        # Test connection
        with eng.connect() as conn:
            pass
        return eng
    except Exception as e:
        logger.warning(f"Remote PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
        sqlite_url = f"sqlite:///{settings.DATA_DIR / 'app.db'}"
        return create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},
            echo=False
        )

engine = build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db() -> None:
    Base.metadata.create_all(bind=engine)
