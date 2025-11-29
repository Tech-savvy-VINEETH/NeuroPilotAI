import React from 'react';
import { getThemeClasses } from '../../utils/themeUtils';

interface SpendingChartProps {
    data: { label: string; amount: number; color: string }[];
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
}

export function SpendingChart({ data, theme }: SpendingChartProps) {
    const themeClasses = getThemeClasses(theme);
    const total = data.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className={`p-6 rounded-xl ${themeClasses.surface} border ${themeClasses.border}`}>
            <h3 className={`text-lg font-bold ${themeClasses.text} mb-6`}>Spending Analysis</h3>

            <div className="flex items-end space-x-4 h-48 mb-6">
                {data.map((item, index) => {
                    const height = (item.amount / total) * 100;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center justify-end group">
                            <div
                                className={`w-full rounded-t-lg transition-all duration-500 ${item.color} opacity-80 group-hover:opacity-100`}
                                style={{ height: `${height}%` }}
                            />
                            <p className={`text-xs mt-2 ${themeClasses.textSecondary}`}>{item.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{item.label}</span>
                        </div>
                        <span className={`font-bold ${themeClasses.text}`}>${item.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
