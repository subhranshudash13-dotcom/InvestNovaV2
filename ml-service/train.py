import os
import json
import logging
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras import layers, models, callbacks
import xgboost as xgb

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATA_DIR = Path("./data")
MODEL_DIR = Path(os.environ.get("MODEL_PATH", "./models"))
DATA_DIR.mkdir(exist_ok=True)
MODEL_DIR.mkdir(exist_ok=True)

TICKERS = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRK-B", "V", "JNJ",
    "WMT", "JPM", "MA", "PG", "UNH", "DIS", "HD", "BAC", "ADBE", "CRM",
    "NFLX", "CMCSA", "XOM", "PFE", "CSCO", "VZ", "INTC", "T", "ABT", "NKE",
    "KO", "MRK", "PEP", "AVGO", "COST", "TMO", "ACN", "ABBV", "MCD", "DHR",
    "TXN", "NEE", "LIN", "BMY", "PM", "ORCL", "UNP", "HON", "QCOM", "AMD"
]

def load_data(tickers: list[str], start: str = "2015-01-01", end: str | None = None):
    end = end or datetime.now(timezone.utc).strftime("%Y-%m-%d")
    dfs = []
    for ticker in tickers:
        df = yf.download(ticker, start=start, end=end, progress=False)
        df["ticker"] = ticker
        dfs.append(df)
    combined = pd.concat(dfs)
    combined.reset_index(inplace=True)
    combined.to_csv(DATA_DIR / "raw_prices.csv", index=False)
    logger.info(f"Saved raw prices to {DATA_DIR / 'raw_prices.csv'}")
    return combined

def engineer_features(df: pd.DataFrame):
    df = df.sort_values(["ticker", "Date"]).copy()
    for col in ["Open", "High", "Low", "Close", "Volume"]:
        df[f"{col.lower()}_lag_1"] = df.groupby("ticker")[col].shift(1)
        df[f"{col.lower()}_lag_5"] = df.groupby("ticker")[col].shift(5)
    df["return_1d"] = df.groupby("ticker")["Close"].pct_change()
    df["return_5d"] = df.groupby("ticker")["Close"].pct_change(5)
    df["volatility_20d"] = df.groupby("ticker")["Close"].transform(lambda x: x.rolling(20).std())
    df["rsi_14"] = df.groupby("ticker")["Close"].transform(lambda x: 100 - (100 / (1 + x.diff().clip(lower=0).rolling(14).mean() / -x.diff().clip(upper=0).abs().rolling(14).mean())))
    df = df.dropna()
    df.to_csv(DATA_DIR / "features.csv", index=False)
    logger.info(f"Saved features to {DATA_DIR / 'features.csv'}")
    return df

def prepare_sequences(df: pd.DataFrame, lookback: int = 60):
    sequences, targets = [], []
    scaler = MinMaxScaler()
    for ticker in df["ticker"].unique():
        sub = df[df["ticker"] == ticker].sort_values("Date")
        prices = sub["Close"].values.reshape(-1, 1)
        scaled = scaler.fit_transform(prices)
        for i in range(lookback, len(scaled)):
            sequences.append(scaled[i - lookback : i])
            targets.append(scaled[i, 0])
    return np.array(sequences), np.array(targets), scaler

def train_lstm(X, y, scaler):
    model = models.Sequential([
        layers.LSTM(64, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
        layers.Dropout(0.2),
        layers.LSTM(32),
        layers.Dropout(0.2),
        layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=20, batch_size=32, validation_split=0.1, callbacks=[
        callbacks.EarlyStopping(patience=5, restore_best_weights=True)
    ])
    path = MODEL_DIR / "lstm.keras"
    model.save(path)
    logger.info(f"LSTM saved to {path}")

def train_transformer(X, y, scaler):
    model = models.Sequential([
        layers.Input(shape=(X.shape[1], X.shape[2])),
        layers.MultiHeadAttention(num_heads=4, key_dim=32),
        layers.GlobalAveragePooling1D(),
        layers.Dense(32, activation="relu"),
        layers.Dense(1)
    ])
    model.compile(optimizer="adam", loss="mse")
    model.fit(X, y, epochs=20, batch_size=32, validation_split=0.1, callbacks=[
        callbacks.EarlyStopping(patience=5, restore_best_weights=True)
    ])
    path = MODEL_DIR / "transformer.keras"
    model.save(path)
    logger.info(f"Transformer saved to {path}")

def train_xgboost(df: pd.DataFrame):
    df = df.sort_values(["ticker", "Date"]).copy()
    df["target"] = df.groupby("ticker")["Close"].shift(-1)
    df = df.dropna()
    features = ["return_1d", "return_5d", "volatility_20d", "rsi_14"]
    X = df[features]
    y = df["target"]
    model = xgboost.XGBRegressor(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror"
    )
    model.fit(X, y)
    path = MODEL_DIR / "xgboost.json"
    model.save_model(str(path))
    logger.info(f"XGBoost saved to {path}")

def main():
    logger.info("Starting training pipeline")
    raw = load_data(TICKERS)
    features = engineer_features(raw)
    X_seq, y_seq, scaler = prepare_sequences(features)
    train_lstm(X_seq, y_seq, scaler)
    train_transformer(X_seq, y_seq, scaler)
    train_xgboost(features)
    logger.info("Training complete. Models saved to %s", MODEL_DIR)

if __name__ == "__main__":
    main()
