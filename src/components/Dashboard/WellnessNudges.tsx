import React, { useEffect } from 'react';
import { Heart, Coffee, Droplets, Smile, X, Activity } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function WellnessNudges() {
  const { state, dispatch } = useApp();

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case 'break': return Activity;
      case 'breathing': return Heart;
      case 'hydration': return Droplets; 
      case 'posture': return Coffee;
      case 'motivation': return Smile;
      default: return Heart;
    }
  };

  const getNudgeColor = (type: string) => {
    switch (type) {
      case 'break': 
        return state.theme === 'dark' 
          ? 'bg-orange-900/20 text-orange-300 border-orange-800' 
          : 'bg-orange-100 text-orange-700 border-orange-200';
      case 'breathing': 
        return state.theme === 'dark' 
          ? 'bg-pink-900/20 text-pink-300 border-pink-800' 
          : 'bg-pink-100 text-pink-700 border-pink-200';
      case 'hydration': 
        return state.theme === 'dark' 
          ? 'bg-blue-900/20 text-blue-300 border-blue-800' 
          : 'bg-blue-100 text-blue-700 border-blue-200';
      case 'posture': 
        return state.theme === 'dark' 
          ? 'bg-purple-900/20 text-purple-300 border-purple-800' 
          : 'bg-purple-100 text-purple-700 border-purple-200';
      case 'motivation': 
        return state.theme === 'dark' 
          ? 'bg-green-900/20 text-green-300 border-green-800' 
          : 'bg-green-100 text-green-700 border-green-200';
      default: 
        return state.theme === 'dark' 
          ? 'bg-gray-800 text-gray-300 border-gray-700' 
          : 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDismiss = (nudgeId: string) => {
    dispatch({ type: 'DISMISS_NUDGE', payload: nudgeId });
  };

  if (state.wellnessNudges.length === 0) {
    return null;
  }

  return (
    <div className={`${
      state.theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } rounded-2xl border shadow-md p-6 transition-all duration-300`}>
      <h2 className={`text-xl font-semibold mb-6 ${
        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        Wellness Nudges
      </h2>

      <div className="space-y-4">
        {state.wellnessNudges.map((nudge, index) => {
          const Icon = getNudgeIcon(nudge.type);
          
          return (
            <div
              key={nudge.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${getNudgeColor(nudge.type)}`}
              style={{
                animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">{nudge.title}</h3>
                    <p className="text-sm opacity-90 mb-2">{nudge.description}</p>
                    {nudge.action && (
                      <p className="text-sm font-medium opacity-75">
                        💡 {nudge.action}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(nudge.id)}
                  className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {nudge.autoDismiss && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <span className="text-xs opacity-70">
                      Auto-dismissing in 10 seconds
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}