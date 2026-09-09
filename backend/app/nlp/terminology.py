import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from app.core.config import settings

class TerminologyManager:
    def __init__(self, config_path: Optional[Path] = None):
        self.config_path = config_path or (settings.CONFIGS_DIR / "education_terms.yaml")
        self.abbreviations: Dict[str, Dict[str, Any]] = {}
        self.synonyms: Dict[str, list] = {}
        self._load()

    def _load(self) -> None:
        if self.config_path.exists():
            try:
                with open(self.config_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f) or {}
                    self.abbreviations = data.get("abbreviations", {})
                    self.synonyms = data.get("synonyms", {})
            except Exception:
                self.abbreviations = {}
                self.synonyms = {}

    def expand_abbreviation(self, term: str) -> Optional[Dict[str, Any]]:
        return self.abbreviations.get(term.lower().strip())

    def get_synonyms(self, term: str) -> list:
        return self.synonyms.get(term.lower().strip(), [])

terminology = TerminologyManager()
