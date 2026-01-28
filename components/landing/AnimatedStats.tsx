'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedStats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard
                        end={10000}
                        suffix="+"
                        label="Assets Analyzed"
                        isInView={isInView}
                        delay={0}
                    />
                    <StatCard
                        end={95}
                        suffix="%"
                        label="Accuracy Rate"
                        isInView={isInView}
                        delay={0.2}
                    />
                    <StatCard
                        end={24}
                        suffix="/7"
                        label="Real-Time Updates"
                        isInView={isInView}
                        delay={0.4}
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({
    end,
    suffix,
    label,
    isInView,
    delay,
}: {
    end: number;
    suffix: string;
    label: string;
    isInView: boolean;
    delay: number;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const duration = 2000; // 2 seconds

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const timeoutId = setTimeout(() => {
            requestAnimationFrame(animate);
        }, delay * 1000);

        return () => clearTimeout(timeoutId);
    }, [isInView, end, delay]);

    return (
        <motion.div
            className="glass-card glass-card-hover p-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
        >
            <div className="text-5xl font-bold gradient-text mb-2">
                {count.toLocaleString()}
                {count === end && suffix}
            </div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">{label}</div>
        </motion.div>
    );
}
