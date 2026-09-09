import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

def run_smoke_test():
    with TestClient(app) as client:
        print("--- 1. Testing Health Endpoint ---")
        res = client.get("/api/v1/health")
        print("Status:", res.status_code, res.json())
        assert res.status_code == 200
        assert res.json()["status"] == "ok"
        assert res.json()["total_indexed_chunks"] > 0

        print("\n--- 2. Testing Sources & Subjects ---")
        res_sources = client.get("/api/v1/sources")
        print(f"Sources found: {len(res_sources.json())}")
        assert res_sources.status_code == 200
        assert len(res_sources.json()) >= 5

        res_subj = client.get("/api/v1/subjects")
        print(f"Subjects found: {len(res_subj.json())}")
        assert res_subj.status_code == 200
        assert len(res_subj.json()) >= 10

        print("\n--- 3. Testing Chat RAG Endpoint with Grounding & Citations ---")
        chat_payload = {
            "message": "What is recursion and what are its base and recursive cases?",
            "subject": "programming",
            "learner_level": "beginner"
        }
        chat_res = client.post("/api/v1/chat", json=chat_payload)
        print("Chat Status:", chat_res.status_code)
        data = chat_res.json()
        print("Answer Preview:", data.get("answer")[:150])
        print("Citations Count:", len(data.get("sources", [])))
        print("Key Points:", data.get("key_points"))
        print("Confidence:", data.get("confidence"))
        assert chat_res.status_code == 200
        assert len(data.get("sources", [])) > 0
        assert data.get("confidence")["label"] in ["high", "medium"]

        print("\n--- 4. Testing Quiz Generation ---")
        quiz_payload = {
            "topic": "OSI model layers",
            "subject": "computer_science",
            "question_count": 3
        }
        quiz_res = client.post("/api/v1/quiz", json=quiz_payload)
        print("Quiz Status:", quiz_res.status_code)
        questions = quiz_res.json()
        print(f"Generated {len(questions)} quiz questions.")
        assert quiz_res.status_code == 200
        assert len(questions) > 0

        print("\n--- 5. Testing Flashcards Generation ---")
        fc_payload = {
            "topic": "Database Normalization",
            "subject": "computer_science",
            "card_count": 4
        }
        fc_res = client.post("/api/v1/flashcards", json=fc_payload)
        print("Flashcards Status:", fc_res.status_code)
        cards = fc_res.json().get("cards", [])
        print(f"Generated {len(cards)} flashcards.")
        assert fc_res.status_code == 200
        assert len(cards) > 0

        print("\n==========================================")
        print("All LearnWise Backend Smoke Tests PASSED!")
        print("==========================================")

if __name__ == "__main__":
    run_smoke_test()
