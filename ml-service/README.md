# InvestNova ML Service

FastAPI service that loads trained models and provides inference endpoints for stock price prediction.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env`:
```env
API_KEY=your_ml_service_api_key
MODEL_PATH=./models
```

4. (Optional) Train models locally:
```bash
python train.py
```
This will download historical data for 50 tickers, engineer features, and train:
- LSTM (`models/lstm.keras`)
- Transformer (`models/transformer.keras`)
- XGBoost (`models/xgboost.json`)

5. Run the service:
```bash
python main.py
```
The service will be available at `http://localhost:8000`.

## Endpoints

- `GET /health` – health check
- `GET /ml/models/status` – requires `X-API-Key` header; returns model load status
- `POST /ml/predict` – requires `X-API-Key` header; accepts:
```json
{
  "symbol": "AAPL",
  "timeframe": "7d",
  "historicalData": [{"close": 175.0}, {"close": 176.3}, ...]
}
```
Returns predictions from LSTM, XGBoost, and Transformer plus a consensus.

## Integration

In your Next.js app, set:
```env
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_API_KEY=your_ml_service_api_key
```

The `lib/ml-service/client.ts` will call this endpoint from `/api/recommendations/generate`.
