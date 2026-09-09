from fastapi import APIRouter
from app.api.routes.auth import router as auth_router
from app.api.routes.chat import router as chat_router
from app.api.routes.documents import router as documents_router
from app.api.routes.quiz import router as quiz_router
from app.api.routes.sources import router as sources_router
from app.api.routes.health_sessions_feedback import (
    feedback_router,
    sessions_router,
    health_router
)

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(chat_router)
api_router.include_router(documents_router)
api_router.include_router(quiz_router)
api_router.include_router(sources_router)
api_router.include_router(feedback_router)
api_router.include_router(sessions_router)
