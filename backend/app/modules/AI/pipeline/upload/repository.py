from sqlalchemy.orm import Session
from app.modules.AI.pipeline.upload.models import Document
from app.modules.AI.pipeline.embeddings.models import Embedding
from typing import List, Optional
from pathlib import Path

def create_document(
    db: Session,
    filename: str,
    file_path: Optional[str],
    file_type: str,
    chunks_count: int = 0,
    file_size_bytes: Optional[int] = None,
    user_id: Optional[int] = None,
    status: str = "processed"
) -> Document:
    """Crear un nuevo documento en la base de datos"""
    document = Document(
        filename=filename,
        file_path=file_path,
        file_type=file_type,
        chunks_count=chunks_count,
        file_size_bytes=file_size_bytes,
        user_id=user_id,
        status=status
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def get_document_by_filename(db: Session, filename: str) -> Optional[Document]:
    """Obtener un documento por su nombre de archivo"""
    return db.query(Document).filter(Document.filename == filename).first()

def get_document_by_id(db: Session, document_id: int) -> Optional[Document]:
    """Obtener un documento por su ID"""
    return db.query(Document).filter(Document.id == document_id).first()

def get_all_documents(db: Session, skip: int = 0, limit: int = 100) -> List[Document]:
    """Obtener todos los documentos con paginación"""
    return db.query(Document).order_by(Document.upload_date.desc()).offset(skip).limit(limit).all()

def count_documents(db: Session) -> int:
    """Contar total de documentos"""
    return db.query(Document).count()

def delete_document(db: Session, document_id: int) -> bool:
    """Eliminar un documento y sus embeddings asociados (cascade)"""
    document = get_document_by_id(db, document_id)
    if document:
        db.delete(document)
        db.commit()
        return True
    return False

def update_document_chunks_count(db: Session, document_id: int, chunks_count: int):
    """Actualizar el conteo de chunks de un documento"""
    document = get_document_by_id(db, document_id)
    if document:
        document.chunks_count = chunks_count
        db.commit()
        db.refresh(document)
    return document
