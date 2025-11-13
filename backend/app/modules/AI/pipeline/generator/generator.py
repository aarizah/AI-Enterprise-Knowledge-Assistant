# app/modules/AI/pipeline/generator/generator.py

from typing import Dict
from app.core.environment import settings
from app.modules.AI.pipeline.generator.utils import CustomDBRetriever
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain

def generate_answer_from_db(query: str) -> Dict:
    # 1. Create the retriever
    retriever = CustomDBRetriever()

    # 2. Initialize the LLM with API key
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.0,
        api_key=settings.OPENAI_API_KEY
    )

    # 3. Create prompt template
    prompt = ChatPromptTemplate.from_template(
        """
        Use the following context to answer the question.
        If the answer is not in the context, say: "I don't have that information."

        Context:
        {context}

        Question:
        {input}
        """
    )

    # 4. Create chain to combine documents
    combine_docs_chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt
    )

    # 5. Create retrieval chain
    chain = create_retrieval_chain(
        retriever=retriever,
        combine_docs_chain=combine_docs_chain
    )

    # 6. Execute the query
    result = chain.invoke({"input": query})

    # 7. Return answer + source documents
    return {
        "answer": result["answer"],
        "source_documents": result.get("context", [])
    }
