'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, BarChart3, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('@/components/landing/Globe').then(mod => mod.Globe), {
    ssr: false,
    loading: () => <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900 via-black to-purple-900 opacity-20" />
});

export default function Hero() {
    return (
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* 3D Globe Background */}
            <Globe />

            {/* Background Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background -z-10" />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold tracking-wide uppercase">
                        Institutional Grade Social Signals
                    </div>
                    <div className="inline-block px-4 py-1.5 mb-6 ml-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 text-sm font-semibold tracking-wide uppercase">
                        AI Predictions Available
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 tracking-tight">
                        <span className="text-gradient">UPDATED: AI Predictions Live</span>
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
                        Your dashboard now shows LSTM, XGBoost, and Transformer predictions.
                    </p>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto px-4">
                        Join thousands of traders using AI and Social Signals to beat the market.
                    </p>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
                >
                    <Link href="/dashboard">
                        <button className="button-primary text-lg px-12 py-5 w-full sm:w-auto">
                            View Dashboard
                        </button>
                    </Link>
                    <button
                        onClick={() => {
                            const featuresSection = document.getElementById('features');
                            if (featuresSection) {
                                featuresSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                        className="px-12 py-5 rounded-full border border-border bg-background/50 backdrop-blur-md font-semibold hover:bg-muted transition-all w-full sm:w-auto hover:border-primary/30"
                    >
                        Explore Features
                    </button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-sm text-muted-foreground mt-6"
                >
                    No sign‑in required — AI recommendations are available instantly.
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                    className="flex flex-wrap justify-center gap-4 mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <div className="glass-panel px-6 py-3 flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        <span>Real-Time Data</span>
                    </div>
                    <div className="glass-panel px-6 py-3 flex items-center gap-2 text-sm font-medium">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        <span>AI-Powered Analysis</span>
                    </div>
                    <div className="glass-panel px-6 py-3 flex items-center gap-2 text-sm font-medium">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Risk Assessment</span>
                    </div>
                </motion.div>
            </div>

            </div>
    );
}
