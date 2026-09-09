from pathlib import Path
from bs4 import BeautifulSoup

class TextParser:
    @staticmethod
    def parse_text(file_path: Path) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

class MarkdownParser:
    @staticmethod
    def parse_markdown(file_path: Path) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

class HTMLParser:
    @staticmethod
    def parse_html(file_path: Path) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        soup = BeautifulSoup(content, "html.parser")
        # Remove script and style elements
        for element in soup(["script", "style", "nav", "footer", "header", "noscript"]):
            element.extract()
        return soup.get_text(separator="\n\n")

class PDFParser:
    @staticmethod
    def parse_pdf(file_path: Path) -> str:
        try:
            import pypdf
            reader = pypdf.PdfReader(str(file_path))
            text_parts = []
            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_parts.append(f"--- Page {idx+1} ---\n{page_text}")
            return "\n\n".join(text_parts)
        except Exception:
            # Fallback for plain reading or if pypdf not available
            return f"[PDF content from {file_path.name}]"
