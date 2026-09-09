import re
from typing import Dict, Any, Optional

class IntentClassifier:
    def classify(self, query: str) -> str:
        q = query.lower().strip()

        if re.search(r"\b(quiz|test me|mcq|multiple choice|practice questions)\b", q):
            return "quiz_request"
        if re.search(r"\b(flashcard|flashcards|cards|study cards|anki)\b", q):
            return "flashcard_request"
        if re.search(r"\b(study plan|roadmap|how to study|7-day plan|schedule)\b", q):
            return "study_plan_request"
        if re.search(r"\b(what is|define|definition of|meaning of|what do you mean by)\b", q):
            return "definition"
        if re.search(r"\b(vs|versus|difference between|compare|comparison)\b", q):
            return "comparison"
        if re.search(r"\b(example|give an example|show an example|code snippet|illustrate)\b", q):
            return "example_request"
        if re.search(r"\b(step by step|how to derive|algorithm steps|procedure)\b", q):
            return "step_by_step_learning"
        if re.search(r"\b(summary|summarize|tldr|key points of)\b", q):
            return "concept_summary"
        if re.search(r"\b(source|citation|reference|where is this from)\b", q):
            return "source_request"
        if re.search(r"\b(explain|why does|how does|what happens when|overview)\b", q):
            return "explanation"
        
        return "explanation"

intent_classifier = IntentClassifier()
