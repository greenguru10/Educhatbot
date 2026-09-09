import logging
import sys
from typing import Any, Dict

def setup_logging(level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("learnwise")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        
    return logger

logger = setup_logging()

def log_event(event_name: str, **kwargs: Any) -> None:
    safe_data = {k: v for k, v in kwargs.items() if "password" not in k.lower() and "token" not in k.lower() and "secret" not in k.lower()}
    logger.info(f"EVENT={event_name} DATA={safe_data}")
