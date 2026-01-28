"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NEWS = [
    { text: "FED SIGNALS INTEREST RATE CUT", sentiment: "positive" },
    { text: "TECH SECTOR RALLIES ON AI EARNINGS", sentiment: "positive" },
    { text: "OIL PRICES DIP AMID SUPPLY CONCERNS", sentiment: "negative" },
    { text: "BITCOIN BREAKS CRITICAL RESISTANCE", sentiment: "positive" },
    { text: "GLOBAL MARKETS AWAIT JOBS DATA", sentiment: "neutral" },
];

export function NewsTicker() {
    return (
        <div className="w-full bg-background/80 backdrop-blur-sm border-b border-border overflow-hidden py-2 flex items-center">
            <div className="bg-primary/10 px-3 py-1 rounded-r-full text-xs font-bold text-primary mr-4 z-10 whitespace-nowrap">
                LIVE ALERTS
            </div>
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 30, // Adjust speed
                }}
            >
                {[...NEWS, ...NEWS, ...NEWS].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.sentiment === 'positive' ? 'bg-green-500' :
                                item.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                            }`} />
                        <span className="text-sm font-medium">{item.text}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
