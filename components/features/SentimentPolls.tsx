'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Users } from 'lucide-react';
import { toast } from 'sonner';

const assets = [
    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', bullish: 78, bearish: 22 },
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', bullish: 65, bearish: 35 },
    { id: 'gold', name: 'Gold', symbol: 'XAU', bullish: 42, bearish: 58 },
];

export default function SentimentPolls() {
    const [voted, setVoted] = useState<Record<string, boolean>>({});

    const handleVote = (assetId: string, type: 'bullish' | 'bearish') => {
        if (voted[assetId]) {
            toast.error('You have already voted for this asset today!');
            return;
        }
        setVoted({ ...voted, [assetId]: true });
        toast.success(`Vote cast for ${assetId.toUpperCase()}! Your signal has been recorded.`);
    };

    return (
        <div className="glass-panel p-6 w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Community Pulse
                </h3>
            </div>

            <div className="space-y-6">
                {assets.map((asset) => (
                    <div key={asset.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="font-bold">{asset.name} ({asset.symbol})</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVote(asset.id, 'bullish')}
                                    className={`p-2 rounded-lg transition-all ${voted[asset.id] ? 'bg-muted cursor-default' : 'hover:bg-green-500/10 text-green-500 border border-green-500/20'}`}
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleVote(asset.id, 'bearish')}
                                    className={`p-2 rounded-lg transition-all ${voted[asset.id] ? 'bg-muted cursor-default' : 'hover:bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${asset.bullish}%` }}
                                className="h-full bg-green-500"
                            />
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${asset.bearish}%` }}
                                className="h-full bg-red-500"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-green-500">{asset.bullish}% Bullish</span>
                            <span className="text-red-500">{asset.bearish}% Bearish</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
