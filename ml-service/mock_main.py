import os
import random
import logging
from datetime import datetime
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="InvestNova ML Service (Mock)")

API_KEY = os.getenv("API_KEY", "demo-key")

class PredictRequest(BaseModel):
    symbol: str
    timeframe: str
    historicalData: list[dict]

class PredictResponse(BaseModel):
    symbol: str
    timeframe: str
    predictions: dict
    consensus: dict

def mock_lstm_price(close_prices):
    last = close_prices[-1]["close"]
    # Random walk with slight upward bias
    change = random.gauss(0.002, 0.015)
    return last * (1 + change)

def mock_xgboost_price(close_prices):
    last = close_prices[-1]["close"]
    # Slightly more aggressive
    change = random.gauss(0.004, 0.012)
    return last * (1 + change)

def mock_transformer_price(close_prices):
    last = close_prices[-1]["close"]
    # Momentum-based
    change = random.gauss(0.003, 0.010)
    return last * (1 + change)

def mock_consensus(prices):
    avg = sum(prices) / len(prices)
    last = prices[-1]["close"]
    change_pct = ((avg - last) / last) * 100
    return {
        price: avg,
        confidence: random.uniform(0.62, 0.88),
        changePercent: change_pct,
    }

@app.get("/health")
def health():
    return { "status": "ok", "timestamp": datetime.utcnow().isoformat() }

@app.get("/ml/models/status")
def models_status(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return {
        lstm: { loaded: True, type: "Keras", accuracy: "0.84" },
        xgboost: { loaded: True, type: "XGBoost", accuracy: "0.82" },
        transformer: { loaded: True, type: "Keras", accuracy: "0.86" },
    }

@app.post("/ml/predict")
def predict(req: PredictRequest, x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    if not req.historicalData:
        raise HTTPException(status_code=400, detail="No historical data provided")

    lstm_price = mock_lstm_price(req.historicalData)
    xgb_price = mock_xgboost_price(req.historicalData)
    tf_price = mock_transformer_price(req.historicalData)

    consensus = mock_consensus([lstm_price, xgb_price, tf_price, req.historicalData[-1]["close"]])

    return PredictResponse(
        symbol=req.symbol,
        timeframe=req.timeframe,
        predictions={
            lstm: {
                price: round(lstm_price, 2),
                confidence: round(random.uniform(0.78, 0.92), 3),
                direction: "up" if lstm_price > req.historicalData[-1]["close"] else "down" if lstm_price < req.historicalData[-1]["close"] else "flat",
            },
            xgboost: {
                price: round(xgb_price, 2),
                confidence: round(random.uniform(0.75, 0.90), 3),
            },
            transformer: {
                price: round(tf_price, 2),
                confidence: round(random.uniform(0.80, 0.94), 3),
            },
        },
        consensus=consensus,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
