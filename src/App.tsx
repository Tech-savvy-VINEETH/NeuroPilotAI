import React, { useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { Dashboard } from './views/Dashboard';
import { Tasks } from './views/Tasks';
import { Emails } from './views/Emails';
import { Chat } from './views/Chat';
import { Meetings } from './views/Meetings';
import { Challenges } from './views/Challenges';
import { AIGlasses } from './views/AIGlasses';
import { AnalyticsPage } from './views/AnalyticsPage';
import { Settings } from './views/Settings';
import { AppProvider, useApp } from './contexts/AppContext';
import { applyThemeToDocument, getThemeClasses } from './utils/themeUtils';

// Component error boundary for individual components
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Component error:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-gray-500">
          <p>Component temporarily unavailable</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const { state } = useApp();
  const themeClasses = getThemeClasses(state.theme);

  // Apply theme to document when it changes
  useEffect(() => {
    applyThemeToDocument(state.theme);
  }, [state.theme]);

  const renderView = () => {
    try {
      switch (state.activeView) {
        case 'dashboard':
          return <Dashboard />;
        case 'tasks':
          return <Tasks />;
        case 'emails':
          return <Emails />;
        case 'chat':
          return <Chat />;
        case 'meetings':
          return <Meetings />;
        case 'challenges':
          return <Challenges />;
        case 'analytics':
          return <AnalyticsPage />;
        case 'ai-glasses':
          return <AIGlasses />;
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.log('Error rendering view:', error);
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <p>Please wait while the application loads.</p>
        </div>
      );
    }
  };

  return (
    <div className={`h-screen flex transition-colors duration-300 ${themeClasses.background} bg-[var(--bg-primary)]`}>
      <ComponentErrorBoundary>
        <Sidebar />
      </ComponentErrorBoundary>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ComponentErrorBoundary>
          <Header />
        </ComponentErrorBoundary>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            <ComponentErrorBoundary>
              {renderView()}
            </ComponentErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}