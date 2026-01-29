"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Wallet,
    PieChart,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Holding {
    symbol: string;
    name: string;
    amount: number;
    avgPrice: number;
    currentPrice: number;
    value: number;
    allocation: number;
    change: number;
    changePercentage: number;
}

export default function PortfolioPage() {
    const { user } = useUser();
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking portfolio holdings
        const mockHoldings: Holding[] = [
            {
                symbol: 'AAPL', name: 'Apple Inc.', amount: 15, avgPrice: 175.20, currentPrice: 189.43,
                value: 2841.45, allocation: 45.2, change: 213.45, changePercentage: 8.1
            },
            {
                symbol: 'NVDA', name: 'NVIDIA Corp.', amount: 5, avgPrice: 420.50, currentPrice: 894.20,
                value: 4471.00, allocation: 35.5, change: 2368.50, changePercentage: 112.6
            },
            {
                symbol: 'EUR/USD', name: 'Euro / US Dollar', amount: 5000, avgPrice: 1.0750, currentPrice: 1.0854,
                value: 5427.00, allocation: 19.3, change: 52.00, changePercentage: 0.96
            },
        ];

        setTimeout(() => {
            setHoldings(mockHoldings);
            setLoading(false);
        }, 1200);
    }, [user]);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
                </div>
                <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
        );
    }

    const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Portfolio Analysis</h1>
                <p className="text-muted-foreground">Detailed breakdown of your holdings and performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel p-6 border-l-4 border-l-primary">
                    <div className="flex items-center gap-4 mb-2 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                        <Wallet className="w-4 h-4" />
                        Total Value
                    </div>
                    <div className="text-3xl font-bold tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <div className="mt-2 flex items-center gap-1 text-sm text-green-500 font-bold">
                        <ArrowUpRight className="w-4 h-4" />
                        +12.4% <span className="text-muted-foreground font-normal ml-1">this month</span>
                    </div>
                </Card>

                <Card className="glass-panel p-6 border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-4 mb-2 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                        <PieChart className="w-4 h-4" />
                        Asset Allocation
                    </div>
                    <div className="text-lg font-bold">Stocks (80.7%) / Forex (19.3%)</div>
                    <div className="mt-4 flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
                        <div className="h-full bg-primary" style={{ width: '80.7%' }} />
                        <div className="h-full bg-purple-500" style={{ width: '19.3%' }} />
                    </div>
                </Card>

                <Card className="glass-panel p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center gap-4 mb-2 text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                        <TrendingUp className="w-4 h-4" />
                        Risk Exposure
                    </div>
                    <div className="text-xl font-bold">Balanced</div>
                    <p className="text-xs text-muted-foreground mt-2">Your portfolio risk aligns with your Conservative profile.</p>
                </Card>
            </div>

            <Card className="glass-panel overflow-hidden">
                <div className="p-6 border-b border-border/50 flex justify-between items-center">
                    <h2 className="font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Active Holdings
                    </h2>
                    <Badge variant="outline" className="rounded-full">{holdings.length} Positions</Badge>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/30 text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                <th className="px-6 py-4">Asset</th>
                                <th className="px-6 py-4">Price / Avg</th>
                                <th className="px-6 py-4">Quantity</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">P&L</th>
                                <th className="px-6 py-4">Weight</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {holdings.map((h) => (
                                <tr key={h.symbol} className="hover:bg-muted/50 transition-all group">
                                    <td className="px-6 py-6 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-black text-base">{h.symbol}</span>
                                            <span className="text-xs text-muted-foreground">{h.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 tabular-nums">
                                        <div className="text-sm font-bold">${h.currentPrice.toFixed(2)}</div>
                                        <div className="text-[10px] text-muted-foreground">Avg: ${h.avgPrice.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-6 font-mono text-sm">{h.amount}</td>
                                    <td className="px-6 py-6 font-bold tabular-nums text-sm">${h.value.toLocaleString()}</td>
                                    <td className="px-6 py-6">
                                        <div className={cn(
                                            "flex items-center gap-1 font-black text-sm",
                                            h.change >= 0 ? "text-green-500" : "text-red-500"
                                        )}>
                                            {h.change >= 0 ? '+' : ''}${h.change.toFixed(2)}
                                            <span className="text-[10px] font-medium opacity-70">({h.changePercentage}%)</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="w-24">
                                            <div className="flex justify-between text-[10px] mb-1 font-bold">
                                                <span>{h.allocation}%</span>
                                            </div>
                                            <Progress value={h.allocation} className="h-1.5" />
                                        </div>
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
