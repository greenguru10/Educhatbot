from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import SourceRegistry, Subject, Document
from app.schemas import SourceRegistryResponse, SubjectResponse

router = APIRouter(tags=["Sources & Subjects"])

@router.get("/sources", response_model=List[SourceRegistryResponse])
def list_sources(db: Session = Depends(get_db)):
    sources = db.query(SourceRegistry).all()
    res = []
    for s in sources:
        doc_count = db.query(Document).filter(Document.source_id == s.id).count()
        item = SourceRegistryResponse.model_validate(s)
        item.document_count = doc_count
        res.append(item)
    return res

@router.get("/subjects", response_model=List[SubjectResponse])
def list_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).all()
    res = []
    for s in subjects:
        doc_count = db.query(Document).filter(Document.subject_id == s.id).count()
        item = SubjectResponse.model_validate(s)
        item.document_count = doc_count
        res.append(item)
    return res
