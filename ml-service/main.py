import os
from datetime import datetime, timezone
from typing import Any, Literal

import numpy as np
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel

load_dotenv()

Timeframe = Literal["1d", "7d", "30d"]


class PredictRequest(BaseModel):
    symbol: str
    timeframe: Timeframe
    historicalData: list[dict[str, Any]] | None = None


class ModelPrediction(BaseModel):
    price: float
    confidence: float
    direction: Literal["up", "down", "flat"] | None = None


class PredictResponse(BaseModel):
    symbol: str
    timeframe: Timeframe
    predictions: dict[str, Any]
    consensus: dict[str, Any]


def require_api_key(x_api_key: str | None = Header(default=None, alias="X-API-Key")) -> None:
    expected = os.environ.get("API_KEY")
    if not expected:
        raise HTTPException(status_code=500, detail="API_KEY not configured")
    if not x_api_key or x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")


def _direction(current: float, predicted: float) -> Literal["up", "down", "flat"]:
    if predicted > current * 1.002:
        return "up"
    if predicted < current * 0.998:
        return "down"
    return "flat"


class ModelBundle:
    def __init__(self) -> None:
        self.model_path = os.environ.get("MODEL_PATH", "./models")
        self.lstm = None
        self.transformer = None
        self.xgb = None
        self.meta: dict[str, Any] = {}

    def load(self) -> None:
        lstm_file = os.path.join(self.model_path, os.environ.get("LSTM_MODEL_FILE", "lstm.keras"))
        transformer_file = os.path.join(
            self.model_path, os.environ.get("TRANSFORMER_MODEL_FILE", "transformer.keras")
        )
        xgb_file = os.path.join(self.model_path, os.environ.get("XGBOOST_MODEL_FILE", "xgboost.json"))

        self.meta = {
            "loadedAt": datetime.now(timezone.utc).isoformat(),
            "paths": {
                "lstm": lstm_file,
                "transformer": transformer_file,
                "xgboost": xgb_file,
            },
        }

        try:
            from tensorflow.keras.models import load_model

            if os.path.exists(lstm_file):
                self.lstm = load_model(lstm_file)
            if os.path.exists(transformer_file):
                self.transformer = load_model(transformer_file)
        except Exception as e:
            self.meta["tensorflowError"] = str(e)

        try:
            import xgboost as xgb

            if os.path.exists(xgb_file):
                booster = xgb.Booster()
                booster.load_model(xgb_file)
                self.xgb = booster
        except Exception as e:
            self.meta["xgboostError"] = str(e)

    def status(self) -> dict[str, Any]:
        return {
            "lstm": {
                "loaded": self.lstm is not None,
                "file": self.meta.get("paths", {}).get("lstm"),
            },
            "xgboost": {
                "loaded": self.xgb is not None,
                "file": self.meta.get("paths", {}).get("xgboost"),
            },
            "transformer": {
                "loaded": self.transformer is not None,
                "file": self.meta.get("paths", {}).get("transformer"),
            },
            "meta": self.meta,
        }


models = ModelBundle()
app = FastAPI(title="InvestNova ML Service", version="0.1.0")


@app.on_event("startup")
def _startup() -> None:
    models.load()


@app.get("/health")
def health() -> dict[str, Any]:
    return {"ok": True, "time": datetime.now(timezone.utc).isoformat()}


@app.get("/ml/models/status")
def models_status(_: None = Depends(require_api_key)) -> dict[str, Any]:
    return {"models": models.status()}


def _extract_series(historical: list[dict[str, Any]] | None) -> tuple[np.ndarray, float]:
    if not historical:
        return np.array([], dtype=float), 0.0

    closes: list[float] = []
    for row in historical:
        c = row.get("close")
        if c is None:
            c = row.get("c")
        if c is None:
            continue
        try:
            closes.append(float(c))
        except Exception:
            continue

    if not closes:
        return np.array([], dtype=float), 0.0

    current = closes[-1]
    return np.asarray(closes, dtype=float), float(current)


def _predict_keras(model: Any, closes: np.ndarray) -> float:
    timesteps = 60
    features = 1

    try:
        shape = getattr(model, "input_shape", None)
        if shape and len(shape) >= 3:
            timesteps = int(shape[1] or timesteps)
            features = int(shape[2] or features)
    except Exception:
        pass

    window = closes[-timesteps:] if closes.size >= timesteps else closes
    if window.size < timesteps:
        pad = np.full((timesteps - window.size,), window[0], dtype=float)
        window = np.concatenate([pad, window])

    min_v = float(window.min())
    max_v = float(window.max())
    denom = (max_v - min_v) if (max_v - min_v) != 0 else 1.0
    scaled = (window - min_v) / denom

    x = scaled.reshape(1, timesteps, 1)
    if features > 1:
        x = np.repeat(x, repeats=features, axis=2)

    y = model.predict(x, verbose=0)
    pred_scaled = float(np.asarray(y).reshape(-1)[0])
    pred = pred_scaled * denom + min_v
    return float(pred)


def _predict_xgb(booster: Any, closes: np.ndarray) -> float:
    import xgboost as xgb

    returns = np.diff(closes) / np.maximum(closes[:-1], 1e-9)
    mean_ret = float(returns.mean()) if returns.size else 0.0
    vol = float(returns.std()) if returns.size else 0.0
    last = float(closes[-1])

    num_features = int(getattr(booster, "num_features", lambda: 3)())
    features = np.zeros((1, max(num_features, 3)), dtype=float)
    features[0, 0] = last
    features[0, 1] = mean_ret
    features[0, 2] = vol

    dmat = xgb.DMatrix(features)
    y = booster.predict(dmat)
    return float(np.asarray(y).reshape(-1)[0])


@app.post("/ml/predict", response_model=PredictResponse)
def predict(req: PredictRequest, _: None = Depends(require_api_key)) -> PredictResponse:
    closes, current = _extract_series(req.historicalData)

    if closes.size == 0:
        raise HTTPException(status_code=400, detail="historicalData is required and must include close prices")

    preds: dict[str, Any] = {}

    if models.lstm is None or models.transformer is None or models.xgb is None:
        raise HTTPException(
            status_code=500,
            detail="Models are not loaded. Place trained model files in MODEL_PATH and restart the service.",
        )

    lstm_price = _predict_keras(models.lstm, closes)
    transformer_price = _predict_keras(models.transformer, closes)
    xgb_price = _predict_xgb(models.xgb, closes)

    prices = np.array([lstm_price, xgb_price, transformer_price], dtype=float)

    lstm_conf = 0.82
    xgb_conf = 0.78
    transformer_conf = 0.85

    preds["lstm"] = {
        "price": float(lstm_price),
        "confidence": float(lstm_conf),
        "direction": _direction(current, lstm_price),
    }
    preds["xgboost"] = {
        "price": float(xgb_price),
        "confidence": float(xgb_conf),
        "featureImportance": {},
    }
    preds["transformer"] = {
        "price": float(transformer_price),
        "confidence": float(transformer_conf),
        "attentionWeights": [],
    }

    consensus_price = float(0.35 * lstm_price + 0.30 * xgb_price + 0.35 * transformer_price)

    mean_p = float(prices.mean()) if prices.size else 1.0
    std_p = float(prices.std()) if prices.size else 0.0
    raw_conf = 1.0 - (std_p / mean_p) if mean_p != 0 else 0.0
    consensus_conf = float(max(min(raw_conf, 0.95), 0.30))

    change_percent = ((consensus_price - current) / current) * 100 if current != 0 else 0.0

    return PredictResponse(
        symbol=req.symbol,
        timeframe=req.timeframe,
        predictions=preds,
        consensus={
            "price": consensus_price,
            "confidence": consensus_conf,
            "changePercent": float(change_percent),
            "method": "weighted_average",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))
