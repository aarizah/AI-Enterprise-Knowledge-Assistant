
from app.modules.chat.retrieval.retriever import retrieve_relevant_chunks
from app.modules.chat.retrieval.generator import generate_answer
from app.modules.chat.exceptions import ChunkRetrievalError, LLMServiceError


class ChatService:
    def answer_query(self, query: str):
        chunks = retrieve_relevant_chunks(query, top_k=5)
        if not chunks:
            return {
                "answer": "I don't have any relevant information to answer that question.",
                "sources": []
            }
        result = generate_answer(query, chunks)
        return result
