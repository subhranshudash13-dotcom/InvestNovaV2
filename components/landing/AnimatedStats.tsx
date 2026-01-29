'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AnimatedStats() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </section>
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
        const duration = 2000;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Ease out expo for a smoother finish
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easedProgress * end));

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
            className="glass-panel glass-panel-hover p-10 flex flex-col items-center justify-center min-h-[200px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay }}
        >
            <div className="text-5xl md:text-6xl font-black text-gradient mb-3 tracking-tighter">
                {count.toLocaleString()}
                {count >= end * 0.99 && suffix}
            </div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{label}</div>
        </motion.div>
    );
}
