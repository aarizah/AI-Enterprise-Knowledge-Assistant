from langchain.text_splitter import MarkdownHeaderTextSplitter, TokenTextSplitter
from langchain.schema import Document



def chunk_documents(docs):
    # 1. Split based on markdown structure (h1, h2, h3)
    # Setup markdown splitter. It uses h1, h2, h3 as headers
    markdown_splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[
            ("#", "h1"),
            ("##", "h2"),
            ("###", "h3"),
        ]
    )

    # Create a list of smaller document objects based on markdown structure. It creates new metadata for each chunk and then we merge it with the original metadata
    markdown_chunks = []

    for d in docs:  # en caso de que tengas varios Document del preprocesamiento
        parts = markdown_splitter.split_text(d.page_content)
        for p in parts:
            # fusionar metadata del preprocesamiento con la del splitter
            p.metadata.update(d.metadata)
            markdown_chunks.append(p)

    # 2. Re-split chunks that are too large using TokenTextSplitter

    # Setup token-based splitter
    token_splitter = TokenTextSplitter(
        chunk_size=2000,
        chunk_overlap=10
    )

    # final chunks is the list that will store the final chunks after token-based splitting. We also maintain metadata from previous steps.
    final_chunks = []
    for chunk in markdown_chunks:
        token_chunks = token_splitter.split_text(chunk.page_content)

        # Volver a Document y mantener metadata
        for i, t in enumerate(token_chunks):
            final_chunks.append(
                Document(
                    page_content=t,
                    metadata={**chunk.metadata, "split_id": i}
                )
            )


    
    return final_chunks

    # 3. Ejemplo de salida
    #print("\n--- Ejemplo de chunk final ---")
    #print("Metadata_Chunks:", final_chunks[3].metadata)
    #print("Texto:", final_chunks[3].page_content)



