type Timeframe = '1d' | '7d' | '30d';

export type MLPredictRequest = {
    symbol: string;
    timeframe: Timeframe;
    historicalData?: unknown[];
};

export type MLPredictResponse = {
    symbol: string;
    timeframe: Timeframe;
    predictions: {
        lstm: {
            price: number;
            confidence: number;
            direction?: 'up' | 'down' | 'flat';
        };
        xgboost: {
            price: number;
            confidence: number;
            featureImportance?: Record<string, number>;
        };
        transformer: {
            price: number;
            confidence: number;
            attentionWeights?: number[];
        };
    };
    consensus: {
        price: number;
        confidence: number;
        changePercent?: number;
        method?: 'weighted_average' | 'voting';
    };
};

function getMlServiceConfig() {
    const baseUrl = process.env.ML_SERVICE_URL;
    const apiKey = process.env.ML_SERVICE_API_KEY;

    if (!baseUrl) {
        throw new Error('ML_SERVICE_URL is not configured');
    }
    if (!apiKey) {
        throw new Error('ML_SERVICE_API_KEY is not configured');
    }

    return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit, timeoutMs: number) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(input, {
            ...init,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(id);
    }
}

export const MLServiceClient = {
    async predict(body: MLPredictRequest, opts?: { timeoutMs?: number }): Promise<MLPredictResponse> {
        const { baseUrl, apiKey } = getMlServiceConfig();
        const url = `${baseUrl}/ml/predict`;

        const response = await fetchWithTimeout(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                },
                body: JSON.stringify(body),
            },
            opts?.timeoutMs ?? 2000
        );

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`ML service error: ${response.status}${text ? ` - ${text}` : ''}`);
        }

        return (await response.json()) as MLPredictResponse;
    },
};
