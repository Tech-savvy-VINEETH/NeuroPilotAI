import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getThemeClasses } from '../../utils/themeUtils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className = ''
}: EmptyStateProps) {
    const { state } = useApp();
    const themeClasses = getThemeClasses(state.theme);

    return (
        <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
            <div className={`p-4 rounded-full mb-4 ${state.theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Icon className={`w-8 h-8 ${themeClasses.textSecondary}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text}`}>{title}</h3>
            <p className={`text-sm max-w-xs mb-6 ${themeClasses.textSecondary}`}>{description}</p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className={`
            px-4 py-2 rounded-lg font-medium transition-all duration-200
            ${themeClasses.primary} text-white shadow-md hover:shadow-lg transform hover:scale-105
          `}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
