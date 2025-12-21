import math

from app.modules.analytics.repository import AnalyticsRepository
from app.modules.analytics.types import EventType
from app.modules.documents.repository import DocumentRepository

class AnalyticsService:
    def __init__(self, db_session):
        self.db_session = db_session

    def get_analytics(self, user):
        user_id= user.id
        analytics_repo = AnalyticsRepository(self.db_session)
        rag_events= analytics_repo.get_events_by_user_and_type(user_id, EventType.RAG_QUERY_COMPLETED)
        # RAG EVENTS METRICS
        # citation rate = 1- no_answer rate
        # no_answer rate = number of no_answer(no_answer=true) / total answers
        # avg response time = sum of response times / total answers
        # Query Volume = total answers
        # High confidence response in porcentage = number of relevance_score >0.7 / total answers
        # Medium confidence response = 0.5 < number of relevance_score <= 0.7  / total answers
        # Low confidence response = number relevance_score <= 0.5 / total answers
        # 

        no_answer_count = sum(1 for event in rag_events if event.meta and event.meta.get("no_answer"))
        no_answer_rate = no_answer_count / len(rag_events) if rag_events else 0
        citation_rate = 1 - no_answer_rate
        avg_response_time = sum(event.value for event in rag_events) / len(rag_events) if rag_events else 0
        high_confidence_count = sum(1 for event in rag_events if event.meta and event.meta.get("response_quality") and event.meta.get("response_quality") > 0.7)
        medium_confidence_count = sum(1 for event in rag_events if event.meta and event.meta.get("response_quality") and 0.5 < event.meta.get("response_quality") <= 0.7)
        low_confidence_count = sum(1 for event in rag_events if event.meta and event.meta.get("response_quality") and event.meta.get("response_quality") <= 0.5)
        total_answers = len(rag_events)
        high_confidence_rate = high_confidence_count / total_answers if total_answers else 0
        medium_confidence_rate = medium_confidence_count / total_answers if total_answers else 0
        low_confidence_rate = low_confidence_count / total_answers if total_answers else 0
        vector_cost = sum(event.meta.get("vector_cost", 0) for event in rag_events if event.meta)
        llm_total_cost = sum(event.meta.get("llm_total_cost", 0) for event in rag_events if event.meta)
        vector_retrieval_time_avg = sum(event.meta.get("vector_retrieval_time", 0) for event in rag_events if event.meta) / total_answers if total_answers else 0
        llm_response_time_avg = sum(event.meta.get("llm_response_time", 0) for event in rag_events if event.meta) / total_answers if total_answers else 0
        
        # Calculate P95 values using ceil for correct percentile calculation
        vector_p95 = sorted([event.meta.get("vector_retrieval_time", 0) for event in rag_events if event.meta])
        llm_p95 = sorted([event.meta.get("llm_response_time", 0) for event in rag_events if event.meta])
        response_p95 = sorted([event.value for event in rag_events])
        
        vector_p95_value = vector_p95[math.ceil(0.95 * len(vector_p95)) - 1] if vector_p95 else 0
        llm_p95_value = llm_p95[math.ceil(0.95 * len(llm_p95)) - 1] if llm_p95 else 0
        response_p95_value = response_p95[math.ceil(0.95 * len(response_p95)) - 1] if response_p95 else 0


        # DOCUMENT
        documents_repo= DocumentRepository(self.db_session)
        documents= documents_repo.get_documents_by_user(user_id)
        total_indexing_cost= sum(doc.indexing_cost for doc in documents if doc.indexing_cost)


        return { 
                "citation_rate": citation_rate,
                "no_answer_rate": no_answer_rate,
                "avg_response_time": avg_response_time,
                "query_volume": total_answers,
                "high_confidence_rate": high_confidence_rate,
                "medium_confidence_rate": medium_confidence_rate,
                "low_confidence_rate": low_confidence_rate,
                "vector_cost": vector_cost,
                "llm_total_cost": llm_total_cost,
                "vector_retrieval_time_avg": vector_retrieval_time_avg,
                "llm_response_time_avg": llm_response_time_avg,
                "vector_retrieval_time_p95": vector_p95_value,
                "llm_response_time_p95": llm_p95_value,
                "response_time_p95": response_p95_value,
                "total_indexing_cost": total_indexing_cost
               }


def middleware_function():
    pass