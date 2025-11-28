"""
Embedder - Generación y almacenamiento de embeddings
"""
from typing import List, Dict, Any
from voyageai import Client
from sqlalchemy.orm import Session
from app.core.environment import settings
from app.modules.documents.models import Embedding


class Embedder:
    
    def __init__(self, db_session: Session):
        self.db = db_session
        self.client = Client(api_key=settings.VOYAGE_API_KEY)
    
    def generate_embeddings_from_chunks(self, chunks: List) -> List[Dict[str, Any]]:

        texts = [chunk.page_content for chunk in chunks]
        
        response = self.client.embed(
            model="voyage-3.5",
            texts=texts
        )
        
        embeddings_with_meta = [
            {
                "embedding": emb,
                "metadata": chunk.metadata,
                "text": chunk.page_content
            }
            for emb, chunk in zip(response.embeddings, chunks)
        ]
        
        return embeddings_with_meta
    
    def store_embeddings(self, embeddings_data: List[Dict[str, Any]], document_id: int) -> int:
        
        stored_count = 0
        
        try:
            for item in embeddings_data:
                embedding_record = Embedding(
                    embedding=item["embedding"],
                    meta_data=item["metadata"],
                    text=item["text"],
                    document_id=document_id
                )
                self.db.add(embedding_record)
                stored_count += 1
            
            self.db.commit()
            print(f"Stored {stored_count} embeddings in database")
            
        except Exception as e:
            print(f"Error preparing embeddings for storage: {e}")
            raise e
        
        return stored_count
    
    def generate_and_store_embeddings(self, chunks: List, document_id: int) -> int:

        embeddings_data = self.generate_embeddings_from_chunks(chunks)
        stored_count = self.store_embeddings(embeddings_data, document_id)
        return stored_count

    @staticmethod
    def generate_embedding_from_question(query: str):

        client = Client(api_key=settings.VOYAGE_API_KEY)
        
        response = client.embed(
            model="voyage-3.5",
            texts=[query]
        )
        
        return response.embeddings[0]