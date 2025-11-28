from fastapi import FastAPI
from .router import router as chat_router
from .exceptions import handle_llm_service_error, handle_chunk_retrieval_error
from .exceptions import LLMServiceError, ChunkRetrievalError

def init_module(app: FastAPI):
    app.include_router(chat_router)
    app.add_exception_handler(LLMServiceError, handle_llm_service_error)
    app.add_exception_handler(ChunkRetrievalError, handle_chunk_retrieval_error)
