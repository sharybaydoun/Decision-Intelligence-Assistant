from openai import OpenAI
import time

client = OpenAI()

def llm_predict_priority(text):
    start = time.time()

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You classify support tickets."},
            {"role": "user", "content": f"Is this urgent or normal? Answer only urgent or normal.\n{text}"}
        ]
    )

    end = time.time()

    answer = response.choices[0].message.content.strip().lower()

    latency = (end - start) * 1000
    cost = 0.001  # approximate

    return answer, latency, cost