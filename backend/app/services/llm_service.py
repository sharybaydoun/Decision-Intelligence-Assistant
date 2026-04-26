from groq import Groq
import time
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def llm_predict_priority(text):
    start = time.time()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # fast + strong
        messages=[
            {"role": "system", "content": "You classify support tickets."},
            {"role": "user", "content": f"Is this urgent or normal? Answer only urgent or normal.\n{text}"}
        ]
    )

    end = time.time()

    answer = response.choices[0].message.content.strip().lower()

    latency = (end - start) * 1000
    cost = 0.0  # Groq is free for demo

    return answer, latency, cost