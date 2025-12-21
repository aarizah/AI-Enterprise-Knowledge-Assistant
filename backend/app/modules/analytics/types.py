from enum import Enum

class EventType(str, Enum):
    """Tipos de eventos disponibles para analytics"""
    
    # Eventos completos
    RAG_QUERY_COMPLETED = "rag_query_completed"
    DOCUMENT_INGESTED = "document_ingested"
    DOCUMENT_DELETED = "document_deleted"



