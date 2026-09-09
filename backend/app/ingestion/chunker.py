import re
from typing import List, Dict, Any, Optional

class EducationalChunker:
    def __init__(self, target_tokens: int = 350, max_tokens: int = 500, min_tokens: int = 60):
        self.target_tokens = target_tokens
        self.max_tokens = max_tokens
        self.min_tokens = min_tokens

    def estimate_tokens(self, text: str) -> int:
        return len(text.split())

    def split_into_sections(self, text: str) -> List[Dict[str, str]]:
        """Split text by Markdown headings or Section headers."""
        lines = text.split("\n")
        sections = []
        current_heading = "Overview"
        current_subheading = ""
        current_lines: List[str] = []

        for line in lines:
            h1_match = re.match(r"^#+\s+(.+)$", line)
            sec_match = re.match(r"^(Section|Chapter|\d+\.)\s+(.+)$", line, flags=re.I)
            
            if h1_match:
                if current_lines:
                    sections.append({
                        "section": current_heading,
                        "subsection": current_subheading,
                        "text": "\n".join(current_lines).strip()
                    })
                    current_lines = []
                current_heading = h1_match.group(1).strip()
                current_subheading = ""
            elif sec_match:
                if current_lines:
                    sections.append({
                        "section": current_heading,
                        "subsection": current_subheading,
                        "text": "\n".join(current_lines).strip()
                    })
                    current_lines = []
                current_subheading = sec_match.group(0).strip()
            else:
                current_lines.append(line)

        if current_lines:
            sections.append({
                "section": current_heading,
                "subsection": current_subheading,
                "text": "\n".join(current_lines).strip()
            })

        return [s for s in sections if s["text"].strip()]

    def chunk_document(
        self,
        document_id: str,
        doc_title: str,
        full_text: str,
        subject: str = "general",
        difficulty_level: str = "beginner"
    ) -> List[Dict[str, Any]]:
        sections = self.split_into_sections(full_text)
        if not sections:
            sections = [{"section": "General", "subsection": "", "text": full_text}]

        chunks: List[Dict[str, Any]] = []
        seq = 1

        for sec in sections:
            sec_text = sec["text"]
            token_count = self.estimate_tokens(sec_text)

            # If section fits within max_tokens
            if token_count <= self.max_tokens:
                chunks.append({
                    "document_id": document_id,
                    "chunk_sequence": seq,
                    "title": doc_title,
                    "section": sec["section"],
                    "subsection": sec["subsection"],
                    "raw_text": sec_text,
                    "normalized_text": sec_text.lower(),
                    "token_count": token_count,
                    "topic_tags": [subject, sec["section"].lower()],
                    "difficulty_level": difficulty_level,
                    "active": True
                })
                seq += 1
            else:
                # Split large section by paragraphs
                paragraphs = sec_text.split("\n\n")
                current_chunk_paragraphs: List[str] = []
                current_chunk_tokens = 0

                for para in paragraphs:
                    para_tokens = self.estimate_tokens(para)
                    if current_chunk_tokens + para_tokens > self.max_tokens and current_chunk_paragraphs:
                        chunk_content = "\n\n".join(current_chunk_paragraphs).strip()
                        chunks.append({
                            "document_id": document_id,
                            "chunk_sequence": seq,
                            "title": doc_title,
                            "section": sec["section"],
                            "subsection": sec["subsection"],
                            "raw_text": chunk_content,
                            "normalized_text": chunk_content.lower(),
                            "token_count": self.estimate_tokens(chunk_content),
                            "topic_tags": [subject, sec["section"].lower()],
                            "difficulty_level": difficulty_level,
                            "active": True
                        })
                        seq += 1
                        current_chunk_paragraphs = [para]
                        current_chunk_tokens = para_tokens
                    else:
                        current_chunk_paragraphs.append(para)
                        current_chunk_tokens += para_tokens

                if current_chunk_paragraphs:
                    chunk_content = "\n\n".join(current_chunk_paragraphs).strip()
                    chunks.append({
                        "document_id": document_id,
                        "chunk_sequence": seq,
                        "title": doc_title,
                        "section": sec["section"],
                        "subsection": sec["subsection"],
                        "raw_text": chunk_content,
                        "normalized_text": chunk_content.lower(),
                        "token_count": self.estimate_tokens(chunk_content),
                        "topic_tags": [subject, sec["section"].lower()],
                        "difficulty_level": difficulty_level,
                        "active": True
                    })
                    seq += 1

        return chunks

chunker = EducationalChunker()
