from typing import List, Dict, Any

class PromptBuilder:
    def build_system_prompt(self) -> str:
        return """You are LearnWise, an educational assistant.

Your job is to help learners understand concepts accurately and clearly.

Rules:
1. Use the approved retrieved sources as the primary factual basis of your answer.
2. Cite factual claims using source markers such as [S1] and [S2].
3. Do not invent facts, quotations, statistics, citations, page numbers, or sources.
4. If the sources do not support the answer, say that the approved learning library does not contain enough information.
5. Explain concepts at the learner level requested. If no level is provided, use clear undergraduate-level language.
6. You may create original examples, analogies, quiz questions, and flashcards, but label them as examples or practice material.
7. Distinguish source-grounded facts from illustrative examples.
8. Return valid JSON matching the required schema:
{
  "answer": "string with [S1] citations",
  "key_points": ["point 1 [S1]", "point 2 [S2]"],
  "example": "Example (Illustrative): ...",
  "quiz": [{"question": "...", "answer": "...", "explanation": "..."}],
  "follow_up_suggestions": ["..."],
  "used_source_ids": ["S1", "S2"],
  "confidence_note": "..."
}"""

    def build_user_prompt(
        self,
        question: str,
        evidence_chunks: List[Dict[str, Any]],
        learner_level: str = "beginner",
        subject: str = "programming",
        response_style: str = "detailed",
        conversation_context: str = ""
    ) -> str:
        evidence_text_parts = []
        for idx, chunk in enumerate(evidence_chunks, start=1):
            s_key = f"S{idx}"
            chunk_str = f"""[{s_key}]
Title: {chunk.get('title', 'Unknown Source')}
Author/Publisher: {chunk.get('source_name', chunk.get('author', 'Course Library'))}
Section: {chunk.get('section', 'General')}
Page: {chunk.get('page_start', 'N/A')}
URL: {chunk.get('source_url', 'N/A')}
Text:
{chunk.get('raw_text', '')}"""
            evidence_text_parts.append(chunk_str)

        all_evidence = "\n\n".join(evidence_text_parts) if evidence_text_parts else "No approved sources found."

        return f"""User question:
{question}

Learner preferences:
- Level: {learner_level}
- Subject: {subject}
- Desired format: {response_style}

Conversation context:
{conversation_context or "New conversation"}

Approved source evidence:
{all_evidence}

Write a helpful answer using the source evidence. Mark source-grounded factual claims with [S#]. Clearly label any original illustrative example as "Example"."""

prompt_builder = PromptBuilder()
