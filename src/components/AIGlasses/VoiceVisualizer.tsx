import React, { useEffect, useState } from 'react';
import { getThemeClasses } from '../../utils/themeUtils';

interface VoiceVisualizerProps {
    isActive: boolean;
    theme: 'light' | 'dark' | 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal';
}

export function VoiceVisualizer({ isActive, theme }: VoiceVisualizerProps) {
    const themeClasses = getThemeClasses(theme);
    const [bars, setBars] = useState<number[]>(new Array(12).fill(10));

    useEffect(() => {
        if (!isActive) {
            setBars(new Array(12).fill(10));
            return;
        }

        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.floor(Math.random() * 40) + 10));
        }, 100);

        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="flex items-center justify-center space-x-1 h-16">
            {bars.map((height, index) => (
                <div
                    key={index}
                    className={`w-1.5 rounded-full transition-all duration-100 ${isActive ? themeClasses.primary : 'bg-gray-300 dark:bg-gray-700'}`}
                    style={{ height: `${height}px` }}
                />
            ))}
        </div>
    );
}
