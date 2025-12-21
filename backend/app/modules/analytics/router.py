from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_and_verify_user
from app.core.database import get_db
from app.modules.analytics.services import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_analytics_service(db: Session = Depends(get_db)) -> AnalyticsService:
    return AnalyticsService(db)


@router.get("/")
async def get_analytics(
    user: dict = Depends(get_and_verify_user),
    service: AnalyticsService = Depends(get_analytics_service),
):
    return service.get_analytics(user)

