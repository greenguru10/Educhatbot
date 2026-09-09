import pytest
from app.ingestion.chunker import EducationalChunker
from app.retrieval.bm25 import BM25Retriever
from app.retrieval.hybrid import HybridRanker
from app.retrieval.embeddings import LocalEmbeddingModel

def test_chunker():
    chunker = EducationalChunker(target_tokens=50, max_tokens=100)
    sample_text = """# Section 1: Intro
This is an introductory lesson on algorithms.

# Section 2: Complexity
Big O notation describes upper bounds.
"""
    chunks = chunker.chunk_document("doc_1", "Test Doc", sample_text, "computer_science")
    assert len(chunks) == 2
    assert chunks[0]["section"] == "Section 1: Intro"
    assert chunks[1]["section"] == "Section 2: Complexity"

def test_bm25_retrieval():
    retriever = BM25Retriever()
    sample_chunks = [
        {"id": "c1", "raw_text": "Python recursion is when a function calls itself.", "section": "Recursion", "title": "Python Notes", "active": True},
        {"id": "c2", "raw_text": "Database normalization reduces redundancy.", "section": "DBMS", "title": "DB Notes", "active": True}
    ]
    retriever.fit(sample_chunks)
    results = retriever.search("recursion function", top_k=2)
    assert len(results) > 0
    assert results[0][0] == "c1"

def test_embedding_model():
    emb = LocalEmbeddingModel(dim=128)
    vec = emb.embed_text("Data structures and algorithms")
    assert len(vec) == 128
    assert sum(vec) != 0
