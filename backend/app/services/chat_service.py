import uuid
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models import ChatSession, Message, QueryRecord, Answer, Citation
from app.schemas import ChatRequest, ChatResponse
from app.nlp.normalizer import normalize_query
from app.nlp.intent import intent_classifier
from app.nlp.entities import infer_subject
from app.conversation.resolver import resolve_reference
from app.retrieval.retriever import retriever
from app.generation.prompt_builder import prompt_builder
from app.generation.llm_gateway import llm_gateway
from app.generation.citation_validator import citation_validator
from app.generation.grounding_validator import grounding_validator
from app.generation.response_builder import response_builder

class ChatService:
    async def process_chat(
        self,
        db: Session,
        req: ChatRequest,
        user_id: Optional[str] = None
    ) -> ChatResponse:
        # 1. Resolve or create ChatSession
        session_id = req.session_id or str(uuid.uuid4())
        chat_session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
        if not chat_session:
            chat_session = ChatSession(
                id=session_id,
                user_id=user_id,
                title=req.message[:50],
                subject=req.subject,
                learner_level=req.learner_level or "beginner"
            )
            db.add(chat_session)
            db.commit()
            db.refresh(chat_session)

        # 2. Retrieve recent session history for follow-up resolution
        recent_messages = (
            db.query(Message)
            .filter(Message.session_id == session_id)
            .order_by(Message.created_at.desc())
            .limit(6)
            .all()
        )
        history_dicts = [{"role": m.role, "content": m.content} for m in reversed(recent_messages)]

        # 3. Resolve context and infer intent / subject
        resolved_query = resolve_reference(req.message, history_dicts)
        intent = intent_classifier.classify(resolved_query)
        subject = req.subject or infer_subject(resolved_query, default=chat_session.subject or "programming")

        # 4. Save User Message
        user_msg = Message(
            session_id=session_id,
            role="user",
            content=req.message,
            metadata_json={"resolved_query": resolved_query, "intent": intent, "subject": subject}
        )
        db.add(user_msg)
        db.commit()

        # 5. Hybrid Retrieval
        evidence_chunks = retriever.retrieve(resolved_query, subject=subject, top_k=4)

        # 6. Build Prompt & Call LLM Gateway
        system_prompt = prompt_builder.build_system_prompt()
        user_prompt = prompt_builder.build_user_prompt(
            question=resolved_query,
            evidence_chunks=evidence_chunks,
            learner_level=req.learner_level or "beginner",
            subject=subject,
            response_style=req.response_style or "detailed"
        )

        raw_output = await llm_gateway.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.2
        )

        # 7. Validate Citations and Calculate Confidence
        citations = citation_validator.map_citations(
            answer_text=raw_output.get("answer", "") + " " + " ".join(raw_output.get("key_points", [])),
            evidence_chunks=evidence_chunks
        )
        confidence = grounding_validator.calculate_confidence(
            answer_text=raw_output.get("answer", ""),
            evidence_chunks=evidence_chunks,
            citations_count=len(citations)
        )

        # 8. Build Structured Response
        response = response_builder.build_chat_response(
            session_id=session_id,
            raw_llm_output=raw_output,
            citations=citations,
            confidence=confidence,
            intent=intent,
            subject=subject
        )

        # 9. Save Assistant Message and Answer Audit Record
        asst_msg = Message(
            session_id=session_id,
            role="assistant",
            content=response.answer,
            metadata_json={
                "key_points": response.key_points,
                "example": response.example,
                "quiz": [q.model_dump() for q in response.quiz],
                "sources": [s.model_dump() for s in response.sources],
                "confidence": response.confidence.model_dump()
            }
        )
        db.add(asst_msg)

        query_record = QueryRecord(
            session_id=session_id,
            raw_query=req.message,
            normalized_query=normalize_query(req.message),
            intent=intent,
            subject=subject
        )
        db.add(query_record)
        db.commit()
        db.refresh(query_record)

        answer_record = Answer(
            query_id=query_record.id,
            provider="learnwise_gateway",
            model="default",
            answer_text=response.answer,
            key_points_json=response.key_points,
            example_text=response.example,
            quiz_json=[q.model_dump() for q in response.quiz],
            follow_up_json=response.follow_up_suggestions,
            confidence_score=response.confidence.score,
            confidence_label=response.confidence.label,
            confidence_explanation=response.confidence.explanation
        )
        db.add(answer_record)
        db.commit()
        db.refresh(answer_record)

        # Save Citations
        for c in citations:
            cit_record = Citation(
                answer_id=answer_record.id,
                chunk_id=c.chunk_id,
                citation_key=c.citation_key,
                title=c.title,
                source_name=c.source_name,
                section=c.section,
                page_number=c.page_number,
                url=c.url,
                license=c.license,
                excerpt=c.excerpt
            )
            db.add(cit_record)
        db.commit()

        return response

chat_service = ChatService()
