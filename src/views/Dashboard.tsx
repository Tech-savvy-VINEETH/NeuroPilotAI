import { useState, Component, Suspense, lazy } from 'react';
import { TaskList } from '../components/Dashboard/TaskList';
import { TaskInput } from '../components/AI/TaskInput';
import { StatCard } from '../components/Dashboard/StatCard';
import { SecondaryCard } from '../components/Dashboard/SecondaryCard';
import { useApp } from '../contexts/AppContext';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

// Lazy load heavy or below-the-fold components
const TimeSpentTracker = lazy(() => import('../components/Dashboard/TimeSpentTracker/TimeSpentTracker').then(module => ({ default: module.TimeSpentTracker })));
const SidebarCalendar = lazy(() => import('../components/Dashboard/SidebarCalendar').then(module => ({ default: module.SidebarCalendar })));
const EmailSummary = lazy(() => import('../components/Dashboard/EmailSummary').then(module => ({ default: module.EmailSummary })));
const WellnessNudges = lazy(() => import('../components/Dashboard/WellnessNudges').then(module => ({ default: module.WellnessNudges })));
const ChatInterface = lazy(() => import('../components/Chat/ChatInterface').then(module => ({ default: module.ChatInterface })));

// Loading fallback
const ComponentLoader = () => (
    <div className="w-full h-32 flex items-center justify-center bg-[var(--bg-secondary)]/50 rounded-xl animate-pulse">
        <div className="w-8 h-8 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin" />
    </div>
);

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

export function Dashboard() {
    const { state } = useApp();
    const [isEditMode, setIsEditMode] = useState(false);

    // Safety check to ensure state is initialized
    if (!state || !state.theme) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-[var(--text-secondary)]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        const name = 'Vineeth'; // TODO: Get from user profile
        if (hour < 12) return `Good morning, ${name}! ☀️`;
        if (hour < 18) return `Good afternoon, ${name}! 🌤️`;
        return `Good evening, ${name}! 🌙`;
    };

    // Calculate stats
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.status === 'completed').length;
    const highPriorityTasks = state.tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
    const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div className="space-y-8 pb-20 md:pb-0 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)] tracking-tight">
                        {getGreeting()}
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Here's your productivity overview for today
                    </p>
                </div>
            </div>

            {/* Hero Section: Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Tasks"
                    value={totalTasks}
                    icon={CheckCircle2}
                    color="teal"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatCard
                    title="High Priority"
                    value={highPriorityTasks}
                    icon={AlertCircle}
                    color="purple"
                    trend={{ value: 5, isPositive: false }}
                />
                <StatCard
                    title="Focus Time"
                    value="4h 12m"
                    icon={Clock}
                    color="cyan"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatCard
                    title="Productivity Score"
                    value={`${productivityScore}%`}
                    icon={Zap}
                    color="blue"
                    trend={{ value: 2, isPositive: true }}
                />
            </div>

            {/* Secondary Row: Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <SafeComponent>
                    <SecondaryCard
                        title="Current Streak"
                        value="12 Days"
                        icon={Zap}
                        color="orange"
                        subtitle="Keep it up!"
                    />
                </SafeComponent>
                <SafeComponent>
                    <SecondaryCard
                        title="Next Meeting"
                        value="10:30 AM"
                        icon={Clock}
                        color="purple"
                        subtitle="Design Review"
                    />
                </SafeComponent>
                <SafeComponent>
                    <SecondaryCard
                        title="AI Glasses"
                        value="Connected"
                        icon={CheckCircle2}
                        color="green"
                        subtitle="Battery: 85%"
                    />
                </SafeComponent>
            </div>

            {/* Time Tracker (Full Width) */}
            <div className="w-full">
                <SafeComponent>
                    <Suspense fallback={<ComponentLoader />}>
                        <TimeSpentTracker />
                    </Suspense>
                </SafeComponent>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column (Tasks & Input) */}
                <div className="lg:col-span-2 space-y-6">
                    <SafeComponent><TaskInput /></SafeComponent>
                    <SafeComponent><TaskList /></SafeComponent>
                </div>

                {/* Sidebar Column (Calendar, Email, Wellness) */}
                <div className="space-y-6">
                    <SafeComponent>
                        <Suspense fallback={<ComponentLoader />}>
                            <ChatInterface />
                        </Suspense>
                    </SafeComponent>
                    <SafeComponent>
                        <Suspense fallback={<ComponentLoader />}>
                            <SidebarCalendar />
                        </Suspense>
                    </SafeComponent>
                    <SafeComponent>
                        <Suspense fallback={<ComponentLoader />}>
                            <EmailSummary />
                        </Suspense>
                    </SafeComponent>
                    <SafeComponent>
                        <Suspense fallback={<ComponentLoader />}>
                            <WellnessNudges />
                        </Suspense>
                    </SafeComponent>
                </div>
            </div>
        </div>
    );
}
