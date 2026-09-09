import re
import unicodedata
from app.nlp.terminology import terminology

def normalize_text(text: str) -> str:
    if not text:
        return ""
    # Normalize unicode
    text = unicodedata.normalize("NFKC", text)
    # Lowercase
    text = text.lower()
    # Replace newlines with spaces
    text = re.sub(r"\s+", " ", text).strip()
    return text

def normalize_query(query: str) -> str:
    clean = normalize_text(query)
    tokens = clean.split()
    expanded_tokens = []
    
    for token in tokens:
        # Strip punctuation
        stripped = re.sub(r"^[^\w]+|[^\w]+$", "", token)
        abbr = terminology.expand_abbreviation(stripped)
        if abbr:
            expanded_tokens.append(abbr.get("expansion", stripped))
        else:
            expanded_tokens.append(token)
            
    return " ".join(expanded_tokens)
