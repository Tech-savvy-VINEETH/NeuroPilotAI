import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getThemeClasses } from '../../utils/themeUtils';

interface SkeletonCardProps {
    className?: string;
    height?: string;
}

export function SkeletonCard({ className = '', height = 'h-32' }: SkeletonCardProps) {
    const { state } = useApp();
    const themeClasses = getThemeClasses(state.theme);

    return (
        <div
            className={`
        ${themeClasses.surface} 
        ${themeClasses.border} 
        border rounded-xl p-6 
        animate-pulse 
        ${className}
      `}
        >
            <div className="flex items-center space-x-4 mb-4">
                <div className={`w-10 h-10 rounded-lg ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                <div className="flex-1 space-y-2">
                    <div className={`h-4 w-1/3 rounded ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                    <div className={`h-3 w-1/4 rounded ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                </div>
            </div>
            <div className={`w-full rounded ${height} ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>
    );
}
