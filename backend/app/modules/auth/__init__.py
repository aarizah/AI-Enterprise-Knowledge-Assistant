"""
Auth module initialization.
This module handles user authentication, registration, and authorization.
"""

from fastapi import FastAPI
from .router import router as auth_router
from .exceptions import register_auth_handlers


def init_module(app: FastAPI):
    """
    Initialize the auth module.
    Registers the router and exception handlers with the FastAPI app.
    
    Args:
        app: The FastAPI application instance
    """
    # Register router
    app.include_router(auth_router)
    
    # Register exception handlers
    register_auth_handlers(app)
