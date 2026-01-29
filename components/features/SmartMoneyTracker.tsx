'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const mockWhaleMoves = [
    { id: 1, asset: 'BTC/USD', type: 'buy', amount: '$1.2M', time: '2m ago', confidence: 98 },
    { id: 2, asset: 'TSLA', type: 'sell', amount: '$450K', time: '5m ago', confidence: 92 },
    { id: 3, asset: 'EUR/USD', type: 'buy', amount: '$3.1M', time: '12m ago', confidence: 95 },
    { id: 4, asset: 'AAPL', type: 'buy', amount: '$890K', time: '18m ago', confidence: 88 },
];

export default function SmartMoneyTracker() {
    return (
        <div className="glass-panel p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Whale Tracker
                </h3>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-500 animate-pulse">
                    LIVE
                </span>
            </div>

            <div className="space-y-4">
                {mockWhaleMoves.map((move, index) => (
                    <motion.div
                        key={move.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${move.type === 'buy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {move.type === 'buy' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{move.asset}</p>
                                <p className="text-xs text-muted-foreground">{move.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono font-bold text-sm">{move.amount}</p>
                            <p className="text-[10px] text-muted-foreground">{move.confidence}% Confidence</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm font-semibold text-primary hover:underline transition-all">
                View All Institutional Moves →
            </button>
        </div>
    );
}
