from sqlalchemy import Column, Integer, String, Float, DateTime, func, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    user = relationship("User", backref="analytics_events")
    event_type = Column(String, index=True, nullable=False)
    value = Column(Float, nullable=False)
    meta = Column(JSON, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        index=True,
        nullable=False,
    )