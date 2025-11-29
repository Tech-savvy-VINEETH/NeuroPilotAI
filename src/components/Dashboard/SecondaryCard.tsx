import React from 'react';
import { Card } from '../ui/card';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';

interface SecondaryCardProps {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    onClick?: () => void;
    className?: string;
    color?: 'teal' | 'purple' | 'cyan' | 'orange' | 'green';
}

export function SecondaryCard({
    icon: Icon,
    title,
    value,
    subtitle,
    onClick,
    className,
    color = 'teal'
}: SecondaryCardProps) {

    const getColorClasses = () => {
        switch (color) {
            case 'purple': return 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20';
            case 'cyan': return 'bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20';
            case 'orange': return 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20';
            case 'green': return 'bg-green-500/10 text-green-500 group-hover:bg-green-500/20';
            default: return 'bg-teal-500/10 text-teal-500 group-hover:bg-teal-500/20';
        }
    };

    return (
        <Card
            className={cn(
                "p-4 cursor-pointer group hover:scale-[1.02] transition-all duration-300",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg transition-colors", getColorClasses())}>
                    <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
            </div>

            <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-xl font-bold text-[var(--text-primary)]">{value}</h4>
                    {subtitle && (
                        <span className="text-xs text-[var(--text-secondary)]">{subtitle}</span>
                    )}
                </div>
            </div>
        </Card>
    );
}
