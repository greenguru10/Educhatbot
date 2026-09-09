import uuid
import datetime
from datetime import timezone
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database.base import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime.datetime:
    return datetime.datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(320), unique=True, index=True, nullable=True)
    display_name = Column(String(120), nullable=True)
    password_hash = Column(Text, nullable=True)
    role = Column(String(20), default="student", nullable=False)  # student, teacher, admin
    status = Column(String(20), default="active", nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="uploader")

class SourceRegistry(Base):
    __tablename__ = "source_registry"

    id = Column(String(64), primary_key=True)  # e.g., src_python_docs
    name = Column(String(255), unique=True, nullable=False)
    base_url = Column(Text, nullable=True)
    authority_level = Column(String(5), default="A")  # A, B, C, D
    authority_score = Column(Float, default=0.90)  # 0.0 - 1.0
    license_notes = Column(Text, nullable=True)
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    documents = relationship("Document", back_populates="source")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slug = Column(String(80), unique=True, index=True, nullable=False)
    display_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    active = Column(Boolean, default=True, nullable=False)

    documents = relationship("Document", back_populates="subject")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    source_id = Column(String(64), ForeignKey("source_registry.id"), nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=True)
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(500), nullable=False)
    author = Column(String(500), nullable=True)
    document_type = Column(String(80), default="documentation", nullable=False)
    source_url = Column(Text, nullable=True)
    license = Column(String(255), nullable=True)
    license_url = Column(Text, nullable=True)
    local_path = Column(Text, nullable=False)
    content_hash = Column(String(64), index=True, nullable=True)
    publication_date = Column(String(50), nullable=True)
    last_updated = Column(String(50), nullable=True)
    version_label = Column(String(100), default="1.0", nullable=True)
    status = Column(String(20), default="active", nullable=False)  # active, inactive, superseded
    superseded_by = Column(String(36), nullable=True)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    source = relationship("SourceRegistry", back_populates="documents")
    subject = relationship("Subject", back_populates="documents")
    uploader = relationship("User", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    chunk_sequence = Column(Integer, nullable=False)
    title = Column(String(500), nullable=True)
    section = Column(String(500), nullable=True)
    subsection = Column(String(500), nullable=True)
    page_start = Column(Integer, nullable=True)
    page_end = Column(Integer, nullable=True)
    raw_text = Column(Text, nullable=False)
    normalized_text = Column(Text, nullable=False)
    token_count = Column(Integer, default=0, nullable=False)
    topic_tags = Column(JSON, default=list, nullable=False)
    difficulty_level = Column(String(30), default="beginner", nullable=True)
    embedding_json = Column(JSON, nullable=True)  # dense vector representation as json list
    active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    document = relationship("Document", back_populates="chunks")
    citations = relationship("Citation", back_populates="chunk")

class ChatSession(Base):
    __tablename__ = "sessions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    title = Column(String(255), default="Academic Session", nullable=False)
    subject = Column(String(80), nullable=True)
    learner_level = Column(String(30), default="beginner", nullable=False)
    state_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="sessions")
    messages = relationship("Message", back_populates="session", cascade="all, delete-orphan")
    queries = relationship("QueryRecord", back_populates="session", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    session = relationship("ChatSession", back_populates="messages")

class QueryRecord(Base):
    __tablename__ = "queries"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id"), nullable=False)
    raw_query = Column(Text, nullable=False)
    normalized_query = Column(Text, nullable=False)
    intent = Column(String(50), default="explanation", nullable=False)
    subject = Column(String(80), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    session = relationship("ChatSession", back_populates="queries")
    answer = relationship("Answer", back_populates="query", uselist=False, cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    query_id = Column(String(36), ForeignKey("queries.id"), nullable=False)
    provider = Column(String(50), nullable=False)
    model = Column(String(100), nullable=False)
    answer_text = Column(Text, nullable=False)
    key_points_json = Column(JSON, default=list, nullable=False)
    example_text = Column(Text, nullable=True)
    quiz_json = Column(JSON, default=list, nullable=False)
    follow_up_json = Column(JSON, default=list, nullable=False)
    confidence_score = Column(Float, default=0.85)
    confidence_label = Column(String(30), default="high")
    confidence_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    query = relationship("QueryRecord", back_populates="answer")
    citations = relationship("Citation", back_populates="answer", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="answer", cascade="all, delete-orphan")

class Citation(Base):
    __tablename__ = "citations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    answer_id = Column(String(36), ForeignKey("answers.id"), nullable=False)
    chunk_id = Column(String(36), ForeignKey("document_chunks.id"), nullable=True)
    citation_key = Column(String(20), nullable=False)  # S1, S2, etc.
    title = Column(String(500), nullable=False)
    source_name = Column(String(255), nullable=True)
    section = Column(String(500), nullable=True)
    page_number = Column(Integer, nullable=True)
    url = Column(Text, nullable=True)
    license = Column(String(255), nullable=True)
    excerpt = Column(Text, nullable=True)
    citation_order = Column(Integer, default=1, nullable=False)

    answer = relationship("Answer", back_populates="citations")
    chunk = relationship("DocumentChunk", back_populates="citations")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    answer_id = Column(String(36), ForeignKey("answers.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    rating = Column(Integer, nullable=False)  # 1 to 5
    feedback_type = Column(String(50), default="helpful")
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    answer = relationship("Answer", back_populates="feedback")
