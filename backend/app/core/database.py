# SQL alchemy database setup

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.environment import settings  

engine = create_engine(settings.database_url, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    # ✅ Activar la extensión pgvector (solo la primera vez)
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()

    import app.modules.users.models
    import app.modules.AI.pipeline.embeddings.models
    
    #Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
