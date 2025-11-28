class EmailAlreadyExists(Exception):
    """Raised when attempting to register with an email that already exists in the system."""
    pass

class InvalidCredentials(Exception):
    """Raised when login credentials are invalid (wrong email or password)."""
    pass


# Exception handlers now live here (merged from handlers.py)
from fastapi import FastAPI
from fastapi.responses import JSONResponse


def register_auth_handlers(app: FastAPI):
    @app.exception_handler(EmailAlreadyExists)
    async def email_already_exists_handler(request, exc: EmailAlreadyExists):
        return JSONResponse(
            status_code=400,
            content={"detail": str(exc)}
        )

    @app.exception_handler(InvalidCredentials)
    async def invalid_credentials_handler(request, exc: InvalidCredentials):
        return JSONResponse(
            status_code=401,
            content={"detail": str(exc)}
        )
