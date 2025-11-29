import React from 'react';
import { Clock, Zap, Target, Brain, ArrowUp, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ProductivityScore } from '../components/Analytics/ProductivityScore';
import { FocusStats } from '../components/Analytics/FocusStats';
import { TimeChart } from '../components/Dashboard/TimeSpentTracker/TimeChart';
import { StatCard } from '../components/Dashboard/StatCard';
import { motion } from 'framer-motion';

export const AnalyticsPage: React.FC = () => {
    const { state } = useApp();

    // Mock data - in a real app this would come from the context or API
    const analyticsData = {
        productivityScore: state.productivityScore || 85,
        productivityTrend: 12,
        focusTime: 345, // minutes
        sessions: 12,
        interruptions: 3,
        chartData: {
            neuropilotPercentage: 65,
            otherAppsPercentage: 35
        }
    };

    return (
        <div className="max-w-7xl mx-auto h-full overflow-y-auto space-y-8 animate-fade-in pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)] tracking-tight">
                        Analytics Dashboard
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Track your productivity trends and focus metrics
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Last 7 Days
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Score & Focus Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <ProductivityScore
                            score={analyticsData.productivityScore}
                            trend={analyticsData.productivityTrend}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <FocusStats
                            totalFocusTime={analyticsData.focusTime}
                            sessionsCompleted={analyticsData.sessions}
                            interruptions={analyticsData.interruptions}
                        />
                    </motion.div>
                </div>

                {/* Right Column: Charts & Trends */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <StatCard
                                title="Task Completion"
                                value="92%"
                                icon={Target}
                                color="purple"
                                trend={{ value: 5, isPositive: true }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <StatCard
                                title="Deep Work"
                                value="4.5h"
                                icon={Brain}
                                color="cyan"
                                trend={{ value: 12, isPositive: true }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <StatCard
                                title="Efficiency"
                                value="8.5/10"
                                icon={Zap}
                                color="blue"
                                trend={{ value: 2, isPositive: false }}
                            />
                        </motion.div>
                    </div>

                    {/* Time Distribution Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="h-64"
                    >
                        <TimeChart chartData={analyticsData.chartData} />
                    </motion.div>

                    {/* Weekly Activity Graph Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Weekly Activity</h3>
                            <div className="h-48 flex items-end justify-between gap-2">
                                {[65, 45, 75, 55, 85, 35, 60].map((height, i) => (
                                    <div key={i} className="w-full flex flex-col items-center gap-2 group">
                                        <div className="relative w-full bg-[var(--bg-tertiary)] rounded-t-lg overflow-hidden h-full">
                                            <motion.div
                                                className="absolute bottom-0 w-full bg-blue-500/80 group-hover:bg-blue-500 transition-colors rounded-t-lg"
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                            />
                                        </div>
                                        <span className="text-xs text-[var(--text-secondary)]">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
