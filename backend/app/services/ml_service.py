import joblib
import numpy as np
import time

# load model once
pipeline = joblib.load("/app/models/pipeline.pkl")
# =========================
# FEATURE EXTRACTION
# =========================
def extract_features(text):
    text_lower = text.lower()

    urgent_keywords = [
        "refund", "broken", "cancel", "not working", "cant", "can't",
        "help", "urgent", "asap", "down", "error", "issue", "problem",
        "charged", "failed", "locked", "fraud", "stolen", "missing",
        "worst", "angry", "complaint", "overcharged"
    ]

    has_urgent_keyword = int(any(k in text_lower for k in urgent_keywords))
    num_exclamations = text.count("!")
    num_questions = text.count("?")

    words = text.split()
    caps_words = [w for w in words if w.isupper() and len(w) > 1]
    caps_ratio = len(caps_words) / len(words) if words else 0

    word_count = len(words)
    char_count = len(text)
    avg_word_length = np.mean([len(w) for w in words]) if words else 0
    contains_digit = int(any(c.isdigit() for c in text))
    contains_link = int("http" in text_lower or "www" in text_lower)

    return [[
        has_urgent_keyword,
        num_exclamations,
        caps_ratio,
        num_questions,
        word_count,
        char_count,
        avg_word_length,
        contains_digit,
        contains_link
    ]]


# =========================
# PREDICTION FUNCTION
# =========================
def predict_priority(text):
    start = time.time()

    features = extract_features(text)

    pred = pipeline.predict(features)[0]
    prob = pipeline.predict_proba(features)[0]

    end = time.time()

    latency = (end - start) * 1000
    confidence = float(np.max(prob))

    pred = int(pred)

    label = "urgent" if pred == 1 else "normal"

    return label, confidence, latency