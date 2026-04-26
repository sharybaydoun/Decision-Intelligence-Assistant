import json
from datetime import datetime
import numpy as np
import os

# Resolve base directory (backend/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_FILE = os.path.join(LOG_DIR, "queries.jsonl")

# Ensure logs folder exists
os.makedirs(LOG_DIR, exist_ok=True)


def convert_types(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return str(obj)


def log_query(data):
    with open(LOG_FILE, "a") as f:
        f.write(json.dumps({
            "timestamp": str(datetime.now()),
            **data
        }, default=convert_types) + "\n")