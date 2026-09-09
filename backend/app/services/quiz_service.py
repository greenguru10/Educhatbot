import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.schemas import QuizGenerateRequest, QuizQuestion, FlashcardsRequest, FlashcardsResponse, FlashcardItem
from app.retrieval.retriever import retriever

class QuizService:
    def generate_quiz(self, db: Session, req: QuizGenerateRequest) -> List[QuizQuestion]:
        evidence_chunks = retriever.retrieve(req.topic, subject=req.subject, top_k=3)
        
        questions: List[QuizQuestion] = []
        if not evidence_chunks:
            # Fallback academic questions for the topic
            questions.append(QuizQuestion(
                question=f"What is the fundamental concept behind {req.topic}?",
                options=[f"A core principle in {req.subject or 'academic computing'}", "An unrelated heuristic", "A physical hardware protocol", "A deprecated syntax"],
                answer=f"A core principle in {req.subject or 'academic computing'}",
                explanation=f"Key definition and role of {req.topic} in the curriculum."
            ))
            return questions

        for idx, chunk in enumerate(evidence_chunks[:req.question_count]):
            sec = chunk.get("section", "General")
            title = chunk.get("title", req.topic)
            text = chunk.get("raw_text", "")
            
            # Extract first sentence or core statement for the question
            first_line = text.split("\n")[0].replace("#", "").strip()
            
            q_text = f"Regarding {title} ({sec}): What is the primary characteristic discussed in [S{idx+1}]?"
            correct_ans = first_line[:120] if first_line else f"Core principle defined in {sec}."
            
            options = [
                correct_ans,
                f"An alternative approach that bypasses {sec}.",
                f"A secondary optimization unrelated to {title}.",
                "None of the above."
            ]
            
            questions.append(QuizQuestion(
                question=q_text,
                options=options,
                answer=correct_ans,
                explanation=f"Grounded directly in source [S{idx+1}]: {title} - {sec}."
            ))

        return questions

    def generate_flashcards(self, db: Session, req: FlashcardsRequest) -> FlashcardsResponse:
        evidence_chunks = retriever.retrieve(req.topic, subject=req.subject, top_k=req.card_count)
        cards: List[FlashcardItem] = []

        if not evidence_chunks:
            cards.append(FlashcardItem(
                id=str(uuid.uuid4())[:8],
                front=f"Definition of {req.topic}",
                back=f"A foundational topic in {req.subject or 'academic study'}.",
                subject=req.subject,
                topic_tag=req.topic,
                source_citation="Curriculum Standard"
            ))
        else:
            for idx, chunk in enumerate(evidence_chunks[:req.card_count]):
                sec = chunk.get("section", "Core Concept")
                title = chunk.get("title", req.topic)
                text = chunk.get("raw_text", "")
                
                cards.append(FlashcardItem(
                    id=str(uuid.uuid4())[:8],
                    front=f"{title}: {sec}",
                    back=text[:200].strip() + "...",
                    subject=chunk.get("subject"),
                    topic_tag=sec,
                    source_citation=f"[S{idx+1}] {title}"
                ))

        return FlashcardsResponse(
            topic=req.topic,
            subject=req.subject,
            cards=cards
        )

quiz_service = QuizService()
