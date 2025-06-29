import React from 'react';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { TaskList } from '../components/Dashboard/TaskList';
import { EmailSummary } from '../components/Dashboard/EmailSummary';
import { WellnessNudges } from '../components/Dashboard/WellnessNudges';
import { CalendarWidget } from '../components/Dashboard/CalendarWidget';
import { TaskInput } from '../components/AI/TaskInput';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../hooks/useAuth';
import { useCalendar } from '../hooks/useCalendar';

export function Dashboard() {
  const { state } = useApp();
  const { user, accessToken } = useAuth();
  const { todaysEvents, focusAnalysis, loading: calendarLoading } = useCalendar(accessToken);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.displayName?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`;
    return `Good evening, ${name}! 🌙`;
  };

  return (
    <div className="space-y-8 h-full">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {getGreeting()}
        </h1>
        <p className={`${
          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Here's your productivity overview for today
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <TaskInput />
          <TaskList />
        </div>
        
        <div className="space-y-8">
          <CalendarWidget 
            events={todaysEvents} 
            focusAnalysis={focusAnalysis}
            loading={calendarLoading}
          />
          <WellnessNudges />
          <EmailSummary />
        </div>
      </div>
    </div>
  );
}