from fastapi import APIRouter, Depends
from fastapi import UploadFile, File, Form, HTTPException
from typing import List, Optional
from sqlalchemy.orm import Session
from app.modules.AI.pipeline.generator.generator import generate_answer_from_db
from app.modules.AI.pipeline.pipeline import gen_and_store_embeddings
from app.modules.AI.pipeline.embeddings.embeddings import retrieve_answer
from pathlib import Path
from app.modules.AI.schemas import QueryRequest, DocumentListResponse, DocumentResponse
from app.modules.AI.pipeline.upload.uploader import upload_files
from app.modules.AI.pipeline.upload.repository import get_all_documents, count_documents, delete_document, get_document_by_id
from app.core.database import get_db

router = APIRouter(prefix="/ai", tags=["AI"])

BASE_DIR = Path(__file__).resolve().parent  # -> /app/app/modules/AI
predefined_folder = BASE_DIR / "documents" / "synthetic_best"
predefined_file = predefined_folder / "Annual_Report.docx"

@router.get("/run")
def run_gen_and_store_embeddings_from_default_documents():
    # Pass the Annual_Report.docx file as a list of paths
    gen_and_store_embeddings([predefined_file])
    return {"message": "Embedding generation and storage executed successfully."}

@router.post("/retrieve_from_query")
def get_answer_from_query(request: QueryRequest):
    answer = retrieve_answer(request.query)
    return {"answer": answer}

@router.post("/rag_from_query")
def get_answer_from_query(request: QueryRequest):
    answer = generate_answer_from_db(request.query)
    return {"answer": answer}

import traceback

@router.post("/upload_documents")
async def upload_documents(
    files: List[UploadFile] = File(...),
    fileNames: Optional[List[str]] = Form(None),
):
    try:
        paths = await upload_files(files, fileNames)
        gen_and_store_embeddings(paths)
        return {"message": "Files uploaded and ingested successfully."}
    except Exception as e:
        traceback.print_exc()  # Logs full traceback to backend
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}")

@router.get("/documents", response_model=DocumentListResponse)
def list_documents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Obtener lista de todos los documentos subidos"""
    documents = get_all_documents(db, skip=skip, limit=limit)
    total = count_documents(db)
    return DocumentListResponse(
        total=total,
        documents=[DocumentResponse.model_validate(doc) for doc in documents]
    )

@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Obtener información de un documento específico"""
    document = get_document_by_id(db, document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse.model_validate(document)

@router.delete("/documents/{document_id}")
def remove_document(document_id: int, db: Session = Depends(get_db)):
    """Eliminar un documento y todos sus embeddings asociados"""
    success = delete_document(db, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": f"Document {document_id} and associated embeddings deleted successfully"}