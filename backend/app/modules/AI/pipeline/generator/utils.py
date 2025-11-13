# File used to adapt our workflow and connect it with LangChain

from langchain.schema import Document
from typing import List, Dict
# src/retriever.py
from langchain.schema.retriever import BaseRetriever
from app.modules.AI.pipeline.embeddings.embeddings import retrieve_answer

def to_documents(serialized_results: List[Dict]) -> List[Document]:
    """
    Convierte los resultados serializados de la base de datos
    (lista de dicts con 'text' y 'meta_data') en objetos Document
    compatibles con LangChain.
    """
    documents = []
    for item in serialized_results:
        text = item.get("text", "")
        metadata = item.get("meta_data", {}) or {}
        # Por si algún registro no tiene metadata, garantizamos que sea dict
        doc = Document(page_content=text, metadata=metadata)
        documents.append(doc)
    return documents

# Wrapper to use langchain
class CustomDBRetriever(BaseRetriever):
    """Retriever que usa tu base de datos con embeddings almacenados."""
    def get_relevant_documents(self, query: str) -> List[Document]:
        serialized_results = retrieve_answer(query)
        return to_documents(serialized_results)