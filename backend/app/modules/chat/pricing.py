import tiktoken

def calculate_indexing_cost(chunks):

    price_per_1M_tokens_embedding = 0.06  # voyage 3.5
    
    encoder = tiktoken.get_encoding("cl100k_base")
    
    # Calcular tokens totales de todos los chunks
    total_tokens = 0
    for chunk in chunks:
        # Manejar tanto objetos LangChain Document como dicts
        if hasattr(chunk, 'page_content'):
            text = chunk.page_content
        elif hasattr(chunk, 'text'):
            text = chunk.text
        elif isinstance(chunk, dict):
            text = chunk.get("text", "")
        else:
            text = str(chunk)
        total_tokens += len(encoder.encode(text))
    
    # Calcular costo de embeddings
    embedding_cost = (total_tokens / 1000000) * price_per_1M_tokens_embedding
    
    return round(embedding_cost, 6)  # Por ahora solo embeddings, puede incluir otros costos después
    


def calculate_prices(chunks, answer, query, request):
    price_per_1M_tokens_vector = 0.06  # Precio por 1000 tokens para recuperación vectorial
    price_per_1M_tokens_llm_input = 0.15  # gpt-4o-mini
    price_per_1M_tokens_llm_output = 0.60  # gpt-4o-mini

    # Inicializar encoder de tiktoken (usando cl100k_base que es para GPT-3.5/GPT-4)
    encoder = tiktoken.get_encoding("cl100k_base")
    
    # Hallar el numero de tokens de todos los chunks y del query para saber el numero de tokens de input al llm
    chunks_text = " ".join([chunk.get("text", "") for chunk in chunks])
    llm_input_text = query + " " + chunks_text
    llm_input_tokens = len(encoder.encode(llm_input_text))
    
    # Hallar el numero de tokens del output del llm
    llm_output_tokens = len(encoder.encode(answer))
    
    # Tokens para recuperación vectorial (query)
    vector_tokens = len(encoder.encode(query))
    
    # Calcular costos
    vector_cost = (vector_tokens / 1000000) * price_per_1M_tokens_vector
    llm_input_cost = (llm_input_tokens / 1000000) * price_per_1M_tokens_llm_input
    llm_output_cost = (llm_output_tokens / 1000000) * price_per_1M_tokens_llm_output
    llm_total_cost = llm_input_cost + llm_output_cost
    

    return [vector_cost, llm_total_cost]