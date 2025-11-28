from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


class InvalidToken(Exception):
    pass


class ExpiredToken(Exception):
    pass


class MissingCredentials(Exception):
    pass


class AuthenticationError(Exception):
    pass


class ForbiddenAction(Exception):
    pass


def register_core_exception_handlers(app: FastAPI):
    @app.exception_handler(Exception)
    async def unexpected_error_handler(_, __):
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_, exc: RequestValidationError):
        return JSONResponse(status_code=422, content={"detail": exc.errors()})

    @app.exception_handler(HTTPException)
    async def http_exception_handler(_, exc: HTTPException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

    async def authentication_errors_handler(_, exc: Exception):
        return JSONResponse(status_code=401, content={"detail": str(exc) or "Unauthorized"})
    
    app.add_exception_handler(InvalidToken, authentication_errors_handler)
    app.add_exception_handler(MissingCredentials, authentication_errors_handler)
    app.add_exception_handler(AuthenticationError, authentication_errors_handler)

    async def forbidden_errors_handler(_, exc: Exception):
        return JSONResponse(status_code=403, content={"detail": str(exc) or "Forbidden"})
    
    app.add_exception_handler(ExpiredToken, forbidden_errors_handler)
    app.add_exception_handler(ForbiddenAction, forbidden_errors_handler)
