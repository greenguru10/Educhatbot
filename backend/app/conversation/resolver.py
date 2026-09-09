import re
from typing import List, Dict, Any, Optional

def resolve_reference(current_query: str, history: List[Dict[str, Any]]) -> str:
    """
    If user asks follow-up like 'give an example' or 'explain that in more detail',
    resolve it using previous user/assistant context.
    """
    q = current_query.strip()
    lower_q = q.lower()
    
    # Pronouns and vague phrases
    vague_patterns = [
        r"^(give|show|create|provide)?\s*(me\s*)?(an?\s+)?example(\s+of\s+that|\s+please)?$",
        r"^(explain|elaborate)\s+(it|this|that|further|more)$",
        r"^(tell me more|more details|continue)$",
        r"^(what about it|why is that|how does that work)\??$",
        r"^(quiz me on that|make a quiz for this)$"
    ]
    
    is_vague = any(re.search(pat, lower_q) for pat in vague_patterns)
    
    if not is_vague or not history:
        return current_query
        
    # Find last concept from user messages or assistant responses
    last_user_msg = None
    for msg in reversed(history):
        if msg.get("role") == "user":
            last_user_msg = msg.get("content", "")
            break
            
    if last_user_msg:
        # Extract main nouns/topic from last query
        clean_last = re.sub(r"^(what is|explain|define|tell me about|how does)\s+", "", last_user_msg, flags=re.I).strip(" ?.")
        if "example" in lower_q:
            return f"Give a clear illustrative example of {clean_last}"
        elif "quiz" in lower_q:
            return f"Quiz me on {clean_last}"
        elif "explain" in lower_q or "more" in lower_q:
            return f"Explain {clean_last} in deeper detail"
        else:
            return f"{current_query} regarding {clean_last}"
            
    return current_query
