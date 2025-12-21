import time
from starlette.middleware.base import BaseHTTPMiddleware
from app.modules.analytics.repository import AnalyticsRepository
from app.core.database import SessionLocal
from app.modules.analytics.types import EventType


class ObservationMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request, call_next):
        request.state.meta = {}
        request.state.start_time = time.time()
        
        response = await call_next(request)
        
        return response
