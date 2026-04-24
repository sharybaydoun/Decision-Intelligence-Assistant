# Decision Intelligence Assistant

## Overview
This project is a full-stack AI system that compares different approaches for answering customer support queries and predicting ticket priority.

The system combines:
- Retrieval-Augmented Generation (RAG)
- LLM without retrieval
- A trained Machine Learning model
- LLM zero-shot classification

The goal is to analyze tradeoffs between accuracy, latency, and cost.

---

## How to Run

Make sure Docker Desktop is running.

Then run:

docker compose up --build

Open the app in your browser:

http://localhost:5173

---

## Architecture

- Backend (FastAPI)  
  Handles:
  - ML predictions
  - LLM calls
  - RAG pipeline
  - Logging

- Frontend (React)  
  Displays:
  - Answers
  - Comparisons
  - Retrieved sources

- Vector Store (Chroma)  
  Persistent in-process database used for retrieval.

---

## Features

- RAG-based answers using retrieved tickets
- Non-RAG LLM answers
- ML priority prediction with confidence and latency
- LLM zero-shot priority prediction
- Side-by-side comparison of all outputs
- Logging of queries, results, latency, and cost

---

## Machine Learning Model

A Logistic Regression model is trained using engineered features such as:
- urgency keywords
- punctuation counts
- capitalization ratio
- text statistics (length, digits, links)

### Important Note

The labeling function uses similar features to the model inputs.  
This introduces label leakage under weak supervision, meaning the model partially learns the labeling rule.

This is expected and reflects real-world scenarios where labels are programmatically generated.

---

## Retrieval-Augmented Generation (RAG)

- Embeddings: all-MiniLM-L6-v2
- Vector database: Chroma (persistent)
- Top-k similar tickets are retrieved and passed as context to the LLM

---

## Comparison Logic

For each query, the system produces:

- RAG answer (LLM + context)
- Non-RAG answer (LLM only)
- ML prediction (label + confidence + latency)
- LLM prediction (label + latency + cost)

---

## Tradeoffs

- ML Model
  - Very fast (~ms)
  - No cost
  - Limited semantic understanding

- LLM
  - Better language understanding
  - Slower and costly

- RAG
  - More grounded responses
  - Depends on retrieval quality

---

## Final Recommendation

Use a hybrid system:

- ML model for fast, large-scale classification
- LLM for complex or uncertain cases

---

## Environment Variables

Create a .env file in the root:

OPENAI_API_KEY=your_api_key_here

---

## Project Structure

backend/ frontend/ docker-compose.yml .env.example README.md

---

## Known Limitations

- Weak supervision labeling
- Possible retrieval noise in RAG
- Approximate LLM cost estimation

---