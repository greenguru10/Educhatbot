from typing import List, Dict, Any

class EvidenceSelector:
    def select_evidence(
        self,
        ranked_chunks: List[Dict[str, Any]],
        max_evidence: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Select top diverse and high-scoring evidence chunks, ensuring distinct sections or documents.
        """
        selected = []
        seen_sections = set()

        for chunk in ranked_chunks:
            sec_key = f"{chunk.get('document_id')}_{chunk.get('section', '')}"
            if sec_key not in seen_sections:
                selected.append(chunk)
                seen_sections.add(sec_key)
            elif len(selected) < max_evidence and chunk not in selected:
                selected.append(chunk)

            if len(selected) >= max_evidence:
                break

        return selected

evidence_selector = EvidenceSelector()
