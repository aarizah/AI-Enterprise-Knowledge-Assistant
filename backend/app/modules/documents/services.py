from typing import List, Optional
from fastapi import UploadFile

from app.modules.documents.repository import DocumentRepository
from app.modules.users.schemas import UserContext
from app.modules.documents.models import Document
from app.modules.documents.exceptions import DocumentNotFound, ForbiddenDocumentAccess, InvalidAuthenticationContext
from app.modules.documents.schemas import DocumentResponse, DocumentListResponse
from app.modules.documents.indexing_pipeline.pipeline import IngestionPipeline
from app.modules.documents.storage_utils import storage

class DocumentService:
    
    def __init__(self, repository: DocumentRepository, ingestion_pipeline: IngestionPipeline):
        self.repository = repository
        self.pipeline = ingestion_pipeline

        
    def index_documents(self, document_ids: List[int], user: UserContext):
        self._validate_user(user)
        results = self.pipeline.process_documents(document_ids)
        
        return {"results": results}
    
    def delete_document(self, document_id: int, user: UserContext) -> bool:

        self._validate_user(user)

        document = self._get_owned_document_or_404(document_id, user.id)

        if document.file_path:
            storage.delete_file(document.file_path)
        
        return self.repository.delete_document(document_id)
    
    def get_document(self, document_id: int, user: UserContext) -> DocumentResponse:
        document = self._get_owned_document_or_404(document_id, user.id)
        return DocumentResponse.model_validate(document)

    def list_documents(self, user: UserContext, skip: int = 0, limit: int = 100) -> DocumentListResponse:

        self._validate_user(user)
        
        documents = self.repository.get_documents_by_user(user.id, skip, limit)
        total = self.repository.count_documents_by_user(user.id)
        
        return DocumentListResponse(
            total=total,
            documents=[DocumentResponse.model_validate(doc) for doc in documents]
        )


    async def upload_documents(self, files: List[UploadFile], user: UserContext) -> List[Document]:
        self._validate_user(user)
        file_paths = await storage.save_uploaded_files(files)
        
        documents = []
        for file_path in file_paths:
            file_info = storage.get_file_info(file_path)
            existing_doc = self.repository.get_document_by_filename(file_info["filename"])
            
            if existing_doc:
                self.repository.update_document_metadata(
                    existing_doc.id,
                    file_path=file_info["file_path"],
                    file_size_bytes=file_info["file_size_bytes"],
                    status="uploaded"
                )
                documents.append(existing_doc)
            else:
                document = self.repository.create_document(
                    filename=file_info["filename"],
                    file_path=file_info["file_path"],
                    file_type=file_info["file_type"],
                    chunks_count=0,
                    file_size_bytes=file_info["file_size_bytes"],
                    user_id=user.id,
                    status="uploaded"
                )
                documents.append(document)
        
        return documents
    # Security Section

    def _validate_user(self, user: UserContext) -> None:
        if not user or not user.id:
            raise InvalidAuthenticationContext("Invalid user context")

    def _get_owned_document_or_404(self, document_id: int, user_id: int) -> Document:

        document = self.repository.get_document_by_id(document_id)
        if not document:
            raise DocumentNotFound(f"Document with id {document_id} not found")
        
        if document.user_id != user_id:
            raise ForbiddenDocumentAccess("You don't have access to this document")
        
        return document
    
