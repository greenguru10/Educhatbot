import re

def clean_text(text: str) -> str:
    if not text:
        return ""
    # Normalize line breaks
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Remove repeated empty lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    # Strip non-printable chars
    text = "".join(ch for ch in text if ch.isprintable() or ch in "\n\t")
    return text.strip()

def strip_markdown(text: str) -> str:
    # Remove image tags
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    # Remove link URLs but keep text
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
    # Remove heading hashes
    text = re.sub(r"^#+\s+", "", text, flags=re.MULTILINE)
    # Remove code backticks
    text = text.replace("```", "").replace("`", "")
    return text.strip()
