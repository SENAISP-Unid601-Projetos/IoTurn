from .thompsonSampling import ThompsonSampling
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
import joblib
import pandas as pd
import numpy as np
import hdbscan
import os


app = FastAPI()

class Arm(BaseModel):
    id: str
    successes: int
    failures: int

class ArmsRequest(BaseModel):
    arms: list[Arm] 

class PredictionRequest(BaseModel):
    current: float
    rpm: float
    oilTemperature: float
    oilLevel: float

class PredictionResponse(BaseModel):
    predicted_cluster: int
    prediction_strength: float

def find_latest_pipeline(model_filename, artifacts_dir="artifacts"):
    try:
        latest_version = sorted(os.listdir(artifacts_dir))[-1]
        pipeline_path = os.path.join(artifacts_dir, latest_version, model_filename)
        if not os.path.exists(pipeline_path):
            raise FileNotFoundError(f"Arquivo 'pipeline.joblib' não encontrado em {pipeline_path}")
        print(f"✅ Carregando pipeline da versão: {latest_version}")
        return pipeline_path
    except (IndexError, FileNotFoundError) as e:
        print(f"❌ ERRO CRÍTICO: Nenhum artefato de modelo encontrado. A API não pode fazer predições. {e}")
        return None

# Carrega a pipeline em uma variável global quando o módulo é importado.
PIPELINE_PATH = find_latest_pipeline("model.joblib")
PIPELINE = joblib.load(PIPELINE_PATH) if PIPELINE_PATH else None
SCALER_PATH = find_latest_pipeline("scaler.joblib")
SCALER = joblib.load(SCALER_PATH) if SCALER_PATH else None

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/bestArm")
def call_arm(request: ArmsRequest):
    if not request.arms:
        raise HTTPException(status_code=400, detail="A lista de braços ('arms') não pode estar vazia.")
    print(request.arms)
    ts = ThompsonSampling()
    best_arm = ts.choose_arm(request.arms)
    print(best_arm)
    return best_arm

@app.post("/predictCluster", response_model=PredictionResponse)
def predict_regime(request_data: PredictionRequest):
    if PIPELINE is None or SCALER is None:
        raise HTTPException(status_code=503, detail="Modelo não está disponível ou falhou ao carregar.")
    try:
        new_data_df = pd.DataFrame([request_data.dict()])
        
        scaler = SCALER
        model = PIPELINE

        X_scaled = scaler.transform(new_data_df)
        
        labels, strengths = hdbscan.approximate_predict(model, X_scaled)
        return PredictionResponse(
            predicted_cluster=int(labels[0]),
            prediction_strength=float(strengths[0])
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno durante a predição: {str(e)}")
