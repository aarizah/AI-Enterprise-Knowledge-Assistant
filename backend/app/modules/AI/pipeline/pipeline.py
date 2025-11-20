from typing import List
from app.modules.AI.pipeline.chunking.pre_process import process_files
from app.modules.AI.pipeline.chunking.chunking import chunk_documents
from app.modules.AI.pipeline.embeddings.embeddings import generate_and_store_embeddings, generate_embedding_from_question
from app.modules.AI.pipeline.upload.repository import create_document, get_document_by_filename
from app.core.database import SessionLocal
from pathlib import Path


# ROUTE to the folder containing documents --- change as needed
#folder_path = Path("documents/synthetic_best")
# Process files in the specified folder
 
def gen_and_store_embeddings(file_paths: List[Path]):
    db = SessionLocal()
    try:
        # Ingesta
        results = process_files(file_paths)
        
        # Process each file
        for file_path in file_paths:
            filename = file_path.name
            file_type = file_path.suffix.lower().replace(".", "")
            
            # Get documents for this file
            docs = results.get(filename, [])
            if not docs:
                continue
            
            # Chunking
            final_chunks = chunk_documents(docs)
            
            # Check if document already exists
            existing_doc = get_document_by_filename(db, filename)
            
            if existing_doc:
                # Update existing document
                document_id = existing_doc.id
            else:
                # Create new document record
                file_size = file_path.stat().st_size if file_path.exists() else None
                document = create_document(
                    db=db,
                    filename=filename,
                    file_path=str(file_path),
                    file_type=file_type,
                    chunks_count=len(final_chunks),
                    file_size_bytes=file_size,
                    status="processed"
                )
                document_id = document.id
            
            # Generate and store embeddings with document_id
            generate_and_store_embeddings(final_chunks, document_id)
            
    finally:
        db.close() 


# RAG for a question
# It is in the generator folder where this function is used
  

