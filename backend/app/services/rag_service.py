import time
import chromadb
from sentence_transformers import SentenceTransformer
from openai import OpenAI

# embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.PersistentClient(path="/app/chroma_db")
collection = chroma_client.get_collection(name="support_tickets")

# openai
client = OpenAI()


def retrieve_top_k(query, k=3):
    query_emb = embed_model.encode(query)

    results = collection.query(
        query_embeddings=[query_emb.tolist()],
        n_results=k
    )

    docs = results["documents"][0]
    scores = results["distances"][0]

    return docs, scores


def rag_answer(query, use_rag=True):
    start = time.time()

    sources = []
    scores = []
    context = ""

    if use_rag:
        sources, scores = retrieve_top_k(query)
        context = "\n".join(sources)

        prompt = f"""
        You are a customer support assistant.

        Use the following past tickets:
        {context}

        Question: {query}
        """
    else:
        prompt = f"""
        You are a customer support assistant.

        Answer this question:
        {query}
        """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    end = time.time()

    answer = response.choices[0].message.content
    latency = (end - start) * 1000
    cost = 0.001

    return answer, sources, scores, latency, cost