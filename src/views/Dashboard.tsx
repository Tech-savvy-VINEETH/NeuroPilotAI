import { useEffect, useState, useRef, Component } from 'react';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { TaskList } from '../components/Dashboard/TaskList';
import { EmailSummary } from '../components/Dashboard/EmailSummary';
import { WellnessNudges } from '../components/Dashboard/WellnessNudges';
import { CalendarWidget } from '../components/Dashboard/CalendarWidget';
import { TaskInput } from '../components/AI/TaskInput';
import { useApp } from '../contexts/AppContext';
// import { useCalendar } from '../hooks/useCalendar';

// Simple error boundary for individual components
class SafeComponent extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.log('Component error caught:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return null; // Silently fail - don't show error message
    }
    return this.props.children;
  }
}

function AppUsageTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    function onFocus() { setIsActive(true); }
    function onBlur() { setIsActive(false); }
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow mb-6 flex items-center gap-3">
      <span className="font-bold">Time spent in this app:</span>
      <span className="font-mono text-lg">{mins}m {secs}s</span>
      <span className={`ml-2 text-xs ${isActive ? 'text-green-500' : 'text-gray-400'}`}>{isActive ? 'Active' : 'Paused'}</span>
    </div>
  );
}

export function Dashboard() {
  const { state } = useApp();

  // Safety check to ensure state is initialized
  if (!state || !state.theme) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = 'there';
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 18) return `Good afternoon, ${name}! 🌤️`;
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

      <SafeComponent>
        <StatsCards />
      </SafeComponent>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <SafeComponent>
            <TaskInput />
          </SafeComponent>
          <SafeComponent>
            <TaskList />
          </SafeComponent>
          <AppUsageTimer />
        </div>
        
        <div className="space-y-8">
          <SafeComponent>
            <CalendarWidget />
          </SafeComponent>
          <SafeComponent>
            <WellnessNudges />
          </SafeComponent>
          <SafeComponent>
            <EmailSummary />
          </SafeComponent>
        </div>
      </div>
    </div>
  );
}