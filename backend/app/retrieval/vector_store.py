import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from app.retrieval.embeddings import embedding_client

class VectorStore:
    def __init__(self):
        self.chunk_ids: List[str] = []
        self.embeddings: np.ndarray = np.empty((0, 128), dtype=np.float32)

    def rebuild(self, chunks: List[Dict[str, Any]]) -> None:
        self.chunk_ids = []
        vecs = []

        for chunk in chunks:
            if not chunk.get("active", True):
                continue
            cid = chunk["id"]
            emb = chunk.get("embedding_json")
            if not emb:
                text = chunk.get("raw_text", "") + " " + chunk.get("title", "")
                emb = embedding_client.embed_text(text)
            self.chunk_ids.append(cid)
            vecs.append(emb)

        if vecs:
            self.embeddings = np.array(vecs, dtype=np.float32)
        else:
            self.embeddings = np.empty((0, 128), dtype=np.float32)

    def search(self, query: str, top_k: int = 40) -> List[Tuple[str, float]]:
        if len(self.chunk_ids) == 0 or self.embeddings.shape[0] == 0:
            return []

        q_vec = np.array(embedding_client.embed_text(query), dtype=np.float32)
        q_norm = np.linalg.norm(q_vec)
        if q_norm == 0:
            return []

        # Cosine similarity matrix multiplication
        scores = np.dot(self.embeddings, q_vec)
        scored_pairs = [(self.chunk_ids[i], float(scores[i])) for i in range(len(self.chunk_ids))]
        scored_pairs.sort(key=lambda x: x[1], reverse=True)
        return scored_pairs[:top_k]

vector_store = VectorStore()
