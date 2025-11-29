import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { getThemeClasses } from '../../utils/themeUtils';

export function StreakChart() {
    const { state } = useApp();
    const themeClasses = getThemeClasses(state.theme);
    const { userHistory } = state;

    // Find max score for scaling
    const maxScore = Math.max(...userHistory.map(h => h.score), 100);

    // Chart dimensions
    const height = 150;
    const width = 100; // percent
    const barWidth = 8; // percent
    const gap = (100 - (barWidth * 7)) / 6; // gap between bars

    return (
        <div className="w-full h-full flex flex-col justify-end">
            <div className="flex justify-between items-end h-[150px] w-full px-2">
                {userHistory.map((day, index) => {
                    const heightPercent = (day.score / maxScore) * 100;
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const isToday = index === userHistory.length - 1;

                    return (
                        <div key={index} className="flex flex-col items-center gap-2 w-full">
                            <div className="relative w-full flex justify-center h-[120px] items-end group">
                                {/* Tooltip */}
                                <div className={`absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 ${themeClasses.surface} ${themeClasses.border} border px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg`}>
                                    <div className="font-bold">{day.score} pts</div>
                                    <div className={themeClasses.textSecondary}>{day.tasksCompleted} tasks</div>
                                </div>

                                {/* Bar */}
                                <div
                                    className={`w-3 sm:w-4 rounded-t-lg transition-all duration-500 ease-out ${isToday
                                            ? 'bg-gradient-to-t from-orange-500 to-amber-400'
                                            : state.theme === 'dark'
                                                ? 'bg-gray-700 hover:bg-gray-600'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    style={{ height: `${heightPercent}%` }}
                                />
                            </div>
                            <span className={`text-xs ${isToday ? 'font-bold text-orange-500' : themeClasses.textSecondary}`}>
                                {dayName}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
