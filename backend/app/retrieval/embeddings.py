import re
import math
import numpy as np
from typing import List, Dict, Any, Optional

class LocalEmbeddingModel:
    def __init__(self, dim: int = 128):
        self.dim = dim
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}

    def _hash_embed(self, text: str) -> np.ndarray:
        """Deterministic hashing embedding vectorizer for fast local zero-dependency semantic representation."""
        vec = np.zeros(self.dim, dtype=np.float32)
        words = re.findall(r"\w+", text.lower())
        if not words:
            return vec

        for w in words:
            # Word level hashing
            h = hash(w) % self.dim
            vec[h] += 1.0
            # 3-gram character hashing for typo tolerance
            if len(w) >= 3:
                for i in range(len(w) - 2):
                    sub = w[i:i+3]
                    h_sub = hash(sub) % self.dim
                    vec[h_sub] += 0.5

        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def embed_text(self, text: str) -> List[float]:
        return self._hash_embed(text).tolist()

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]

embedding_client = LocalEmbeddingModel()
