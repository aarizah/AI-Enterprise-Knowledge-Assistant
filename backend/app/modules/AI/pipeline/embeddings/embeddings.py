# GENERATE EMBEDDINGS
from sqlalchemy import select
from voyageai import Client
from app.core.environment import settings
from app.core.database import SessionLocal
from app.modules.AI.pipeline.embeddings.models import Embedding
import os

def generate_and_store_embeddings(final_chunks, document_id: int = None):
    # GENERATE EMBEDDINGS
    embeddings_with_meta = generate_embeddings_from_chunks(final_chunks)
    # STORE EMBEDDINGS
    store_embeddings(embeddings_with_meta, document_id)

def generate_embeddings_from_chunks(final_chunks):
    # 1. Initialize Voyage AI client
    # Use configured key directly (settings already reads env)
    client = Client(api_key=settings.VOYAGE_API_KEY)
    # 2. Extract text data for embedding
    texts = [chunk.page_content for chunk in final_chunks]

    # 3. Generate embeddings
    response = client.embed(
        model="voyage-3.5", 
        texts=texts
    )
    # 4. Combine embeddings with metadata
    embeddings_with_meta = [
        {
            "embedding": emb,
            "metadata": chunk.metadata,
            "text": chunk.page_content
        }
        for emb, chunk in zip(response.embeddings, final_chunks)
    ]

    # 5. Example output
    #print("--- Example Embedding ---")
    #print("Vector length:", len(embeddings_with_meta[0]["embedding"]))
    #print("Metadata:", embeddings_with_meta[0]["metadata"])
    #print("Text snippet:", embeddings_with_meta[0]["text"][:100])
    return embeddings_with_meta

def store_embeddings(embeddings_with_meta: list[dict], document_id: int = None):
    db = SessionLocal()
    try:
        for item in embeddings_with_meta:
            embedding_record = Embedding(
                embedding=item["embedding"],
                meta_data=item["metadata"],
                text=item["text"],
                document_id=document_id
            )
            db.add(embedding_record)
        db.commit()
        print(f"Stored {len(embeddings_with_meta)} embeddings in the database.")
    except Exception as e:
        db.rollback()
        print("Error storing embeddings:", e)
    finally:
        db.close()

def generate_embedding_from_question(query: str):
    client = Client(api_key=settings.VOYAGE_API_KEY)

    response = client.embed(
        model="voyage-3.5",
        texts=[query]
    )

    return response.embeddings[0]  # Return the embedding vector for the query

def retrieve_answer(query: str):
    query_embedding = generate_embedding_from_question(query)

    stmt = (
        select(Embedding)
        .order_by(Embedding.embedding.l2_distance(query_embedding))
        .limit(2)
    )

    with SessionLocal() as session:
        results = session.execute(stmt).scalars().all()
        serialized_results = []
        for e in results:
            serialized_results.append({
                #"id": e.id,
                "text": e.text,
                "meta_data": e.meta_data
                # 🔽 Convierte el vector a lista Python nativa
                #"embedding": list(map(float, e.embedding)) if e.embedding is not None else None,
            })
    return serialized_results

