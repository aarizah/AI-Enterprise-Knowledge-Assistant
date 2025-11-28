"""
Pipeline de ingestion - Orquestador del procesamiento de documentos
"""
from pathlib import Path
from typing import List, Dict, Any
from sqlalchemy.orm import Session

from .preprocessing.preprocessor import Preprocessor
from .chunks.chunker import Chunker
from .embeddings.embedder import Embedder
from app.modules.documents.s3_utils import FileUtils
from app.modules.documents.repository import DocumentRepository


class IngestionPipeline:
    """Pipeline completo de ingestion de documentos"""
    
    def __init__(self, db_session: Session, file_utils: FileUtils):
        self.db = db_session
        self.file_utils = file_utils
        
        # Inicializar componentes del pipeline
        self.preprocessor = Preprocessor()
        self.chunker = Chunker()
        self.embedder = Embedder(db_session)
        self.repository = DocumentRepository(db_session)
    
    
    def process_documents(self, document_ids: List[int]) -> List[Dict[str, Any]]:
        results = []
        
        for document_id in document_ids:
            try:
                # Get document
                document = self.repository.get_document_by_id(document_id)
                if not document:
                    raise ValueError(f"Document with id {document_id} not found")
                
                file_path = Path(document.file_path)
                if not self.file_utils.file_exists(file_path):
                    raise FileNotFoundError(f"File not found: {document.file_path}")
                
                # Marcar como procesando
                self.repository.update_document_status(document_id, "processing")
                
                # 1. Pre-procesar archivo
                process_results = self.preprocessor.process_files([file_path])
                docs = process_results.get(document.filename, [])
                
                if not docs:
                    self.repository.update_document_status(document_id, "failed")
                    raise ValueError(f"No content could be extracted from {document.filename}")
                
                # 2. Crear chunks
                final_chunks = self.chunker.chunk_documents(docs)
                
                if not final_chunks:
                    self.repository.update_document_status(document_id, "failed")
                    raise ValueError(f"No chunks could be created from {document.filename}")
                
                # 3. Generar y guardar embeddings
                stored_count = self.embedder.generate_and_store_embeddings(final_chunks, document_id)
                
                # 4. Actualizar documento con chunks count y estado
                self.repository.update_document_processing_result(
                    document_id, 
                    chunks_count=len(final_chunks), 
                    status="processed"
                )
                
                results.append({
                    "document_id": document_id,
                    "filename": document.filename,
                    "status": "processed",
                    "chunks_count": len(final_chunks),
                    "embeddings_stored": stored_count
                })
                
            except Exception as e:
                # Si hay error, actualizar estado
                self.repository.update_document_status(document_id, "failed")
                results.append({
                    "document_id": document_id,
                    "status": "failed",
                    "error": str(e)
                })
        
        return results
    
    def validate_file_for_processing(self, file_path: Path) -> bool:
        """
        Valida si un archivo puede ser procesado
        
        Args:
            file_path: Ruta del archivo
            
        Returns:
            True si puede procesarse, False si no
        """
        if not self.file_utils.file_exists(file_path):
            return False
        
        return self.preprocessor.is_supported_file(file_path)