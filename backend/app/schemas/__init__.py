from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

# --- Auth Schemas ---
class UserRegisterRequest(BaseModel):
    email: str
    password: str
    display_name: Optional[str] = None
    role: Optional[str] = "student"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: Optional[str]
    display_name: Optional[str]
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

# --- Citation & Source Schemas ---
class CitationItem(BaseModel):
    citation_key: str  # S1, S2
    document_id: Optional[str] = None
    chunk_id: Optional[str] = None
    title: str
    source_name: Optional[str] = None
    author: Optional[str] = None
    section: Optional[str] = None
    page_number: Optional[int] = None
    url: Optional[str] = None
    license: Optional[str] = None
    last_updated: Optional[str] = None
    excerpt: Optional[str] = None

class ConfidenceInfo(BaseModel):
    score: float
    label: str  # high, medium, low, insufficient
    explanation: Optional[str] = None

class QuizQuestion(BaseModel):
    question: str
    options: Optional[List[str]] = None
    answer: str
    explanation: str

# --- Chat Schemas ---
class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    message: str = Field(..., max_length=2000)
    subject: Optional[str] = None
    learner_level: Optional[str] = "beginner"  # beginner, intermediate, advanced
    response_style: Optional[str] = "detailed"  # concise, detailed, exam_oriented

class ChatResponse(BaseModel):
    request_id: str
    session_id: str
    response_mode: str = "grounded_answer"
    answer: str
    key_points: List[str] = []
    example: Optional[str] = None
    quiz: List[QuizQuestion] = []
    confidence: ConfidenceInfo
    sources: List[CitationItem] = []
    follow_up_suggestions: List[str] = []
    resolved_intent: Optional[str] = None
    subject: Optional[str] = None

# --- Document & Ingestion Schemas ---
class DocumentChunkResponse(BaseModel):
    id: str
    chunk_sequence: int
    title: Optional[str]
    section: Optional[str]
    raw_text: str
    token_count: int
    topic_tags: List[str]
    difficulty_level: Optional[str]
    active: bool

    class Config:
        from_attributes = True

class DocumentResponse(BaseModel):
    id: str
    source_id: Optional[str]
    subject_id: Optional[int]
    title: str
    author: Optional[str]
    document_type: str
    source_url: Optional[str]
    license: Optional[str]
    status: str
    created_at: datetime
    chunk_count: Optional[int] = 0

    class Config:
        from_attributes = True

class DocumentDetailResponse(DocumentResponse):
    extracted_text: Optional[str] = None
    chunks: List[DocumentChunkResponse] = []

class DocumentPatchRequest(BaseModel):
    status: Optional[str] = None
    superseded_by: Optional[str] = None
    title: Optional[str] = None

# --- Quiz & Flashcards Schemas ---
class QuizGenerateRequest(BaseModel):
    topic: str
    subject: Optional[str] = None
    learner_level: Optional[str] = "beginner"
    question_count: int = Field(default=4, ge=1, le=10)

class FlashcardItem(BaseModel):
    id: str
    front: str
    back: str
    subject: Optional[str] = None
    topic_tag: Optional[str] = None
    source_citation: Optional[str] = None

class FlashcardsRequest(BaseModel):
    topic: str
    subject: Optional[str] = None
    learner_level: Optional[str] = "beginner"
    card_count: int = Field(default=5, ge=1, le=15)

class FlashcardsResponse(BaseModel):
    topic: str
    subject: Optional[str]
    cards: List[FlashcardItem]

# --- Feedback Schema ---
class FeedbackRequest(BaseModel):
    answer_id: str
    rating: int = Field(..., ge=1, le=5)
    feedback_type: Optional[str] = "helpful"
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: str
    status: str = "success"

# --- Source Registry Schema ---
class SourceRegistryResponse(BaseModel):
    id: str
    name: str
    base_url: Optional[str]
    authority_level: str
    authority_score: float
    license_notes: Optional[str]
    active: bool
    document_count: Optional[int] = 0

    class Config:
        from_attributes = True

class SubjectResponse(BaseModel):
    id: int
    slug: str
    display_name: str
    description: Optional[str]
    active: bool
    document_count: Optional[int] = 0

    class Config:
        from_attributes = True
