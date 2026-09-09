import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory for the repository
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "LearnWise Educational RAG"
    APP_ENV: str = "development"
    API_PREFIX: str = "/api/v1"
    VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'data' / 'app.db'}"

    # Security & Auth
    JWT_SECRET: str = "learnwise-super-secret-jwt-key-2026-development-token"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ADMIN_API_KEY: str = "learnwise-admin-secret-key-2026"

    # LLM Settings
    LLM_PROVIDER: str = "mock"  # mock, openai_compatible, gemini, ollama
    LLM_API_KEY: str = ""
    LLM_FALLBACK_API_KEYS: str = ""
    LLM_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_TEMPERATURE: float = 0.2
    LLM_MAX_OUTPUT_TOKENS: int = 1200
    LLM_TIMEOUT_SECONDS: int = 35

    # Embeddings & Retrieval
    EMBEDDING_PROVIDER: str = "local"  # local (TF-IDF/cosine similarity), openai
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    RETRIEVAL_CANDIDATE_K: int = 40
    RERANK_TOP_N: int = 30
    FINAL_EVIDENCE_K: int = 4
    MIN_RETRIEVAL_SCORE: float = 0.15
    MIN_GROUNDING_SCORE: float = 0.50

    # Paths
    BASE_DIR: Path = BASE_DIR
    DATA_DIR: Path = BASE_DIR / "data"
    RAW_DATA_DIR: Path = BASE_DIR / "data" / "raw"
    PROCESSED_DATA_DIR: Path = BASE_DIR / "data" / "processed"
    INDEXES_DIR: Path = BASE_DIR / "data" / "indexes"
    CONFIGS_DIR: Path = BASE_DIR / "configs"

    # File uploads & limits
    MAX_UPLOAD_MB: int = 25
    MAX_QUERY_LENGTH: int = 1500
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://learnwise.vercel.app",
        "*"
    ]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure required directories exist
for path in [settings.DATA_DIR, settings.RAW_DATA_DIR, settings.PROCESSED_DATA_DIR, settings.INDEXES_DIR]:
    path.mkdir(parents=True, exist_ok=True)
