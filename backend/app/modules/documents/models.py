from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from app.core.database import Base
from datetime import datetime


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False, unique=True, index=True)
    file_path = Column(String, nullable=True)
    file_type = Column(String(10), nullable=False)  # pdf, docx, md
    upload_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(Integer, nullable=True)  # Para tracking por usuario (futuro)
    chunks_count = Column(Integer, default=0, nullable=False)
    file_size_bytes = Column(Integer, nullable=True)
    status = Column(String(20), default="processed", nullable=False)  # processing, processed, failed
    
    # Relación con embeddings
    embeddings = relationship("Embedding", back_populates="document", cascade="all, delete-orphan")


class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(Integer, primary_key=True, index=True)
    embedding = Column(Vector(1024), nullable=False)
    meta_data = Column(JSONB, nullable=True)
    text = Column(String, nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=True, index=True)
    
    document = relationship("Document", back_populates="embeddings")
