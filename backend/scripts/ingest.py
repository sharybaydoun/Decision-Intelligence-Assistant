import chromadb
from sentence_transformers import SentenceTransformer
import pandas as pd

df = pd.read_pickle("../data/embeddings/rag_chunks.pkl")

print("Loaded data:", df.shape)

# ✅ FIXED
client = chromadb.PersistentClient(path="../chroma_db")

collection = client.get_or_create_collection(name="support_tickets")

model = SentenceTransformer("all-MiniLM-L6-v2")

texts = df["chunk"].tolist()

print("Encoding embeddings...")
embeddings = model.encode(texts, batch_size=64)

print("Storing in DB...")
collection.add(
    documents=texts,
    embeddings=embeddings.tolist(),
    ids=[str(i) for i in range(len(texts))]
)

print("✅ Chroma DB created successfully!")