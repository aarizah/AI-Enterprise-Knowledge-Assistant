from fastapi import APIRouter, status

router = APIRouter(tags=["Health"])


@router.get("/", status_code=status.HTTP_200_OK)
def root():
    """Root endpoint"""
    return {"status": "ok"}


@router.get("/healthz", status_code=status.HTTP_200_OK)
def health_check():
    """
    Health check endpoint for monitoring and container orchestration.
    Returns a simple status indicating the service is running.
    """
    return {"status": "healthy"}
