from pydantic import BaseModel
from typing import List


class MLResult(BaseModel):
    prediction: str
    confidence: float
    latency: float
    cost: float


class LLMResult(BaseModel):
    prediction: str
    latency: float
    cost: float


class RAGResult(BaseModel):
    answer: str
    sources: List[str]
    scores: List[float] 
    latency: float
    cost: float


class CompareResponse(BaseModel):
    ml: MLResult
    llm: LLMResult
    rag: RAGResult
    non_rag: RAGResult