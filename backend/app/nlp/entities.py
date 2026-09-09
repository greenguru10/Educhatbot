import re
from typing import List, Dict, Any, Optional
from app.core.constants import SUBJECT_SLUGS

SUBJECT_KEYWORDS = {
    "programming": ["python", "function", "variable", "class", "loop", "array", "syntax", "code", "programming", "recursion", "debugging"],
    "computer_science": ["dsa", "data structures", "algorithm", "binary search", "tree", "graph", "dbms", "database", "normalization", "sql", "operating system", "process", "thread", "memory"],
    "artificial_intelligence": ["ai", "machine learning", "neural network", "deep learning", "supervised", "gradient descent", "loss function", "dataset", "training"],
    "mathematics": ["calculus", "derivative", "integral", "matrix", "linear algebra", "eigenvalue", "probability", "bayes", "vector", "limit", "differential"],
    "physics": ["mechanics", "newton", "gravity", "energy", "force", "electromagnetism", "wave", "thermodynamics", "velocity", "acceleration", "optics"],
    "cybersecurity_fundamentals": ["security", "owasp", "xss", "csrf", "injection", "cryptography", "encryption", "vulnerability", "auth", "firewall"],
    "cloud_computing": ["cloud", "aws", "docker", "kubernetes", "microservices", "ci/cd", "devops", "serverless", "container"],
    "english_communication": ["writing", "grammar", "essay", "paragraph", "presentation", "vocabulary", "communication", "formal tone"],
    "study_skills": ["study", "revision", "spaced repetition", "active recall", "pomodoro", "notes", "memory", "exam prep"],
    "career_learning": ["interview", "resume", "career", "portfolio", "roadmap", "job", "internship"]
}

def infer_subject(query: str, default: Optional[str] = None) -> Optional[str]:
    q = query.lower()
    scores: Dict[str, int] = {}
    for subject, keywords in SUBJECT_KEYWORDS.items():
        score = sum(1 for kw in keywords if re.search(r"\b" + re.escape(kw) + r"\b", q))
        if score > 0:
            scores[subject] = score

    if scores:
        best_subj = max(scores.items(), key=lambda x: x[1])[0]
        return best_subj
    return default or "programming"
