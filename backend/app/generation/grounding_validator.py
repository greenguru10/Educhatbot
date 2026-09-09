from typing import List, Dict, Any, Tuple
from app.schemas import ConfidenceInfo

class GroundingValidator:
    def calculate_confidence(
        self,
        answer_text: str,
        evidence_chunks: List[Dict[str, Any]],
        citations_count: int
    ) -> ConfidenceInfo:
        if not evidence_chunks:
            return ConfidenceInfo(
                score=0.10,
                label="insufficient",
                explanation="No authoritative sources found in the approved repository."
            )

        top_score = max((c.get("retrieval_score", 0.0) for c in evidence_chunks), default=0.0)

        if citations_count > 0 and len(evidence_chunks) >= 2:
            return ConfidenceInfo(
                score=round(min(0.95, 0.75 + top_score * 0.2), 2),
                label="high",
                explanation="Well-grounded with multiple authoritative course references and verified citations."
            )
        elif citations_count > 0:
            return ConfidenceInfo(
                score=0.80,
                label="medium",
                explanation="Grounded with primary source reference."
            )
        else:
            return ConfidenceInfo(
                score=0.50,
                label="low",
                explanation="Synthesized with limited direct citation overlap."
            )

grounding_validator = GroundingValidator()
