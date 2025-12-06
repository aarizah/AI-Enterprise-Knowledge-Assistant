from typing import Optional, Annotated, List
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_and_verify_user
from app.modules.documents.services import DocumentService
from app.modules.documents.repository import DocumentRepository
from app.modules.documents.schemas import DocumentListResponse, DocumentResponse
from app.modules.documents.indexing_pipeline.pipeline import IngestionPipeline
from app.modules.documents.storage_utils import storage
from app.modules.users.schemas import UserContext


router = APIRouter(prefix="/documents", tags=["Documents"])


def get_document_service(db: Annotated[Session, Depends(get_db)]) -> DocumentService:
	repository = DocumentRepository(db)
	pipeline = IngestionPipeline(db, storage)
	return DocumentService(repository, pipeline)



@router.post("")
async def upload_and_process_documents(
    files: List[UploadFile] = File(...),
    user: UserContext = Depends(get_and_verify_user),
    service: DocumentService = Depends(get_document_service),
):
    documents = await service.upload_documents(files, user)
    document_ids = [doc.id for doc in documents]
    return service.index_documents(document_ids, user)



@router.get("", response_model=DocumentListResponse)
def list_documents(
    skip: int = 0,
    limit: int = 100,
    user: UserContext = Depends(get_and_verify_user),
    service: DocumentService = Depends(get_document_service),
):
    """Lista documentos del usuario"""
    return service.list_documents(user, skip, limit)



@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    user: UserContext = Depends(get_and_verify_user),
    service: DocumentService = Depends(get_document_service),
):
    """Obtiene un documento específico"""
    return service.get_document(document_id, user)



@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    user: UserContext = Depends(get_and_verify_user),
    service: DocumentService = Depends(get_document_service),
):
    """Elimina un documento"""
    success = service.delete_document(document_id, user)
    if success:
        return {"message": "Document deleted successfully"}
    else:
        from app.modules.documents.exceptions import DocumentNotFound
        raise DocumentNotFound(f"Document with id {document_id} not found")

