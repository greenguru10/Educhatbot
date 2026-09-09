import re
from typing import List, Dict, Any, Tuple
from app.schemas import CitationItem

class CitationValidator:
    def extract_citation_markers(self, text: str) -> List[str]:
        return list(set(re.findall(r"\[S(\d+)\]", text)))

    def map_citations(
        self,
        answer_text: str,
        evidence_chunks: List[Dict[str, Any]]
    ) -> List[CitationItem]:
        used_indices = self.extract_citation_markers(answer_text)
        citations: List[CitationItem] = []

        # Only map citations if explicit [S#] markers exist in the text
        if not used_indices:
            return []

        for idx_str in used_indices:
            try:
                idx = int(idx_str) - 1
                if 0 <= idx < len(evidence_chunks):
                    chunk = evidence_chunks[idx]
                    citations.append(CitationItem(
                        citation_key=f"S{idx+1}",
                        document_id=chunk.get("document_id"),
                        chunk_id=chunk.get("id"),
                        title=chunk.get("title", "Course Reference"),
                        source_name=chunk.get("source_name", "Academic Library"),
                        author=chunk.get("author"),
                        section=chunk.get("section"),
                        page_number=chunk.get("page_start"),
                        url=chunk.get("source_url"),
                        license=chunk.get("license"),
                        excerpt=chunk.get("raw_text", "")[:250] + "..."
                    ))
            except Exception:
                continue

        # Sort by citation key
        citations.sort(key=lambda x: x.citation_key)
        return citations

citation_validator = CitationValidator()
