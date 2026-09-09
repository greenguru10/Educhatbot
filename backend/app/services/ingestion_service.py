import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models import Document, DocumentChunk, SourceRegistry, Subject
from app.ingestion.cleaner import clean_text
from app.ingestion.chunker import chunker
from app.ingestion.parsers import TextParser, MarkdownParser, HTMLParser, PDFParser
from app.retrieval.index_manager import index_manager
from app.retrieval.embeddings import embedding_client

class IngestionService:
    def parse_file(self, file_path: Path) -> str:
        ext = file_path.suffix.lower()
        if ext in [".md", ".markdown"]:
            return MarkdownParser.parse_markdown(file_path)
        elif ext in [".html", ".htm"]:
            return HTMLParser.parse_html(file_path)
        elif ext == ".pdf":
            return PDFParser.parse_pdf(file_path)
        else:
            return TextParser.parse_text(file_path)

    def ingest_file(
        self,
        db: Session,
        file_path: Path,
        source_id: Optional[str] = None,
        subject_slug: Optional[str] = None,
        title: Optional[str] = None,
        author: Optional[str] = None,
        license_str: Optional[str] = None,
        source_url: Optional[str] = None
    ) -> Document:
        raw_content = self.parse_file(file_path)
        cleaned = clean_text(raw_content)
        content_hash = hashlib.sha256(cleaned.encode("utf-8")).hexdigest()

        # Check existing
        existing = db.query(Document).filter(Document.content_hash == content_hash).first()
        if existing:
            return existing

        # Find subject
        subject_obj = None
        if subject_slug:
            subject_obj = db.query(Subject).filter(Subject.slug == subject_slug).first()

        doc_title = title or file_path.stem.replace("_", " ").title()

        doc = Document(
            source_id=source_id,
            subject_id=subject_obj.id if subject_obj else None,
            title=doc_title,
            author=author,
            document_type="course_note" if file_path.suffix == ".md" else "documentation",
            source_url=source_url,
            license=license_str,
            local_path=str(file_path),
            content_hash=content_hash,
            status="active",
            extracted_text=cleaned[:2000]
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        # Generate chunks
        raw_chunks = chunker.chunk_document(
            document_id=doc.id,
            doc_title=doc.title,
            full_text=cleaned,
            subject=subject_slug or "general"
        )

        for rc in raw_chunks:
            # Generate embedding
            text_for_emb = rc["raw_text"] + " " + rc.get("title", "")
            emb = embedding_client.embed_text(text_for_emb)

            chunk_obj = DocumentChunk(
                document_id=doc.id,
                chunk_sequence=rc["chunk_sequence"],
                title=rc["title"],
                section=rc["section"],
                subsection=rc["subsection"],
                raw_text=rc["raw_text"],
                normalized_text=rc["normalized_text"],
                token_count=rc["token_count"],
                topic_tags=rc["topic_tags"],
                difficulty_level=rc["difficulty_level"],
                embedding_json=emb,
                active=True
            )
            db.add(chunk_obj)

        db.commit()
        
        # Refresh in-memory retrieval index
        index_manager.sync_from_db(db)
        return doc

ingestion_service = IngestionService()
