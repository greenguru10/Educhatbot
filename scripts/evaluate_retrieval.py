import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.database.session import SessionLocal, init_db
from app.models import DocumentChunk
from app.retrieval.index_manager import index_manager
from app.retrieval.retriever import retriever

eval_queries = [
    {"q": "What is recursion and what are its base and recursive cases?", "subject": "programming", "expected": "recursion"},
    {"q": "How does binary search achieve O(log n) time complexity?", "subject": "computer_science", "expected": "binary search"},
    {"q": "What is database normalization and 1NF 2NF 3NF?", "subject": "computer_science", "expected": "normalization"},
    {"q": "What are the 7 layers of OSI reference model?", "subject": "computer_science", "expected": "osi"},
    {"q": "How does gradient descent optimize neural network loss?", "subject": "artificial_intelligence", "expected": "neural"},
    {"q": "What is Newton's second law of motion and F=ma?", "subject": "physics", "expected": "newton"},
    {"q": "Explain derivative and rate of change in calculus", "subject": "mathematics", "expected": "derivative"},
    {"q": "What are OWASP Top 10 web vulnerabilities?", "subject": "cybersecurity_fundamentals", "expected": "owasp"},
]

def evaluate_benchmark():
    init_db()
    db = SessionLocal()
    index_manager.sync_from_db(db)
    
    hits_at_1 = 0
    hits_at_3 = 0
    total = len(eval_queries)

    print("==================================================")
    print("LearnWise Academic Retrieval Evaluation Benchmark")
    print("==================================================")

    for item in eval_queries:
        evidence = retriever.retrieve(item["q"], subject=item["subject"], top_k=3)
        found_at_1 = False
        found_at_3 = False
        
        for idx, chunk in enumerate(evidence):
            text = (chunk.get("raw_text", "") + " " + chunk.get("title", "")).lower()
            if item["expected"] in text:
                if idx == 0:
                    found_at_1 = True
                found_at_3 = True
                break

        if found_at_1:
            hits_at_1 += 1
        if found_at_3:
            hits_at_3 += 1

        print(f"Query: '{item['q'][:45]}...' -> Top Chunk: [{evidence[0].get('title', 'N/A') if evidence else 'None'}] | Recall@3: {'PASS' if found_at_3 else 'FAIL'}")

    r1 = hits_at_1 / total
    r3 = hits_at_3 / total
    print("--------------------------------------------------")
    print(f"Recall@1: {r1:.2%}")
    print(f"Recall@3: {r3:.2%}")
    print(f"MRR Estimated: {(r1 + r3/2)/2:.2%}")
    print("==================================================")
    db.close()

if __name__ == "__main__":
    evaluate_benchmark()
