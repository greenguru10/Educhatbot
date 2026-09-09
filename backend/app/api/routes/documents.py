import shutil
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.config import settings
from app.models import Document, DocumentChunk, SourceRegistry, Subject, User
from app.schemas import DocumentResponse, DocumentDetailResponse, DocumentPatchRequest
from app.services.ingestion_service import ingestion_service
from app.retrieval.index_manager import index_manager

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentResponse])
def list_documents(
    subject_slug: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if subject_slug:
        subject = db.query(Subject).filter(Subject.slug == subject_slug).first()
        if subject:
            query = query.filter(Document.subject_id == subject.id)
    if status_filter:
        query = query.filter(Document.status == status_filter)

    docs = query.order_by(Document.created_at.desc()).all()
    res = []
    for d in docs:
        chunk_count = db.query(DocumentChunk).filter(DocumentChunk.document_id == d.id).count()
        doc_dict = DocumentResponse.model_validate(d)
        doc_dict.chunk_count = chunk_count
        res.append(doc_dict)
    return res

@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(document_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    chunks = db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).order_by(DocumentChunk.chunk_sequence).all()
    
    resp = DocumentDetailResponse.model_validate(doc)
    resp.chunk_count = len(chunks)
    resp.chunks = chunks
    return resp

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    source_id: Optional[str] = Form(None),
    subject_slug: Optional[str] = Form("programming"),
    title: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    license: Optional[str] = Form("Educational Use"),
    db: Session = Depends(get_db)
):
    file_path = settings.RAW_DATA_DIR / file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    doc = ingestion_service.ingest_file(
        db=db,
        file_path=file_path,
        source_id=source_id,
        subject_slug=subject_slug,
        title=title,
        author=author,
        license_str=license
    )

    chunk_count = db.query(DocumentChunk).filter(DocumentChunk.document_id == doc.id).count()
    resp = DocumentResponse.model_validate(doc)
    resp.chunk_count = chunk_count
    return resp

@router.patch("/{document_id}", response_model=DocumentResponse)
def update_document(document_id: str, req: DocumentPatchRequest, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    if req.status:
        doc.status = req.status
        # Update chunks active state
        is_active = (req.status == "active")
        db.query(DocumentChunk).filter(DocumentChunk.document_id == document_id).update({"active": is_active})
    if req.superseded_by:
        doc.superseded_by = req.superseded_by
    if req.title:
        doc.title = req.title

    db.commit()
    db.refresh(doc)
    index_manager.sync_from_db(db)

    chunk_count = db.query(DocumentChunk).filter(DocumentChunk.document_id == doc.id).count()
    resp = DocumentResponse.model_validate(doc)
    resp.chunk_count = chunk_count
    return resp

@router.post("/reindex")
def reindex_all(db: Session = Depends(get_db)):
    index_manager.sync_from_db(db)
    return {"status": "reindexed", "total_chunks": len(index_manager.chunk_cache)}
