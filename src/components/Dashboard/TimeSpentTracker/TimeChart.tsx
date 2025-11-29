import React from 'react';
import { ChartData } from '../../../types/timeTracking.types';
import { Card } from '../../ui/card';
import { motion } from 'framer-motion';

interface Props {
    chartData: ChartData;
}

export const TimeChart: React.FC<Props> = ({ chartData }) => {
    const neuropilotWidth = chartData.neuropilotPercentage;
    const otherAppsWidth = chartData.otherAppsPercentage;

    return (
        <Card className="p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">Time Distribution</h3>

            <div className="relative h-8 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-6">
                {/* NeuroPilot Segment */}
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${neuropilotWidth}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Other Apps Segment - positioned after NeuroPilot */}
                <motion.div
                    className="absolute top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ left: `${neuropilotWidth}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${otherAppsWidth}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] flex-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">NeuroPilot</div>
                        <div className="text-xs text-[var(--text-secondary)]">{neuropilotWidth}%</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] flex-1">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">Other Apps</div>
                        <div className="text-xs text-[var(--text-secondary)]">{otherAppsWidth}%</div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
