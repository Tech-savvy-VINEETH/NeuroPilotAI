import React from 'react';
import { Clock, Zap, AlertCircle, Coffee } from 'lucide-react';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';

interface FocusStatsProps {
    totalFocusTime: number; // in minutes
    sessionsCompleted: number;
    interruptions: number;
    className?: string;
}

export function FocusStats({ totalFocusTime, sessionsCompleted, interruptions, className }: FocusStatsProps) {
    const hours = Math.floor(totalFocusTime / 60);
    const minutes = totalFocusTime % 60;

    const stats = [
        {
            label: 'Total Focus Time',
            value: `${hours}h ${minutes}m`,
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'Sessions Completed',
            value: sessionsCompleted,
            icon: Zap,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        },
        {
            label: 'Interruptions',
            value: interruptions,
            icon: AlertCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            label: 'Breaks Taken',
            value: Math.floor(sessionsCompleted / 2), // Mock logic
            icon: Coffee,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        }
    ];

    return (
        <div className={cn("grid grid-cols-2 gap-4", className)}>
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className={cn(
                        "p-4 flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]",
                        stat.bg,
                        stat.border,
                        "border bg-opacity-50 backdrop-blur-sm"
                    )}>
                        <div className={cn("p-2 w-fit rounded-lg mb-3", stat.bg)}>
                            <Icon className={cn("w-5 h-5", stat.color)} />
                        </div>
                        <div>
                            <div className={cn("text-2xl font-bold mb-1", stat.color)}>
                                {stat.value}
                            </div>
                            <div className="text-xs font-medium opacity-80 text-[var(--text-secondary)]">
                                {stat.label}
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
