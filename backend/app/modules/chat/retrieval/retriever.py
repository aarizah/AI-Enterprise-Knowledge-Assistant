from typing import List, Dict
from app.modules.documents.indexing_pipeline.embeddings.embedder import Embedder
from sqlalchemy import select, func
from app.modules.documents.models import Embedding, Document
from app.core.database import SessionLocal


def _normalize_relevance_score(raw_score: float) -> float:
    """
    Normalize relevance score with custom mapping:
    - 0-20%: maps to 0-40%
    - 20-35%: maps to 40-80%
    - 35-50%: maps to 80-95%
    - 50-100%: maps to 95-100%
    """
    if raw_score <= 20:
        # Linear interpolation: 0-20 -> 0-40
        return (raw_score / 20) * 40
    elif raw_score <= 35:
        # Linear interpolation: 20-35 -> 40-80
        return 40 + ((raw_score - 20) / 15) * 40
    elif raw_score <= 50:
        # Linear interpolation: 35-50 -> 80-95
        return 80 + ((raw_score - 35) / 15) * 15
    else:
        # Linear interpolation: 50-100 -> 95-100
        return 95 + ((raw_score - 50) / 50) * 5


def retrieve_relevant_chunks(query: str, user_id: int, top_k: int = 5) -> List[Dict[str, any]]:
    """
    Retrieve the most relevant chunks for a given query from the user's documents.
    
    Args:
        query: The search query
        user_id: The ID of the user to filter documents by
        top_k: Number of top results to return
    
    Returns chunks with relevance scores calculated from cosine similarity:
    - relevance_score: cosine similarity (0-1, higher is more relevant)
    - cosine_distance: raw cosine distance (lower is more similar)
    """
    try:
        query_embedding = Embedder.generate_embedding_from_question(query)
        
        # Calculate cosine distance for ordering and relevance scoring
        distance_calc = Embedding.embedding.cosine_distance(query_embedding)
        
        stmt = (
            select(Embedding, distance_calc.label('cosine_distance'))
            .join(Document, Embedding.document_id == Document.id)
            .where(Document.user_id == user_id)
            .order_by(distance_calc)
            .limit(top_k)
        )
        
        with SessionLocal() as session:
            results = session.execute(stmt).all()
            chunks = []
            
            for row in results:
                embedding_obj = row[0]
                cosine_distance = float(row[1])
                
                # Convert cosine distance to similarity score (0-100%, higher = more relevant)
                # Cosine similarity = 1 - cosine distance
                raw_score = (1.0 - cosine_distance) * 100
                
                # Apply custom normalization
                relevance_score = _normalize_relevance_score(raw_score)
                
                chunks.append({
                    "text": embedding_obj.text,
                    "metadata": embedding_obj.meta_data,
                    "document_id": embedding_obj.document_id,
                    "relevance_score": round(relevance_score, 2),
                    "cosine_distance": round(cosine_distance, 4)
                })
        
        return chunks
    except Exception as e:
        from app.modules.chat.exceptions import ChunkRetrievalError
        raise ChunkRetrievalError(f"Error retrieving chunks from the database: {str(e)}")
