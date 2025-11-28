from fastapi import FastAPI
from .router import router as documents_router
from .exceptions import register_document_handlers


def init_module(app: FastAPI):
    app.include_router(documents_router)
    register_document_handlers(app)
