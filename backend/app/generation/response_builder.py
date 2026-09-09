import uuid
from typing import Dict, Any, List
from app.schemas import ChatResponse, CitationItem, ConfidenceInfo, QuizQuestion

class ResponseBuilder:
    def build_chat_response(
        self,
        session_id: str,
        raw_llm_output: Dict[str, Any],
        citations: List[CitationItem],
        confidence: ConfidenceInfo,
        intent: str,
        subject: str
    ) -> ChatResponse:
        quiz_items = []
        for q in raw_llm_output.get("quiz", []):
            if isinstance(q, dict) and "question" in q and "answer" in q:
                quiz_items.append(QuizQuestion(
                    question=q["question"],
                    options=q.get("options"),
                    answer=q["answer"],
                    explanation=q.get("explanation", "")
                ))

        return ChatResponse(
            request_id=f"req_{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            response_mode="grounded_answer" if citations else "insufficient_evidence",
            answer=raw_llm_output.get("answer", ""),
            key_points=raw_llm_output.get("key_points", []),
            example=raw_llm_output.get("example"),
            quiz=quiz_items,
            confidence=confidence,
            sources=citations,
            follow_up_suggestions=raw_llm_output.get("follow_up_suggestions", []),
            resolved_intent=intent,
            subject=subject
        )

response_builder = ResponseBuilder()
