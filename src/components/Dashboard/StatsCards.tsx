import React from 'react';
import { CheckCircle, Clock, TrendingUp, Brain, Timer, Target, Zap, Award } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function StatsCards() {
  const { state } = useApp();

  // Safety checks
  if (!state || !state.tasks) {
    return null;
  }

  const tasks = state.tasks || [];
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && task.status !== 'completed').length;
  const totalEstimatedTime = tasks
    .filter(task => task.status !== 'completed')
    .reduce((acc, task) => acc + (task.estimatedTime || 0), 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-600 dark:text-green-400' };
    if (score >= 60) return { level: 'Good', color: 'text-blue-600 dark:text-blue-400' };
    if (score >= 40) return { level: 'Fair', color: 'text-orange-600 dark:text-orange-400' };
    return { level: 'Needs Focus', color: 'text-red-600 dark:text-red-400' };
  };

  const productivityLevel = getProductivityLevel(state.productivityScore);

  const stats = [
    {
      title: 'Tasks Completed',
      value: completedTasks,
      subtitle: `${pendingTasks} remaining`,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: state.theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50',
      textColor: state.theme === 'dark' ? 'text-green-300' : 'text-green-700',
      borderColor: state.theme === 'dark' ? 'border-green-800' : 'border-green-100',
      trend: completedTasks > 0 ? '+' + completedTasks : '0'
    },
    {
      title: 'High Priority',
      value: highPriorityTasks,
      subtitle: 'urgent tasks',
      icon: Target,
      color: 'bg-red-500',
      bgColor: state.theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
      textColor: state.theme === 'dark' ? 'text-red-300' : 'text-red-700',
      borderColor: state.theme === 'dark' ? 'border-red-800' : 'border-red-100',
      trend: highPriorityTasks > 0 ? highPriorityTasks + ' left' : 'All done!'
    },
    {
      title: 'Focus Time',
      value: state.focusSession?.isActive 
        ? formatFocusTime(state.focusSession.remainingTime || 0)
        : formatTime(totalEstimatedTime),
      subtitle: state.focusSession?.isActive ? 'remaining' : 'estimated',
      icon: state.focusSession?.isActive ? Timer : Brain,
      color: 'bg-blue-500',
      bgColor: state.theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
      textColor: state.theme === 'dark' ? 'text-blue-300' : 'text-blue-700',
      borderColor: state.theme === 'dark' ? 'border-blue-800' : 'border-blue-100',
      isCountdown: state.focusSession?.isActive,
      trend: state.focusSession?.isActive ? 'Active session' : 'Ready to focus'
    },
    {
      title: 'Productivity Score',
      value: `${state.productivityScore}%`,
      subtitle: productivityLevel.level,
      icon: state.productivityScore >= 80 ? Award : TrendingUp,
      color: 'bg-purple-500',
      bgColor: state.theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50',
      textColor: state.theme === 'dark' ? 'text-purple-300' : 'text-purple-700',
      borderColor: state.theme === 'dark' ? 'border-purple-800' : 'border-purple-100',
      trend: state.productivityScore >= 70 ? '🔥 On fire!' : '💪 Keep going!'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className={`${stat.bgColor} ${stat.borderColor} p-6 rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right min-w-0 flex-1 ml-2">
                <p className={`text-xs font-medium truncate ${
                  state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.trend}
                </p>
              </div>
            </div>
            
            <div className="min-w-0">
              <p className={`text-sm font-semibold mb-1 truncate ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.title}
              </p>
              <p className={`text-3xl font-bold mb-1 ${stat.textColor} break-words ${
                stat.isCountdown ? 'animate-pulse' : ''
              }`}>
                {stat.value}
              </p>
              <p className={`text-xs truncate ${
                state.theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {stat.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}