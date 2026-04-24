from fastapi import APIRouter
from app.schemas.ml_schema import TextRequest, PredictionResponse
from app.services.ml_service import predict_priority

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse)
def predict(request: TextRequest):
    pred, conf = predict_priority(request.text)

    return {
        "prediction": pred,
        "confidence": conf
    }