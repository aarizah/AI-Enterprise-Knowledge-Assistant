from sqlalchemy import Column, Integer, String
from app.core.database import Base
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects.postgresql import JSONB

class Embedding(Base):
    __tablename__ = "embeddings"

    id = Column(Integer, primary_key=True, index=True)
    embedding = Column(Vector(1024), nullable=False)  # Store as a vector
    meta_data = Column(JSONB, nullable=True)    # Store metadata as a string (e.g., JSON)
    text = Column(String, nullable=False)        # Original text chunk
