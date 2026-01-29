'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

const leaders = [
    { id: 1, name: 'CryptoWhale_99', accuracy: 94.2, streak: 12, reputation: 2500, rank: 1 },
    { id: 2, name: 'StarTrader_Alpha', accuracy: 91.8, streak: 8, reputation: 2150, rank: 2 },
    { id: 3, name: 'Bullish_Bison', accuracy: 89.5, streak: 15, reputation: 1980, rank: 3 },
    { id: 4, name: 'MarketMaven', accuracy: 87.2, streak: 5, reputation: 1840, rank: 4 },
    { id: 5, name: 'ForexWizard', accuracy: 85.9, streak: 10, reputation: 1720, rank: 5 },
    { id: 6, name: 'OptionsQueen', accuracy: 84.5, streak: 3, reputation: 1600, rank: 6 },
];

export default function LeaderboardPage() {
    return (
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 flex items-center gap-3">
                        <Trophy className="w-10 h-10 text-yellow-500" />
                        Community <span className="text-gradient">Leaderboard</span>
                    </h1>
                    <p className="text-muted-foreground">The most accurate predictors in the InvestNova community.</p>
                </div>
                <div className="glass-panel px-6 py-3 flex items-center gap-3 bg-primary/5 border-primary/20">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground line-height-none">Your Rank</p>
                        <p className="text-xl font-black text-primary">#1,242</p>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium (Mobile friendly column, Desktop row) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaders.slice(0, 3).map((leader, index) => (
                    <motion.div
                        key={leader.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`glass-panel p-6 relative overflow-hidden flex flex-col items-center text-center ${index === 0 ? 'border-yellow-500/50 bg-yellow-500/5 scale-105 z-10' : ''}`}
                    >
                        {index === 0 && <Star className="absolute top-2 right-2 w-6 h-6 text-yellow-500 fill-yellow-500 animate-pulse" />}
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl font-black ${index === 0 ? 'bg-yellow-500 text-black' : index === 1 ? 'bg-gray-300 text-black' : 'bg-orange-400 text-black'}`}>
                            {leader.rank}
                        </div>
                        <h3 className="text-lg font-bold mb-1">{leader.name}</h3>
                        <p className="text-2xl font-black text-primary mb-2">{leader.accuracy}%</p>
                        <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                            <span>🔥 {leader.streak} Streak</span>
                            <span>🏆 {leader.reputation} Rep</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List Table */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="p-4 font-black">Rank</th>
                                <th className="p-4 font-black">User</th>
                                <th className="p-4 font-black text-right">Accuracy</th>
                                <th className="p-4 font-black text-right hidden md:table-cell">Streak</th>
                                <th className="p-4 font-black text-right">Reputation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((leader, index) => (
                                <tr key={leader.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-bold">#{leader.rank}</td>
                                    <td className="p-4 font-bold flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                            {leader.name[0]}
                                        </div>
                                        {leader.name}
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-primary">{leader.accuracy}%</td>
                                    <td className="p-4 text-right hidden md:table-cell text-orange-500">🔥 {leader.streak}</td>
                                    <td className="p-4 text-right font-black">{leader.reputation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
