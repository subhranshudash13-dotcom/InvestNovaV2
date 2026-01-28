import mongoose, { Schema, model, models } from 'mongoose';

// Stock schema for caching stock data
export interface IStock {
    symbol: string;
    name: string;
    price: number;
    volume: number;
    change24h: number;
    technicals: {
        rsi: number;
        volatility: number;
        beta: number;
    };
    sentiment: number;
    createdAt: Date;
    updatedAt: Date;
}

const StockSchema = new Schema<IStock>(
    {
        symbol: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        volume: { type: Number, required: true },
        change24h: { type: Number, required: true },
        technicals: {
            rsi: { type: Number, required: true },
            volatility: { type: Number, required: true },
            beta: { type: Number, required: true },
        },
        sentiment: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

// TTL index: Auto-delete after 5 minutes
StockSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// Forex Pair schema for caching forex data
export interface IForexPair {
    pair: string;
    rate: number;
    bidAsk: {
        bid: number;
        ask: number;
        spread: number;
    };
    volatility: number;
    atr: number;
    trend: string;
    pipMovement24h: number;
    createdAt: Date;
    updatedAt: Date;
}

const ForexPairSchema = new Schema<IForexPair>(
    {
        pair: { type: String, required: true, unique: true, index: true },
        rate: { type: Number, required: true },
        bidAsk: {
            bid: { type: Number, required: true },
            ask: { type: Number, required: true },
            spread: { type: Number, required: true },
        },
        volatility: { type: Number, required: true },
        atr: { type: Number, required: true },
        trend: { type: String, required: true },
        pipMovement24h: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

// TTL index: Auto-delete after 5 minutes
ForexPairSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// User Recommendation schema
export interface IUserRecommendation {
    userId: string;
    stocks: Array<{
        symbol: string;
        riskScore: number;
        projectedReturn: number;
        reason: string;
    }>;
    forexPairs: Array<{
        pair: string;
        riskScore: number;
        projectedPips: number;
        reason: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const UserRecommendationSchema = new Schema<IUserRecommendation>(
    {
        userId: { type: String, required: true, index: true },
        stocks: [
            {
                symbol: String,
                riskScore: Number,
                projectedReturn: Number,
                reason: String,
            },
        ],
        forexPairs: [
            {
                pair: String,
                riskScore: Number,
                projectedPips: Number,
                reason: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// History schema for tracking user actions
export interface IHistory {
    userId: string;
    asset: string;
    assetType: 'stock' | 'forex';
    action: 'buy' | 'sell' | 'hold';
    amount: number;
    entryPrice: number;
    currentPrice?: number;
    result?: number;
    createdAt: Date;
    updatedAt: Date;
}

const HistorySchema = new Schema<IHistory>(
    {
        userId: { type: String, required: true, index: true },
        asset: { type: String, required: true },
        assetType: { type: String, enum: ['stock', 'forex'], required: true },
        action: { type: String, enum: ['buy', 'sell', 'hold'], required: true },
        amount: { type: Number, required: true },
        entryPrice: { type: Number, required: true },
        currentPrice: { type: Number },
        result: { type: Number },
    },
    {
        timestamps: true,
    }
);

// Export models (use existing model if it exists to prevent re-compilation in development)
export const Stock = models.Stock || model<IStock>('Stock', StockSchema);
export const ForexPair = models.ForexPair || model<IForexPair>('ForexPair', ForexPairSchema);
export const UserRecommendation =
    models.UserRecommendation || model<IUserRecommendation>('UserRecommendation', UserRecommendationSchema);
export const History = models.History || model<IHistory>('History', HistorySchema);
