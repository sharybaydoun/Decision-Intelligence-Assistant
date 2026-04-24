from fastapi import APIRouter
from app.schemas.ml_schema import TextRequest
from app.schemas.compare_schema import CompareResponse

from app.services.ml_service import predict_priority
from app.services.llm_service import llm_predict_priority
from app.services.rag_service import rag_answer

from app.utils.logger import log_query

router = APIRouter()


@router.post("/compare", response_model=CompareResponse)
def compare(request: TextRequest):
    text = request.text

    # ML
    ml_pred, ml_conf, ml_latency = predict_priority(text)

    # LLM
    llm_pred, llm_latency, llm_cost = llm_predict_priority(text)

    # RAG
    rag_ans, sources, scores, rag_latency, rag_cost = rag_answer(text)

    # NON-RAG
    non_rag_ans, _, _, non_rag_latency, non_rag_cost = rag_answer(text, use_rag=False)

    result = {
        "ml": {
            "prediction": ml_pred,
            "confidence": ml_conf,
            "latency": ml_latency,
            "cost": 0
        },
        "llm": {
            "prediction": llm_pred,
            "latency": llm_latency,
            "cost": llm_cost
        },
        "rag": {
            "answer": rag_ans,
            "sources": sources,
            "scores": scores,
            "latency": rag_latency,
            "cost": rag_cost
        },
        "non_rag": {
            "answer": non_rag_ans,
            "sources": [],
            "scores": [], 
            "latency": non_rag_latency,
            "cost": non_rag_cost
        }
    }

    log_query({
        "input": text,
        "output": result
    })

    return result