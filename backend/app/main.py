import yaml
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.database.session import init_db, SessionLocal
from app.models import SourceRegistry, Subject, User
from app.core.security import hash_password
from app.api.router import api_router
from app.retrieval.index_manager import index_manager
from app.services.ingestion_service import ingestion_service

def seed_defaults() -> None:
    db = SessionLocal()
    try:
        # 1. Seed Source Registry and Subjects from YAML
        source_config_path = settings.CONFIGS_DIR / "source_registry.yaml"
        if source_config_path.exists():
            with open(source_config_path, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f) or {}
                
                # Sources
                for s in data.get("sources", []):
                    existing = db.query(SourceRegistry).filter(SourceRegistry.id == s["id"]).first()
                    if not existing:
                        sr = SourceRegistry(
                            id=s["id"],
                            name=s["name"],
                            base_url=s.get("base_url"),
                            authority_level=s.get("authority_level", "A"),
                            authority_score=s.get("authority_score", 0.95),
                            license_notes=s.get("license_notes"),
                            active=s.get("active", True)
                        )
                        db.add(sr)
                
                # Subjects
                for subj in data.get("subjects", []):
                    existing_subj = db.query(Subject).filter(Subject.slug == subj["slug"]).first()
                    if not existing_subj:
                        sb = Subject(
                            slug=subj["slug"],
                            display_name=subj["display_name"],
                            description=subj.get("description"),
                            active=subj.get("active", True)
                        )
                        db.add(sb)

        # 2. Seed Default Admin User
        admin = db.query(User).filter(User.email == "admin@learnwise.edu").first()
        if not admin:
            admin = User(
                email="admin@learnwise.edu",
                display_name="System Admin",
                password_hash=hash_password("Admin@12345"),
                role="admin"
            )
            db.add(admin)

        db.commit()

        # 3. Ingest raw educational documents if any exist in data/raw
        for raw_file in settings.RAW_DATA_DIR.glob("*.*"):
            if raw_file.is_file() and raw_file.suffix.lower() in [".md", ".txt", ".html", ".pdf"]:
                # Determine subject from filename or content
                stem = raw_file.stem.lower()
                subj_slug = "programming"
                if "dsa" in stem or "algorithm" in stem or "tree" in stem or "database" in stem or "dbms" in stem or "network" in stem or "osi" in stem or "tcp" in stem:
                    subj_slug = "computer_science"
                elif "ai" in stem or "neural" in stem or "machine_learning" in stem:
                    subj_slug = "artificial_intelligence"
                elif "math" in stem or "calculus" in stem or "linear" in stem or "bayes" in stem:
                    subj_slug = "mathematics"
                elif "physics" in stem or "mechanics" in stem or "gravity" in stem:
                    subj_slug = "physics"
                elif "security" in stem or "owasp" in stem:
                    subj_slug = "cybersecurity_fundamentals"
                elif "cloud" in stem or "docker" in stem or "aws" in stem:
                    subj_slug = "cloud_computing"
                elif "english" in stem or "writing" in stem:
                    subj_slug = "english_communication"
                elif "study" in stem or "recall" in stem or "revision" in stem:
                    subj_slug = "study_skills"
                elif "career" in stem or "interview" in stem:
                    subj_slug = "career_learning"

                ingestion_service.ingest_file(
                    db=db,
                    file_path=raw_file,
                    source_id="src_openstax_cs" if "dsa" in stem else "src_python_docs",
                    subject_slug=subj_slug,
                    title=raw_file.stem.replace("_", " ").title(),
                    author="LearnWise Academic Consortium",
                    license_str="Creative Commons Attribution 4.0 (CC BY 4.0)"
                )

        # 4. Sync Index Manager
        index_manager.sync_from_db(db)
        logger.info(f"Startup complete: Loaded {len(index_manager.chunk_cache)} evidence chunks.")
    except Exception as e:
        logger.error(f"Error during startup seeding: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing LearnWise Educational RAG Database...")
    init_db()
    seed_defaults()
    yield
    logger.info("Shutting down LearnWise backend.")

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        openapi_url="/openapi.json"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router, prefix=settings.API_PREFIX)

    @app.get("/")
    @app.head("/")
    @app.get("/ping")
    @app.get("/healthz")
    def root_health():
        return {
            "status": "ok",
            "app": settings.APP_NAME,
            "version": settings.VERSION,
            "docs": "/docs",
            "api_prefix": settings.API_PREFIX
        }

    return app

app = create_app()
