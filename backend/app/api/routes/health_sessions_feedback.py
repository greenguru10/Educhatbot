from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import Feedback, ChatSession, Message, Answer
from app.schemas import FeedbackRequest, FeedbackResponse
from app.retrieval.index_manager import index_manager

feedback_router = APIRouter(prefix="/feedback", tags=["Feedback"])

@feedback_router.post("", response_model=FeedbackResponse)
def submit_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    fb = Feedback(
        answer_id=req.answer_id,
        rating=req.rating,
        feedback_type=req.feedback_type or "helpful",
        comment=req.comment
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return FeedbackResponse(id=fb.id, status="success")

sessions_router = APIRouter(prefix="/sessions", tags=["Sessions"])

@sessions_router.get("")
def list_sessions(user_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ChatSession)
    if user_id:
        query = query.filter(ChatSession.user_id == user_id)
    sessions = query.order_by(ChatSession.updated_at.desc()).limit(40).all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "subject": s.subject,
            "learner_level": s.learner_level,
            "created_at": s.created_at
        }
        for s in sessions
    ]

@sessions_router.get("/{session_id}")
def get_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    messages = db.query(Message).filter(Message.session_id == session_id).order_by(Message.created_at).all()
    return {
        "session": {
            "id": session.id,
            "title": session.title,
            "subject": session.subject,
            "learner_level": session.learner_level,
            "created_at": session.created_at
        },
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "metadata": m.metadata_json,
                "created_at": m.created_at
            }
            for m in messages
        ]
    }

@sessions_router.delete("/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if session:
        db.delete(session)
        db.commit()
    return {"status": "deleted"}

health_router = APIRouter(tags=["Health"])

@health_router.get("/health")
def health_check():
    return {
        "status": "ok",
        "database": "ready",
        "bm25_index": "ready" if index_manager.is_ready else "initializing",
        "vector_index": "ready" if index_manager.is_ready else "initializing",
        "llm_gateway": "ready",
        "total_indexed_chunks": len(index_manager.chunk_cache),
        "version": "1.0.0"
    }
