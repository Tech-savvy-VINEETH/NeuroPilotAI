import React from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface ProductivityScoreProps {
    score: number;
    trend: number;
    className?: string;
}

export function ProductivityScore({ score, trend, className }: ProductivityScoreProps) {
    const isPositive = trend >= 0;
    const circumference = 2 * Math.PI * 60; // radius 60
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <Card className={cn("p-6 relative overflow-hidden", className)}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Productivity Score</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Daily performance metric</p>
                </div>
                <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium",
                    isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(trend)}%</span>
                </div>
            </div>

            <div className="flex items-center justify-center py-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-[var(--bg-tertiary)]"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Center Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl font-bold text-[var(--text-primary)]"
                        >
                            {score}
                        </motion.span>
                        <span className="text-sm text-[var(--text-secondary)] uppercase tracking-wider font-medium mt-1">
                            Excellent
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">Top 5% of users</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            You're more productive than 95% of users this week. Keep it up!
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
