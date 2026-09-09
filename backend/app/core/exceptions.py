from fastapi import HTTPException, status

class EntityNotFoundError(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class ValidationError(HTTPException):
    def __init__(self, detail: str = "Validation failed"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

class IngestionError(HTTPException):
    def __init__(self, detail: str = "Document ingestion failed"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class LLMProviderError(HTTPException):
    def __init__(self, detail: str = "LLM provider error"):
        super().__init__(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail)
