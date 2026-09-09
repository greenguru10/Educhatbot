import math
from typing import List, Dict, Any, Tuple
from rank_bm25 import BM25Okapi

class BM25Retriever:
    def __init__(self, k1: float = 1.2, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.bm25: BM25Okapi = None
        self.chunk_ids: List[str] = []
        self.corpus: List[List[str]] = []

    def fit(self, chunks: List[Dict[str, Any]]) -> None:
        self.chunk_ids = []
        self.corpus = []
        tokenized_corpus = []

        for chunk in chunks:
            if not chunk.get("active", True):
                continue
            cid = chunk["id"]
            title = chunk.get("title", "")
            section = chunk.get("section", "")
            tags = " ".join(chunk.get("topic_tags", []))
            raw = chunk.get("raw_text", "")
            
            # Boost title and section keywords by repeating them
            composite_text = f"{title} {title} {section} {section} {tags} {raw}".lower()
            tokens = composite_text.split()
            if not tokens:
                tokens = ["empty"]
            self.chunk_ids.append(cid)
            tokenized_corpus.append(tokens)

        if tokenized_corpus:
            self.bm25 = BM25Okapi(tokenized_corpus, k1=self.k1, b=self.b)
        else:
            self.bm25 = None

    def search(self, query: str, top_k: int = 40) -> List[Tuple[str, float]]:
        if not self.bm25 or not self.chunk_ids:
            return []

        tokens = query.lower().split()
        if not tokens:
            return []

        doc_scores = self.bm25.get_scores(tokens)
        scored_pairs = list(zip(self.chunk_ids, doc_scores))
        scored_pairs.sort(key=lambda x: x[1], reverse=True)
        return scored_pairs[:top_k]
