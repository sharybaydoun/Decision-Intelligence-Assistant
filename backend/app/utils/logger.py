import json
from datetime import datetime
import numpy as np

def convert_types(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return str(obj)


def log_query(data):
        with open("/app/logs/queries.jsonl", "a") as f:
        f.write(json.dumps({
            "timestamp": str(datetime.now()),
            **data
        }, default=convert_types) + "\n")