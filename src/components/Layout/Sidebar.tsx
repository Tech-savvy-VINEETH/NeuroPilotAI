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
import { getThemeClasses } from '../../utils/themeUtils';

export function Sidebar() {
  const { state, dispatch } = useApp();
  const themeClasses = getThemeClasses(state.theme);

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

  return (
    <div className={`w-64 h-screen ${themeClasses.surface} ${themeClasses.border} border-r flex flex-col transition-all duration-300`}>
      {/* Logo */}
      <div className={`p-6 border-b ${themeClasses.border}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${themeClasses.gradient} rounded-xl flex items-center justify-center`}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${themeClasses.text}`}>
              NeuroPilot
            </h1>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              AI Productivity Assistant
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className={`p-4 border-b ${themeClasses.border}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.surfaceSecondary}`}>
            <User className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${themeClasses.text}`}>
              User
            </p>
            <p className={`text-xs truncate ${themeClasses.textSecondary}`}>
              user@example.com
            </p>
          </div>
        </div>
      </div>

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
                  ? `${themeClasses.primary} text-white`
                  : `${themeClasses.textSecondary} ${themeClasses.hover}`
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
      <div className={`p-4 border-t ${themeClasses.border}`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm font-medium ${themeClasses.text}`}>
            Mode
          </span>
          <button
            onClick={toggleMode}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 ${
              state.mode === 'focus'
                ? state.theme === 'dark'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-2 border-orange-500'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-2 border-orange-400'
                : state.theme === 'dark'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-2 border-green-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-400'
            }`}
          >
            {state.mode === 'focus' ? (
              <>
                <Focus className="w-4 h-4" />
                <span className="text-sm">Focus</span>
              </>
            ) : (
              <>
                <Coffee className="w-4 h-4" />
                <span className="text-sm">Relax</span>
              </>
            )}
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 mb-3 ${themeClasses.surfaceSecondary} ${themeClasses.text} ${themeClasses.hover}`}
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
          onClick={() => {
            localStorage.removeItem('googleAccessToken');
            window.location.reload(); // Simple way to reset app to login
          }}
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