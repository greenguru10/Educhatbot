import pytest
from app.nlp.normalizer import normalize_query, normalize_text
from app.nlp.intent import intent_classifier
from app.nlp.entities import infer_subject
from app.conversation.resolver import resolve_reference

def test_normalization():
    raw = "What is DSA in Python ???"
    norm = normalize_query(raw)
    assert "data structures and algorithms" in norm
    assert "python" in norm

def test_intent_classification():
    assert intent_classifier.classify("What is recursion?") == "definition"
    assert intent_classifier.classify("Quiz me on OSI layers") == "quiz_request"
    assert intent_classifier.classify("Create flashcards for database normal forms") == "flashcard_request"
    assert intent_classifier.classify("Compare TCP vs UDP") == "comparison"
    assert intent_classifier.classify("Give me a Python example") == "example_request"

def test_subject_inference():
    assert infer_subject("Explain binary search trees and heap sort") == "computer_science"
    assert infer_subject("What is Newton's second law of motion?") == "physics"
    assert infer_subject("How do eigenvalues work in matrix transformation?") == "mathematics"
    assert infer_subject("What is OWASP Top 10?") == "cybersecurity_fundamentals"

def test_follow_up_resolution():
    history = [{"role": "user", "content": "What is recursion?"}, {"role": "assistant", "content": "Recursion is..."}]
    res = resolve_reference("Give an example", history)
    assert "recursion" in res.lower()
