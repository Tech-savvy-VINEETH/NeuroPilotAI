import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    color?: 'teal' | 'purple' | 'cyan' | 'blue';
    className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, color = 'teal', className = '' }: StatCardProps) {
    const getGradient = () => {
        switch (color) {
            case 'purple': return 'from-purple-500 to-pink-500';
            case 'cyan': return 'from-cyan-400 to-blue-500';
            case 'blue': return 'from-blue-500 to-indigo-500';
            default: return 'from-teal-400 to-emerald-500';
        }
    };

    const getIconBg = () => {
        switch (color) {
            case 'purple': return 'bg-purple-500/10 text-purple-500';
            case 'cyan': return 'bg-cyan-500/10 text-cyan-500';
            case 'blue': return 'bg-blue-500/10 text-blue-500';
            default: return 'bg-teal-500/10 text-teal-500';
        }
    };

    return (
        <div className={`
      relative overflow-hidden
      bg-[var(--bg-secondary)]/80 backdrop-blur-xl
      border border-[var(--border-color)]
      rounded-2xl p-6
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1
      group
      ${className}
    `}>
            {/* Background Gradient Blob */}
            <div className={`
        absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10
        bg-gradient-to-br ${getGradient()}
        transition-opacity duration-500 group-hover:opacity-20
      `} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${getIconBg()} transition-transform duration-300 group-hover:scale-110`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <div className={`
              flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
              ${trend.isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}
            `}>
                            {trend.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-[var(--text-secondary)] text-sm font-medium mb-1">{title}</h3>
                    <div className={`
            text-3xl font-bold tracking-tight
            bg-gradient-to-r ${getGradient()} bg-clip-text text-transparent
          `}>
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
}
