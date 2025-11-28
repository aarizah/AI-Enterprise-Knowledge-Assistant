class DocumentNotFound(Exception):
    pass


class ForbiddenDocumentAccess(Exception):
    pass


class InvalidAuthenticationContext(Exception):
    pass



# Exception handlers
from fastapi import FastAPI
from fastapi.responses import JSONResponse


def register_document_handlers(app: FastAPI):
    @app.exception_handler(DocumentNotFound)
    async def document_not_found_handler(_, exc: DocumentNotFound):
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(ForbiddenDocumentAccess)
    async def forbidden_document_access_handler(_, exc: ForbiddenDocumentAccess):
        return JSONResponse(status_code=403, content={"detail": str(exc)})

    @app.exception_handler(InvalidAuthenticationContext)
    async def invalid_authentication_context_handler(_, exc: InvalidAuthenticationContext):
        return JSONResponse(status_code=401, content={"detail": str(exc)})
