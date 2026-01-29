"use client";

import { motion } from "framer-motion";
import {
    Cpu,
    Activity,
    LayoutDashboard,
    Zap,
    ShieldCheck,
    LineChart,
    Globe as GlobeIcon
} from "lucide-react";

const features = [
    {
        title: "Whale Tracker",
        description: "Monitor large institutional trades ('Smart Money') as they happen with real-time alerts.",
        icon: Activity,
        color: "text-blue-500",
        delay: 0.1
    },
    {
        title: "Social Sentiment",
        description: "Aggregate the 'Peoples Pulse' with real-time community polls on major financial assets.",
        icon: Zap,
        color: "text-yellow-500",
        delay: 0.2
    },
    {
        title: "Leaderboard",
        description: "Compete with the community and climb the ranks based on your prediction accuracy.",
        icon: ShieldCheck,
        color: "text-green-500",
        delay: 0.3
    },
    {
        title: "Global Intelligence",
        description: "Unified coverage across major Stock exchanges and Forex currency pairs with social signals.",
        icon: GlobeIcon,
        color: "text-purple-500",
        delay: 0.4
    },
    {
        title: "Predictive Analytics",
        description: "Combine AI analysis with social sentiment to foresee market shifts before they happen.",
        icon: LineChart,
        color: "text-pink-500",
        delay: 0.5
    },
    {
        title: "Community Dashboard",
        description: "A personalized experience tailored to your risk profile and community standing.",
        icon: LayoutDashboard,
        color: "text-orange-500",
        delay: 0.6
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-4"
                    >
                        Powerful Tools for <span className="text-gradient">Modern Traders</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Everything you need to analyze, trade, and grow your wealth with confidence.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: feature.delay }}
                            className="glass-panel group hover:border-primary/50 transition-all p-8 flex flex-col items-start"
                        >
                            <div className={`p-4 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors mb-6`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
