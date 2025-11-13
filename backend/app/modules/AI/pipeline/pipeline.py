from typing import List
from app.modules.AI.pipeline.chunking.pre_process import process_files
from app.modules.AI.pipeline.chunking.chunking import chunk_documents
from app.modules.AI.pipeline.embeddings.embeddings import generate_and_store_embeddings, generate_embedding_from_question
from pathlib import Path


# ROUTE to the folder containing documents --- change as needed
#folder_path = Path("documents/synthetic_best")
# Process files in the specified folder

 
def gen_and_store_embeddings(file_paths: List[Path]):

    # Ingesta
    results = process_files(file_paths)
    # Flatten the list of documents from all files
    docs = []
    for doc_list in results.values():
        docs.extend(doc_list)
    
    # Chunking
    final_chunks = chunk_documents(docs)
    # Generate Embeddings
    generate_and_store_embeddings(final_chunks) 


# RAG for a question
# It is in the generator folder where this function is used
  

