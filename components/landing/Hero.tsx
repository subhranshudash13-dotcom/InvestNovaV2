'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TrendingUp, BarChart3, Shield } from 'lucide-react';
import AuthModal from '@/components/auth/AuthModal';

export default function Hero() {
    const [showAuthModal, setShowAuthModal] = useState(false);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-900">
            {/* Animated background particles */}
            <div className="particles-bg">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-primary rounded-full opacity-20"
                        animate={{
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="gradient-text">InvestNova</span>
                    </h1>
                    <p className="text-xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        AI Analyzes Stocks & Forex Markets Instantly
                    </p>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                        Get Personalized Recommendations with Risk Scores Before You Invest
                    </p>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    className="flex flex-wrap justify-center gap-4 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="glass-card px-6 py-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        <span className="font-medium">Real-Time Data</span>
                    </div>
                    <div className="glass-card px-6 py-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-secondary-500" />
                        <span className="font-medium">AI-Powered Analysis</span>
                    </div>
                    <div className="glass-card px-6 py-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-risk-low" />
                        <span className="font-medium">Risk Assessment</span>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                >
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="button-primary text-lg px-10 py-4"
                    >
                        Start Analyzing Free
                    </button>
                </motion.div>

                {/* Trust indicators */}
                <motion.p
                    className="mt-6 text-sm text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    No credit card required • Free forever • Cancel anytime
                </motion.p>
            </div>

            {/* Auth Modal */}
            {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
    );
}
