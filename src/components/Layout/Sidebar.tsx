import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Mail, 
  MessageCircle, 
  Settings,
  Brain,
  Sun,
  Moon,
  Focus,
  Coffee,
  LogOut,
  User
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { User as FirebaseUser } from 'firebase/auth';

interface SidebarProps {
  user: FirebaseUser | null;
}

export function Sidebar({ user }: SidebarProps) {
  const { state, dispatch } = useApp();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'emails', icon: Mail, label: 'Emails' },
    { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleMode = () => {
    dispatch({ type: 'SET_MODE', payload: state.mode === 'focus' ? 'relax' : 'focus' });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`w-64 h-screen ${
      state.theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    } border-r flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${
              state.theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              NeuroPilot
            </h1>
            <p className={`text-sm ${
              state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              AI Productivity Assistant
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className={`p-4 border-b ${
          state.theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                state.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <User className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {user.displayName || 'User'}
              </p>
              <p className={`text-xs truncate ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.activeView === item.id;
          const unreadCount = item.id === 'emails' 
            ? state.emails.filter(email => !email.isRead).length 
            : null;
          
          return (
            <button
              key={item.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: item.id as any })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? state.theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                  : state.theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {unreadCount && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mode Toggle */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${
            state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Mode
          </span>
          <button
            onClick={toggleMode}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              state.mode === 'focus'
                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            }`}
          >
            {state.mode === 'focus' ? (
              <>
                <Focus className="w-4 h-4" />
                <span className="text-sm font-medium">Focus</span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4" />
                <span className="text-sm font-medium">Relax</span>
              </>
            )}
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 mb-3 ${
            state.theme === 'dark'
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {state.theme === 'dark' ? (
            <>
              <Sun className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
            state.theme === 'dark'
              ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}