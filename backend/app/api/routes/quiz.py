from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas import QuizGenerateRequest, QuizQuestion, FlashcardsRequest, FlashcardsResponse
from app.services.quiz_service import quiz_service

router = APIRouter(tags=["Study Tools"])

@router.post("/quiz", response_model=List[QuizQuestion])
def generate_quiz(req: QuizGenerateRequest, db: Session = Depends(get_db)):
    return quiz_service.generate_quiz(db=db, req=req)

@router.post("/flashcards", response_model=FlashcardsResponse)
def generate_flashcards(req: FlashcardsRequest, db: Session = Depends(get_db)):
    return quiz_service.generate_flashcards(db=db, req=req)
