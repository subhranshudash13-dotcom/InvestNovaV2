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
    const tickerItems = [...mockStocks, ...mockStocks, ...mockStocks];

    return (
        <div className="relative border-y border-border py-4 bg-background/50 backdrop-blur-sm overflow-hidden flex items-center">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />

            <motion.div
                className="flex gap-12"
                animate={{
                    x: [0, -100 * mockStocks.length],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 40,
                        ease: 'linear',
                    },
                }}
            >
                {tickerItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-4 whitespace-nowrap group"
                    >
                        <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight group-hover:text-primary transition-colors">{item.symbol}</span>
                            <span className="text-xs text-muted-foreground">${item.price.toFixed(item.symbol.includes('/') ? 4 : 2)}</span>
                        </div>
                        <div className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold",
                            item.change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        )}>
                            {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change).toFixed(2)}%
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

import { cn } from '@/lib/utils';
