'use client';

import { motion } from 'framer-motion';

const mockStocks = [
    { symbol: 'AAPL', price: 182.45, change: 2.3 },
    { symbol: 'MSFT', price: 378.91, change: -0.8 },
    { symbol: 'GOOGL', price: 141.23, change: 1.5 },
    { symbol: 'AMZN', price: 178.34, change: 3.1 },
    { symbol: 'NVDA', price: 495.22, change: 5.2 },
    { symbol: 'EUR/USD', price: 1.0845, change: 0.15 },
    { symbol: 'GBP/USD', price: 1.2634, change: -0.22 },
    { symbol: 'USD/JPY', price: 149.87, change: 0.45 },
];

export default function StockTicker() {
    // Duplicate array for seamless loop
    const tickerItems = [...mockStocks, ...mockStocks];

    return (
        <div className="bg-gradient-primary py-4 overflow-hidden">
            <motion.div
                className="flex gap-8"
                animate={{
                    x: [0, -100 * mockStocks.length],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 30,
                        ease: 'linear',
                    },
                }}
            >
                {tickerItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 text-white whitespace-nowrap"
                    >
                        <span className="font-bold text-lg">{item.symbol}</span>
                        <span className="text-sm">${item.price.toFixed(item.symbol.includes('/') ? 4 : 2)}</span>
                        <span
                            className={`text-sm font-semibold ${item.change >= 0 ? 'text-green-200' : 'text-red-200'
                                }`}
                        >
                            {item.change >= 0 ? '+' : ''}
                            {item.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
