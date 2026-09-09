from typing import List, Dict, Any, Tuple
from collections import defaultdict

class HybridRanker:
    def __init__(self, rrf_k: int = 60, min_bm25_score: float = 1.2, min_vec_score: float = 0.30):
        self.rrf_k = rrf_k
        self.min_bm25_score = min_bm25_score
        self.min_vec_score = min_vec_score

    def reciprocal_rank_fusion(
        self,
        bm25_ranks: List[Tuple[str, float]],
        vector_ranks: List[Tuple[str, float]],
        metadata_map: Dict[str, Dict[str, Any]],
        filter_subject: str = None
    ) -> List[Tuple[str, float]]:
        scores = defaultdict(float)

        # 1. BM25 RRF Score (Only include if score exceeds threshold)
        for rank, (cid, raw_score) in enumerate(bm25_ranks):
            if raw_score >= self.min_bm25_score:
                scores[cid] += 0.65 * (1.0 / (self.rrf_k + rank + 1)) * (1.0 + min(raw_score / 10.0, 2.0))

        # 2. Vector RRF Score (Only include if similarity exceeds threshold)
        for rank, (cid, raw_score) in enumerate(vector_ranks):
            if raw_score >= self.min_vec_score:
                scores[cid] += 0.35 * (1.0 / (self.rrf_k + rank + 1))

        # If no chunk passed the relevance threshold, return empty!
        if not scores:
            return []

        # 3. Apply Metadata Boosts (Subject matching & Authority Level)
        final_scores = []
        for cid, rrf_val in scores.items():
            meta = metadata_map.get(cid, {})
            auth_score = meta.get("authority_score", 0.85)
            subj = meta.get("subject", "")
            
            # Subject boost
            subj_boost = 1.35 if filter_subject and subj == filter_subject else 1.0
            
            total = rrf_val * auth_score * subj_boost
            final_scores.append((cid, total))

        final_scores.sort(key=lambda x: x[1], reverse=True)
        return final_scores

hybrid_ranker = HybridRanker()
