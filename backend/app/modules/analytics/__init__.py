from fastapi import FastAPI
from app.modules.analytics.router import router


def init_module(app: FastAPI):
    """Initialize analytics module"""
    app.include_router(router)
