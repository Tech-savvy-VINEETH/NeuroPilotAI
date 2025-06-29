import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './views/Dashboard';
import { Tasks } from './views/Tasks';
import { Emails } from './views/Emails';
import { Chat } from './views/Chat';
import { Settings } from './views/Settings';
import { LoginScreen } from './components/Auth/LoginScreen';
import { useAuth } from './hooks/useAuth';
import { applyThemeToDocument } from './utils/themeUtils';

function AppContent() {
  const { state } = useApp();
  const { 
    user, 
    loading, 
    loginWithGoogle, 
    loginWithGoogleRedirect, 
    loginWithEmail,
    signUpWithEmailPassword,
    sendEmailSignInLink,
    sendPasswordReset,
    logout, 
    isAuthenticated, 
    authError, 
    clearError,
    isDomainAuthorized
  } = useAuth();

  useEffect(() => {
    // Apply theme to document
    applyThemeToDocument(state.theme);

    // Update title based on active view
    const titles = {
      dashboard: 'Dashboard - NeuroPilot',
      tasks: 'Tasks - NeuroPilot',
      emails: 'Emails - NeuroPilot',
      chat: 'AI Chat - NeuroPilot',
      settings: 'Settings - NeuroPilot'
    };
    document.title = titles[state.activeView] || 'NeuroPilot - AI Productivity Copilot';
  }, [state.theme, state.activeView]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading NeuroPilot...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={loginWithGoogle} 
        onLoginWithRedirect={loginWithGoogleRedirect}
        onEmailLogin={loginWithEmail}
        onEmailSignUp={signUpWithEmailPassword}
        onPasswordReset={sendPasswordReset}
        onSendEmailLink={sendEmailSignInLink}
        loading={loading} 
        authError={authError}
        onClearError={clearError}
        isDomainAuthorized={isDomainAuthorized}
      />
    );
  }

  const renderActiveView = () => {
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
  };

  const getThemeClasses = () => {
    if (state.theme === 'dark') {
      return 'bg-gray-900';
    }
    
    const themeBackgrounds = {
      light: 'bg-gray-50',
      blue: 'bg-blue-50',
      purple: 'bg-purple-50',
      green: 'bg-green-50',
      orange: 'bg-orange-50',
      red: 'bg-red-50',
      pink: 'bg-pink-50',
      indigo: 'bg-indigo-50',
      teal: 'bg-teal-50'
    };
    
    return themeBackgrounds[state.theme] || 'bg-gray-50';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${getThemeClasses()}`}>
      <div className="flex h-screen">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto h-full">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;