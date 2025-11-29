import React from 'react';
import { Trophy } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function StreakCard() {
    const { state, dispatch } = useApp();

    return (
        <div
            onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'challenges' })}
            className={`h-full p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg cursor-pointer group ${state.theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${state.theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                    <Trophy className="w-6 h-6" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${state.theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                    }`}>
                    Level {Math.floor(state.totalCompleted / 10) + 1}
                </span>
            </div>
            <h3 className={`text-2xl font-bold mb-1 group-hover:text-purple-500 transition-colors ${state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                {state.streak} Day Streak
            </h3>
            <p className={`text-sm ${state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {state.totalCompleted} tasks completed total
            </p>
        </div>
    );
}
