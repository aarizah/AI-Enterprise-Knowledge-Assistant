from fastapi import APIRouter
from fastapi import UploadFile, File, Form, HTTPException
from typing import List, Optional
from app.modules.AI.pipeline.generator.generator import generate_answer_from_db
from app.modules.AI.pipeline.pipeline import gen_and_store_embeddings
from app.modules.AI.pipeline.embeddings.embeddings import retrieve_answer
from pathlib import Path
from app.modules.AI.schemas import QueryRequest
from app.modules.AI.pipeline.upload.uploader import upload_files


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