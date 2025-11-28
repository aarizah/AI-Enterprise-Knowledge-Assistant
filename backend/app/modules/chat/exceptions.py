
class LLMServiceError(Exception):
	"""Exception for errors when interacting with the language model (LLM)."""
	def __init__(self, message: str = "Error communicating with the language model."):
		super().__init__(message)

class ChunkRetrievalError(Exception):
	"""Exception for errors when retrieving chunks from the database."""
	def __init__(self, message: str = "Could not retrieve chunks from the database."):
		super().__init__(message)


# Exception handlers now live here (merged from handlers.py)
from fastapi import status
from fastapi.responses import JSONResponse


def handle_llm_service_error(request, exc: LLMServiceError):
	return JSONResponse(
		status_code=status.HTTP_502_BAD_GATEWAY,
		content={"detail": str(exc)}
	)


def handle_chunk_retrieval_error(request, exc: ChunkRetrievalError):
	return JSONResponse(
		status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
		content={"detail": str(exc)}
	)

