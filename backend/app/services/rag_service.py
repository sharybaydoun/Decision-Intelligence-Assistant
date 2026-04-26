import time
import chromadb
from sentence_transformers import SentenceTransformer
from groq import Groq
import os

# -------------------------
# INIT GROQ CLIENT
# -------------------------
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# -------------------------
# Paths
# -------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CHROMA_PATH = os.path.join(BASE_DIR, "chroma_db")

# -------------------------
# Init DB (REAL DATA)
# -------------------------
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = chroma_client.get_or_create_collection(name="support_tickets")

# Embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# -------------------------
# Retrieval (REAL RAG)
# -------------------------
def retrieve_top_k(query, k=5):
    try:
        query_emb = embed_model.encode(query)

        results = collection.query(
            query_embeddings=[query_emb.tolist()],
            n_results=k
        )

        docs = results["documents"][0]
        scores = results["distances"][0]

        print("\n==== RAG DEBUG ====")
        print("QUERY:", query)
        print("TOP DOCS:", docs[:3])
        print("SCORES:", scores[:3])
        print("===================\n")

        return docs, scores

    except Exception as e:
        print("❌ Retrieval error:", e)
        return [], []

# -------------------------
# RAG vs NON-RAG ANSWER
# -------------------------
def rag_answer(query, use_rag=True):
    start = time.time()

    sources, scores = [], []

    if use_rag:
        sources, scores = retrieve_top_k(query)

        if sources and len(sources) > 0:
            context = "\n".join([f"- {doc}" for doc in sources[:3]])

            prompt = f"""
You are a customer support assistant.

Use the following similar past tickets to help answer the user:

{context}

Give a helpful and realistic answer based on patterns in these tickets.

User:
{query}

Answer:
"""
        else:
            prompt = f"""
You are a customer support assistant.

No similar past tickets were found.

Give a general helpful answer.

User:
{query}

Answer:
"""
    else:
        prompt = f"""
You are a customer support assistant.

Give a short, general response.

Do NOT use examples or past tickets.

User:
{query}

Answer:
"""

    # -------------------------
    # GROQ LLM CALL
    # -------------------------
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}]
    )

    end = time.time()

    answer = response.choices[0].message.content.strip()
    latency = (end - start) * 1000
    cost = 0.0

    return answer, sources, scores, latency, cost