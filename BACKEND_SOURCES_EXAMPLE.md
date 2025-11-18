# Ejemplo de Integración Backend para Source References

## Vista del Frontend

El usuario verá:

```
┌─────────────────────────────────────────────────────────┐
│  🤖 Legal Assistant                                     │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Según los documentos legales, el plazo para...   │ │
│  └───────────────────────────────────────────────────┘ │
│  📖 Sources (3)  ← Botón pequeño clickeable           │
└─────────────────────────────────────────────────────────┘
```

Al hacer clic en "Sources (3)" se abre un popover a la derecha:

```
┌──────────────────────────────────┐
│ 📄 Source References             │
│ 3 sources found                  │
├──────────────────────────────────┤
│ [1] Código Procesal Civil.pdf   │
│     p.45  92%                    │
│  ┌────────────────────────────┐ │
│  │ Artículo 123: El plazo... │ │
│  │ ...texto del fragmento    │ │
│  └────────────────────────────┘ │
│  Author: Congreso Nacional      │
│  Date: 2023-05-15               │
│  Section: Título III            │
│ ─────────────────────────────── │
│ [2] Jurisprudencia 2023.pdf     │
│     p.112  85%                   │
│  ┌────────────────────────────┐ │
│  │ La Corte establece que... │ │
│  └────────────────────────────┘ │
│  Date: 2023-08-20               │
└──────────────────────────────────┘
```

## Adaptación del Backend

### Ejemplo en Python (FastAPI)

```python
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class SourceReference(BaseModel):
    id: str
    documentName: str
    pageNumber: Optional[int] = None
    chunkId: Optional[str] = None
    excerpt: str
    relevanceScore: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None

class MessageResponse(BaseModel):
    id: str
    content: str
    sender: str
    timestamp: str
    sources: Optional[List[SourceReference]] = None

@router.post("/rag_from_query")
async def rag_from_query(query: str):
    # 1. Retrieve relevant chunks
    retrieved_chunks = await vector_store.similarity_search(
        query, 
        k=5
    )
    
    # 2. Generate response
    generated_answer = await llm.generate(
        query=query,
        context=retrieved_chunks
    )
    
    # 3. Format sources
    sources = []
    for idx, chunk in enumerate(retrieved_chunks):
        source = SourceReference(
            id=f"ref_{idx}_{chunk.id}",
            documentName=chunk.metadata.get("document_name", "Unknown"),
            pageNumber=chunk.metadata.get("page_number"),
            chunkId=chunk.id,
            excerpt=chunk.text[:300],  # Primeros 300 caracteres
            relevanceScore=chunk.similarity_score,
            metadata={
                "author": chunk.metadata.get("author"),
                "date": chunk.metadata.get("date"),
                "section": chunk.metadata.get("section"),
            }
        )
        sources.append(source)
    
    # 4. Return response
    return {
        "answer": MessageResponse(
            id=str(uuid.uuid4()),
            content=generated_answer,
            sender="assistant",
            timestamp=datetime.now().isoformat(),
            sources=sources
        )
    }
```

### Modificación del Endpoint Existente

Tu endpoint actual retorna:
```python
return {
    "answer": {
        "answer": "respuesta generada..."
    }
}
```

Debes cambiarlo a:
```python
return {
    "answer": {
        "answer": "respuesta generada...",
        "sources": [
            {
                "id": "ref_001",
                "documentName": "documento.pdf",
                "pageNumber": 45,
                "excerpt": "texto del fragmento...",
                "relevanceScore": 0.92,
                "metadata": {
                    "author": "Autor",
                    "date": "2023-05-15",
                    "section": "Capítulo III"
                }
            }
        ]
    }
}
```

### Actualización del chatService.ts

El frontend ya está preparado. Cuando el backend retorne las fuentes, debes parsearlas:

```typescript
// En generateResponse()
const data = await response.json();

// Crear el mensaje con sources
const assistantMessage = ChatService.createMessage(
  data.answer.answer || "Could not process the query.",
  "assistant"
);

// Agregar sources si existen
if (data.answer.sources) {
  assistantMessage.sources = data.answer.sources;
}

return assistantMessage;
```

## Campos Importantes

### Requeridos
- ✅ `id`: Identificador único
- ✅ `documentName`: Nombre del documento
- ✅ `excerpt`: Fragmento de texto (150-300 caracteres)

### Opcionales pero recomendados
- `pageNumber`: Número de página (se muestra como badge)
- `relevanceScore`: 0.0-1.0 (se muestra como porcentaje)
- `metadata.author`: Autor del documento
- `metadata.date`: Fecha del documento
- `metadata.section`: Sección/capítulo

## Tips de Implementación

1. **Limita el excerpt**: 200-300 caracteres es ideal
2. **Top 3-5 fuentes**: No retornes más de 5 referencias
3. **Ordena por score**: Mayor relevancia primero
4. **Deduplica**: Si dos chunks son del mismo documento y página, combínalos
5. **Limpia el texto**: Elimina caracteres extraños del excerpt

## Testing Rápido

Para probar sin modificar tu pipeline, puedes mockear temporalmente:

```python
@router.post("/rag_from_query")
async def rag_from_query(query: str):
    # Tu código existente...
    generated_answer = # ... tu lógica actual
    
    # Mock sources para testing
    mock_sources = [
        {
            "id": "test_1",
            "documentName": "Documento de Prueba.pdf",
            "pageNumber": 10,
            "excerpt": "Este es un fragmento de ejemplo del documento que muestra cómo se verá en el frontend.",
            "relevanceScore": 0.95,
            "metadata": {
                "author": "Autor de Prueba",
                "date": "2024-01-15",
                "section": "Capítulo 1"
            }
        }
    ]
    
    return {
        "answer": {
            "answer": generated_answer,
            "sources": mock_sources
        }
    }
```
