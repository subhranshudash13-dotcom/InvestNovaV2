type AlphaVantageGlobalQuoteResponse = {
    'Global Quote'?: {
        '01. symbol'?: string;
        '05. price'?: string;
        '06. volume'?: string;
        '08. previous close'?: string;
        '09. change'?: string;
        '10. change percent'?: string;
    };
    Note?: string;
    Information?: string;
    'Error Message'?: string;
};

type AlphaVantageOverviewResponse = {
    Symbol?: string;
    Name?: string;
    Description?: string;
    Exchange?: string;
    Currency?: string;
    Country?: string;
    Sector?: string;
    Industry?: string;
    MarketCapitalization?: string;
    PERatio?: string;
    EPS?: string;
    DividendYield?: string;
    Note?: string;
    Information?: string;
    'Error Message'?: string;
};

type AlphaVantageDailySeriesResponse = {
    'Time Series (Daily)'?: Record<
        string,
        {
            '1. open'?: string;
            '2. high'?: string;
            '3. low'?: string;
            '4. close'?: string;
            '6. volume'?: string;
        }
    >;
    Note?: string;
    Information?: string;
    'Error Message'?: string;
};

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

let alphaCallTimestamps: number[] = [];
let alphaRateLimitPromise: Promise<void> = Promise.resolve();

async function throttleAlphaVantage(): Promise<void> {
    alphaRateLimitPromise = alphaRateLimitPromise.then(async () => {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        alphaCallTimestamps = alphaCallTimestamps.filter((t) => t > oneMinuteAgo);

        if (alphaCallTimestamps.length >= 5) {
            const oldest = alphaCallTimestamps[0];
            const waitMs = Math.max(oldest + 60000 - now, 0);
            await new Promise((resolve) => setTimeout(resolve, waitMs));
        }

        alphaCallTimestamps.push(Date.now());
    });

    return alphaRateLimitPromise;
}

async function fetchAlphaVantage<T>(url: string): Promise<T> {
    await throttleAlphaVantage();

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    return (await response.json()) as T;
}

function getApiKey(): string {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || process.env.ALPHA_VANTAGE_KEY || '';
    if (!apiKey) {
        throw new Error('Alpha Vantage API key is not configured');
    }
    return apiKey;
}

export const AlphaVantageClient = {
    async getQuote(symbol: string) {
        const apiKey = getApiKey();
        const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
        const data = await fetchAlphaVantage<AlphaVantageGlobalQuoteResponse>(url);

        if (data['Error Message']) {
            return null;
        }
        if (data.Note || data.Information) {
            throw new Error(data.Note || data.Information);
        }

        const quote = data['Global Quote'];
        if (!quote) return null;

        const price = Number(quote['05. price'] ?? 0);
        const previousClose = Number(quote['08. previous close'] ?? 0);
        const changePercentRaw = quote['10. change percent'] ?? '0%';
        const changePercent = Number(String(changePercentRaw).replace('%', ''));
        const volume = Number(quote['06. volume'] ?? 0);

        return {
            c: price,
            pc: previousClose,
            dp: changePercent,
            v: volume,
            t: Math.floor(Date.now() / 1000),
        };
    },

    async getStockProfile(symbol: string) {
        const apiKey = getApiKey();
        const url = `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
        const data = await fetchAlphaVantage<AlphaVantageOverviewResponse>(url);

        if (data['Error Message']) {
            return null;
        }
        if (data.Note || data.Information) {
            throw new Error(data.Note || data.Information);
        }

        if (!data.Symbol) return null;

        return {
            name: data.Name ?? symbol,
            ticker: data.Symbol,
            marketCapitalization: data.MarketCapitalization ? Number(data.MarketCapitalization) : undefined,
        };
    },

    async getStockCandles(symbol: string, resolution: string = 'D', daysBack: number = 7) {
        const apiKey = getApiKey();

        if (resolution !== 'D') {
            return null;
        }

        const url = `${ALPHA_VANTAGE_BASE_URL}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${encodeURIComponent(apiKey)}`;
        const data = await fetchAlphaVantage<AlphaVantageDailySeriesResponse>(url);

        if (data['Error Message']) {
            return null;
        }
        if (data.Note || data.Information) {
            throw new Error(data.Note || data.Information);
        }

        const series = data['Time Series (Daily)'];
        if (!series) return null;

        const to = Math.floor(Date.now() / 1000);
        const from = to - daysBack * 24 * 60 * 60;

        const entries = Object.entries(series)
            .map(([date, v]) => {
                const t = Math.floor(new Date(`${date}T00:00:00Z`).getTime() / 1000);
                return {
                    t,
                    o: Number(v['1. open'] ?? 0),
                    h: Number(v['2. high'] ?? 0),
                    l: Number(v['3. low'] ?? 0),
                    c: Number(v['4. close'] ?? 0),
                    v: Number(v['6. volume'] ?? 0),
                };
            })
            .filter((e) => e.t >= from && e.t <= to)
            .sort((a, b) => a.t - b.t);

        if (!entries.length) return null;

        return {
            s: 'ok',
            t: entries.map((e) => e.t),
            o: entries.map((e) => e.o),
            h: entries.map((e) => e.h),
            l: entries.map((e) => e.l),
            c: entries.map((e) => e.c),
            v: entries.map((e) => e.v),
        };
    },
};
