from sqlalchemy.orm import Session
from app.modules.analytics.models import AnalyticsEvent
from app.modules.analytics.types import EventType
from typing import List, Optional, Dict, Any


class AnalyticsRepository:
    """Repositorio para operaciones de base de datos de analytics"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_event(
        self,
        user_id: int,
        event_type: EventType,
        value: float,
        meta: Optional[Dict[str, Any]] = None
    ) -> AnalyticsEvent:
        """Crear un nuevo evento de analytics en la base de datos"""
        event = AnalyticsEvent(
            user_id=user_id,
            event_type=event_type.value,
            value=value,
            meta=meta
        )
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)
        return event

    def get_event_by_user_id(self, user_id: int) -> List[AnalyticsEvent]:
        """Obtener todos los eventos de analytics de un usuario específico"""
        return self.db.query(AnalyticsEvent).filter(AnalyticsEvent.user_id == user_id).all()

    def get_events_by_user_and_type(self, user_id: int, event_type: EventType) -> List[AnalyticsEvent]:
        """Obtener eventos de un usuario filtrados por tipo de evento"""
        return self.db.query(AnalyticsEvent).filter(
            AnalyticsEvent.user_id == user_id,
            AnalyticsEvent.event_type == event_type.value
        ).all()