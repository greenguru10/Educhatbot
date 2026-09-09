import os
from pathlib import Path

# Extend package search path to include backend/app
_backend_app = Path(__file__).resolve().parent.parent / "backend" / "app"
if _backend_app.exists() and str(_backend_app) not in __path__:
    __path__.append(str(_backend_app))
