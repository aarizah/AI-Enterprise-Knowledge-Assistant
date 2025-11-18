# Integración Backend - Source References

## Diseño UI

El frontend muestra un **badge pequeño "Sources (N)"** en los mensajes del asistente. Al hacer clic, se abre un **popover a la derecha** que muestra:
- Lista numerada de referencias `[1]`, `[2]`, etc.
- Para cada referencia:
  - Nombre del documento y badges (página, relevancia)
  - Fragmento de texto en un recuadro gris
  - Metadata debajo (autor, fecha, sección)

## Estructura de Datos Requerida

### Tipo SourceReference

El backend debe retornar en cada mensaje del asistente un array de referencias de fuente con la siguiente estructura:

```typescript
interface SourceReference {
  id: string;                    // ID único de la referencia
  documentName: string;          // Nombre del documento fuente
  pageNumber?: number;           // Número de página (opcional)
  chunkId?: string;              // ID del chunk/fragmento (opcional)
  excerpt: string;               // Extracto del texto relevante
  relevanceScore?: number;       // Score de relevancia (0.0 - 1.0)
  metadata?: {                   // Metadata adicional (opcional)
    author?: string;
    date?: string;
    section?: string;
    [key: string]: any;
  };
}
```

### Ejemplo de Response del Backend

```json
{
  "id": "msg_123",
  "content": "Según los documentos legales, el plazo para presentar la apelación es de 30 días hábiles...",
  "sender": "assistant",
  "timestamp": "2024-11-17T10:30:00Z",
  "sources": [
    {
      "id": "ref_001",
      "documentName": "Código Procesal Civil - Título III.pdf",
      "pageNumber": 45,
      "chunkId": "chunk_789",
      "excerpt": "Artículo 123: El plazo para interponer recurso de apelación será de treinta (30) días hábiles contados desde la notificación de la resolución...",
      "relevanceScore": 0.92,
      "metadata": {
        "author": "Congreso Nacional",
        "date": "2023-05-15",
        "section": "Título III - De los Recursos"
      }
    },
    {
      "id": "ref_002",
      "documentName": "Jurisprudencia 2023.pdf",
      "pageNumber": 112,
      "excerpt": "La Corte Suprema establece que el cómputo de plazos procesales debe realizarse considerando únicamente días hábiles...",
      "relevanceScore": 0.85,
      "metadata": {
        "date": "2023-08-20",
        "section": "Sentencia N° 456/2023"
      }
    }
  ]
}
```

## Integración en el Pipeline RAG

### 1. En el Retriever
Cuando recuperes los chunks relevantes de la base de datos vectorial, guarda:
- El documento de origen
- El número de página
- El ID del chunk
- El score de similitud
- Metadata del documento

### 2. En el Generator
Después de generar la respuesta, incluye en el objeto Message:
```python
{
    "id": str(uuid.uuid4()),
    "content": generated_response,
    "sender": "assistant",
    "timestamp": datetime.now().isoformat(),
    "sources": [
        {
            "id": str(uuid.uuid4()),
            "documentName": chunk.metadata["document_name"],
            "pageNumber": chunk.metadata.get("page_number"),
            "chunkId": chunk.id,
            "excerpt": chunk.text[:300],  # Limitar a ~300 chars
            "relevanceScore": chunk.score,
            "metadata": {
                "author": chunk.metadata.get("author"),
                "date": chunk.metadata.get("date"),
                "section": chunk.metadata.get("section")
            }
        }
        for chunk in retrieved_chunks[:5]  # Top 5 fuentes
    ]
}
```

## Consideraciones Importantes

### 1. Número de Referencias
- Recomiendo retornar entre 3-5 referencias principales
- Ordena por relevanceScore descendente
- Filtra chunks muy similares (deduplicación)

### 2. Longitud del Excerpt
- Mantén excerpts entre 150-300 caracteres
- Si es muy largo, el usuario puede expandirlo en la UI
- Incluye contexto suficiente para entender la referencia

### 3. Metadata Opcional
Solo incluye metadata si está disponible:
- `author`: Autor del documento
- `date`: Fecha del documento o sección
- `section`: Sección/capítulo del documento

### 4. Performance
- Las referencias se cargan junto con el mensaje
- No requiere llamadas adicionales al backend
- Considera cachear metadata de documentos frecuentes

## Ejemplo de Implementación Python

```python
# En tu generator.py o router.py

def format_message_with_sources(
    content: str,
    retrieved_chunks: list,
    message_id: str
) -> dict:
    """
    Formatea el mensaje incluyendo las referencias de fuente
    """
    sources = []
    
    # Tomar los top 5 chunks más relevantes
    for chunk in retrieved_chunks[:5]:
        source = {
            "id": str(uuid.uuid4()),
            "documentName": chunk.metadata.get("document_name", "Unknown"),
            "excerpt": chunk.page_content[:300],  # Limitar excerpt
            "relevanceScore": round(chunk.similarity_score, 2)
        }
        
        # Agregar campos opcionales si existen
        if "page_number" in chunk.metadata:
            source["pageNumber"] = chunk.metadata["page_number"]
            
        if "chunk_id" in chunk.metadata:
            source["chunkId"] = chunk.metadata["chunk_id"]
        
        # Metadata adicional
        metadata = {}
        if "author" in chunk.metadata:
            metadata["author"] = chunk.metadata["author"]
        if "date" in chunk.metadata:
            metadata["date"] = chunk.metadata["date"]
        if "section" in chunk.metadata:
            metadata["section"] = chunk.metadata["section"]
            
        if metadata:
            source["metadata"] = metadata
            
        sources.append(source)
    
    return {
        "id": message_id,
        "content": content,
        "sender": "assistant",
        "timestamp": datetime.now().isoformat(),
        "sources": sources
    }
```

## Testing

Para probar la integración, puedes usar datos mockeados:

```python
# Ejemplo de mensaje con fuentes para testing
test_message = {
    "id": "test_msg_1",
    "content": "Esta es una respuesta de prueba...",
    "sender": "assistant",
    "timestamp": "2024-11-17T10:30:00Z",
    "sources": [
        {
            "id": "ref_test_1",
            "documentName": "Documento de Prueba.pdf",
            "pageNumber": 10,
            "excerpt": "Este es un extracto de ejemplo del documento que contiene información relevante...",
            "relevanceScore": 0.95
        }
    ]
}
```
