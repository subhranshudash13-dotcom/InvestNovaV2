"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Calendar
} from 'lucide-react';

interface TradeHistoryItem {
    id: string;
    symbol: string;
    action: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    pnl?: number;
    pnlPercentage?: number;
    timestamp: string;
}

export default function HistoryPage() {
    const { user } = useUser();
    const [history, setHistory] = useState<TradeHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking trade history for now
        const mockHistory: TradeHistoryItem[] = [
            {
                id: '1', symbol: 'AAPL', action: 'buy', price: 185.20, amount: 10, total: 1852.00,
                timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: '2', symbol: 'TSLA', action: 'sell', price: 175.50, amount: 5, total: 877.50,
                pnl: 45.30, pnlPercentage: 5.4,
                timestamp: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                id: '3', symbol: 'EUR/USD', action: 'buy', price: 1.0854, amount: 1000, total: 1085.40,
                timestamp: new Date(Date.now() - 86400000 * 7).toISOString()
            },
        ];

        setTimeout(() => {
            setHistory(mockHistory);
            setLoading(false);
        }, 1000);
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-[200px]" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trade History</h1>
                    <p className="text-muted-foreground">Your complete log of simulated and live trades.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            placeholder="Search symbol..."
                            className="pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm focus:ring-1 ring-primary transition-all outline-none"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                </div>
            </div>

            <Card className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Symbol</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">P&L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {history.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{new Date(item.timestamp).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                {item.symbol[0]}
                                            </div>
                                            <span className="font-bold">{item.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={item.action === 'buy' ? 'outline' : 'default'} className={
                                            item.action === 'buy' ? 'border-green-500/50 text-green-500' : 'bg-red-500 text-white'
                                        }>
                                            {item.action.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">${item.price.toFixed(item.symbol.includes('/') ? 4 : 2)}</td>
                                    <td className="px-6 py-4 text-sm">{item.amount}</td>
                                    <td className="px-6 py-4 font-mono font-bold text-sm text-foreground/80">${item.total.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {item.pnl ? (
                                            <div className={cn(
                                                "flex items-center gap-1 font-bold text-sm",
                                                item.pnl >= 0 ? "text-green-500" : "text-red-500"
                                            )}>
                                                {item.pnl >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                ${Math.abs(item.pnl).toFixed(2)}
                                                <span className="text-[10px] font-medium opacity-70">({item.pnlPercentage}%)</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">---</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
