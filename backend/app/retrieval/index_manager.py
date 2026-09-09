from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import DocumentChunk, Document, SourceRegistry, Subject
from app.retrieval.bm25 import BM25Retriever
from app.retrieval.vector_store import vector_store

class IndexManager:
    def __init__(self):
        self.bm25 = BM25Retriever()
        self.chunk_cache: Dict[str, Dict[str, Any]] = {}
        self.is_ready = False

    def sync_from_db(self, db: Session) -> None:
        chunks = (
            db.query(DocumentChunk, Document, SourceRegistry, Subject)
            .join(Document, DocumentChunk.document_id == Document.id)
            .outerjoin(SourceRegistry, Document.source_id == SourceRegistry.id)
            .outerjoin(Subject, Document.subject_id == Subject.id)
            .filter(DocumentChunk.active == True, Document.status == "active")
            .all()
        )

        chunk_dicts = []
        self.chunk_cache = {}

        for c, doc, src, subj in chunks:
            item = {
                "id": c.id,
                "document_id": doc.id,
                "chunk_sequence": c.chunk_sequence,
                "title": c.title or doc.title,
                "section": c.section or "General",
                "subsection": c.subsection or "",
                "page_start": c.page_start,
                "page_end": c.page_end,
                "raw_text": c.raw_text,
                "normalized_text": c.normalized_text,
                "token_count": c.token_count,
                "topic_tags": c.topic_tags or [],
                "difficulty_level": c.difficulty_level or "beginner",
                "embedding_json": c.embedding_json,
                "active": c.active,
                "source_name": src.name if src else "Academic Library",
                "source_url": doc.source_url or (src.base_url if src else None),
                "author": doc.author or (src.name if src else None),
                "license": doc.license or (src.license_notes if src else None),
                "authority_score": src.authority_score if src else 0.90,
                "subject": subj.slug if subj else "general"
            }
            chunk_dicts.append(item)
            self.chunk_cache[c.id] = item

        self.bm25.fit(chunk_dicts)
        vector_store.rebuild(chunk_dicts)
        self.is_ready = True

index_manager = IndexManager()
