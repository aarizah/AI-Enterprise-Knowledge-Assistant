from fastapi import FastAPI
from app.modules.health.router import router


def init_module(app: FastAPI):
    """Initialize the health module."""
    app.include_router(router)
