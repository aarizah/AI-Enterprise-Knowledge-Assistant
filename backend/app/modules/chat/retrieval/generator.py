from typing import Dict, List
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.schema import Document
from app.core.environment import settings


def generate_answer(query: str, chunks: List[Dict[str, any]]) -> Dict[str, any]:
    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.0,
            api_key=settings.OPENAI_API_KEY
        )
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
        documents = [Document(page_content=chunk["text"], metadata=chunk.get("metadata", {})) for chunk in chunks]
        combine_docs_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)
        result = combine_docs_chain.invoke({
            "input": query,
            "context": documents
        })
        return {
            "answer": result,
            "sources": chunks
        }
    except Exception as e:
        from app.modules.chat.exceptions import LLMServiceError
        raise LLMServiceError(f"Error invoking the LLM: {str(e)}")
