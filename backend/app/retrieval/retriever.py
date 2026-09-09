from typing import List, Dict, Any, Optional
from app.retrieval.index_manager import index_manager
from app.retrieval.vector_store import vector_store
from app.retrieval.hybrid import hybrid_ranker
from app.retrieval.evidence import evidence_selector
from app.nlp.normalizer import normalize_query

class HybridRetriever:
    def retrieve(
        self,
        query: str,
        subject: Optional[str] = None,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        norm_q = normalize_query(query)

        # 1. Lexical BM25 search
        bm25_results = index_manager.bm25.search(norm_q, top_k=30)

        # 2. Vector search
        vec_results = vector_store.search(norm_q, top_k=30)

        # 3. Hybrid Reciprocal Rank Fusion
        fused = hybrid_ranker.reciprocal_rank_fusion(
            bm25_ranks=bm25_results,
            vector_ranks=vec_results,
            metadata_map=index_manager.chunk_cache,
            filter_subject=subject
        )

        ranked_chunks = []
        for cid, score in fused:
            if cid in index_manager.chunk_cache:
                chunk_data = dict(index_manager.chunk_cache[cid])
                chunk_data["retrieval_score"] = score
                ranked_chunks.append(chunk_data)

        # 4. Diversity and Evidence Selection
        evidence = evidence_selector.select_evidence(ranked_chunks, max_evidence=top_k)
        return evidence

retriever = HybridRetriever()
