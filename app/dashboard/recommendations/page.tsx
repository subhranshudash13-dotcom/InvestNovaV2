"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    RefreshCcw,
    AlertTriangle,
    BarChart
} from 'lucide-react';
import { toast } from 'sonner';
import { Recommendation } from '@/lib/types';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { ConsensusChart } from '@/components/dashboard/ConsensusChart';

export default function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchRecommendations = async () => {
        try {
            const response = await fetch('/api/recommendations/generate', {
                method: 'POST',
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setRecommendations(data);
            } else {
                toast.error('Failed to parse recommendations');
            }
        } catch (error) {
            toast.error('Failed to load recommendations');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchRecommendations();
    };

    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">AI Recommendations</h1>
                        <p className="text-muted-foreground">High-confidence signals based on your risk profile.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[400px] w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
                    <p className="text-muted-foreground">Generated insights with real-time ML inference.</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="gap-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white"
                >
                    <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh Signals
                </Button>
            </div>

            {recommendations.length === 0 ? (
                <Card className="bg-white/5 border-white/10 p-12 text-center rounded-2xl backdrop-blur-xl">
                    <div className="flex justify-center mb-4">
                        <BarChart className="w-12 h-12 text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No High-Confidence Signals</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Our engine is scanning the markets. We only show recommendations when the computed confidence exceeds thresholds.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((rec, index) => (
                        <div key={rec.symbol + index} className="space-y-4">
                            <RecommendationCard data={rec} />
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Price Action & AI Consensus</h4>
                                <ConsensusChart data={rec} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-6 border border-orange-500/20 bg-orange-500/5 rounded-2xl backdrop-blur-xl">
                <div className="flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
                    <div className="text-sm text-muted-foreground">
                        <p className="font-bold text-orange-500 mb-1 uppercase tracking-wider text-[10px]">Prediction Disclaimer</p>
                        InvestNova's AI recommendations are based on historical patterns and probabilistic modeling. Trading involves significant risk. Past performance is not indicative of future results. Never invest more than you can afford to lose.
                    </div>
                </div>
            </div>
        </div>
    );
}

