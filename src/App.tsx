import React from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './views/Dashboard';
import { Tasks } from './views/Tasks';
import { Emails } from './views/Emails';
import { Chat } from './views/Chat';
import { Settings } from './views/Settings';
import { AppProvider, useApp } from './contexts/AppContext';

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
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.log('Error rendering view:', error);
      // Return a simple fallback instead of crashing
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Loading...</h2>
          <p>Please wait while the application loads.</p>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      state.theme === 'dark' ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50'
    }`}>
      <ComponentErrorBoundary>
        <Sidebar />
      </ComponentErrorBoundary>
      <main className={`flex-1 p-8 overflow-auto transition-colors duration-300 ${
        state.theme === 'dark' ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50'
      }`}>
        <ComponentErrorBoundary>
          {renderView()}
        </ComponentErrorBoundary>
      </main>
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