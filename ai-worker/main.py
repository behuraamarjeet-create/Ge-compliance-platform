import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI

app = FastAPI(title="GE Compliance AI Worker", version="0.1.0")
MOCK_DATA_PATH = Path(__file__).with_name("mock_data.json")


def load_mock_data() -> list[dict[str, Any]]:
    with MOCK_DATA_PATH.open(encoding="utf-8") as mock_file:
        return json.load(mock_file)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "mock-data", "ollama": os.getenv("OLLAMA_URL", "not-configured")}


@app.get("/bidders")
def bidders() -> dict[str, Any]:
    return {"source": "mock_data.json", "items": load_mock_data()}


# Example logic to add in verifier.py
import json

def get_mock_data(gstin):
    with open('mock_data.json', 'r') as f:
        data = json.load(f)
        # Find the bidder matching the GSTIN
        for bidder in data:
            if bidder['gst'] == gstin:
                return bidder
    return None

async def verify_bidder(gstin):
    # Check if Ollama is running (Optional: try to ping it)
    # If failed, use Mock Data
    is_ollama_available = False # Set to False for now
    if is_ollama_available:
        # Run real AI logic here
        pass
    else:
        # Use Mock Data
        bidder = get_mock_data(gstin)
        if bidder:
            return {"status": "verified", "score": 90, "source": "Mock Database"}
        else:
            return {"status": "not_found", "score": 0, "source": "Mock Database"}