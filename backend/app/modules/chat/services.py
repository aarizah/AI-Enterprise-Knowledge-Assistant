
from app.modules.chat.retrieval.retriever import retrieve_relevant_chunks
from app.modules.chat.retrieval.generator import generate_answer
from app.modules.chat.exceptions import ChunkRetrievalError, LLMServiceError
from app.modules.analytics.repository import AnalyticsRepository
from app.modules.analytics.types import EventType
from app.modules.chat.pricing import calculate_prices

import time


class ChatService:
    def answer_query(self, query: str, request, user: dict, db):
        vector_start = time.time()
        chunks = retrieve_relevant_chunks(query, user_id=user.id, top_k=5)
        if not chunks:
            return {
                "answer": "I don't have any relevant information to answer that question.",
                "sources": []
            }
        vector_end = time.time()
        request.state.meta["vector_retrieval_time"] = vector_end - vector_start
        
        llm_start = time.time()
        result = generate_answer(query, chunks)
        llm_end = time.time()
        request.state.meta["llm_response_time"] = llm_end - llm_start

        process_time = time.time() - request.state.start_time

        if result["answer"]=="I don't have that information.":
            request.state.meta["no_answer"] = True
        else:
            request.state.meta["no_answer"] = False

        if "sources" in result and result["sources"]:
            request.state.meta["response_quality"] = result["sources"][0]["relevance_score"]
        else : 
            request.state.meta["response_quality"] = None

        vector_cost, llm_total_cost=calculate_prices(chunks, result["answer"], query, request)
            # Guardar en metadata
        request.state.meta["vector_cost"] = round(vector_cost, 6)
        request.state.meta["llm_total_cost"] = round(llm_total_cost, 6)

        repo = AnalyticsRepository(db)
        repo.create_event(user_id=user.id, event_type=EventType.RAG_QUERY_COMPLETED , value=process_time, meta=request.state.meta)


        return result


