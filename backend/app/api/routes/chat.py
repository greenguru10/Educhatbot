from fastapi import APIRouter, Depends, Security
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services.chat_service import chat_service
from app.core.security import decode_access_token, security_bearer
from fastapi.security import HTTPAuthorizationCredentials

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def post_chat(
    req: ChatRequest,
    auth: Optional[HTTPAuthorizationCredentials] = Security(security_bearer),
    db: Session = Depends(get_db)
):
    user_id = None
    if auth:
        payload = decode_access_token(auth.credentials)
        if payload:
            user_id = payload.get("sub")
    if not user_id and req.user_id:
        user_id = req.user_id

    return await chat_service.process_chat(db=db, req=req, user_id=user_id)
