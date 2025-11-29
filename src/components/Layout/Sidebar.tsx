import {
  LayoutDashboard,
  CheckSquare,
  Mail,
  MessageCircle,
  Settings,
  Brain,
  Video,
  Trophy,
  Glasses,
  ChevronLeft,
  ChevronRight,
  Menu,
  BarChart2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';

export function Sidebar() {
  const { state, dispatch } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle screen resize to auto-collapse on tablet
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 768 && width < 1024) {
        setIsCollapsed(true);
      } else {
        if (width >= 1024) {
          setIsCollapsed(false);
        }
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock data for badge - in a real app this would come from global state
  const connectedDevicesCount = 1;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'emails', icon: Mail, label: 'Emails' },
    { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
    { id: 'meetings', icon: Video, label: 'Meetings' },
    { id: 'challenges', icon: Trophy, label: 'Challenges' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'ai-glasses', icon: Glasses, label: 'AI Glasses' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const SidebarContent = () => (
    <div className={`
      h-full flex flex-col 
      bg-[var(--bg-secondary)]/90 backdrop-blur-xl
      border-r border-[var(--border-color)] 
      transition-all duration-300
    `}>
      {/* Logo */}
      <div className="p-4 h-16 flex items-center justify-between border-b border-[var(--border-color)]">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-200">
              <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                NeuroPilot
              </h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.activeView === item.id;

          let badgeCount = null;
          if (item.id === 'emails') {
            badgeCount = state.emails.filter(email => !email.isRead).length;
          } else if (item.id === 'ai-glasses') {
            badgeCount = connectedDevicesCount;
          }

          return (
            <button
              key={item.id}
              data-testid={`nav-${item.id}`}
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_VIEW', payload: item.id as any });
                setIsMobileMenuOpen(false);
              }}
              title={isCollapsed ? item.label : ''}
              className={`
                w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} 
                px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 transition-transform duration-200 group-hover:scale-110 flex-shrink-0
                ${isActive ? 'text-teal-500' : 'text-current'}
              `} />

              {!isCollapsed && (
                <span className="truncate text-sm">{item.label}</span>
              )}

              {/* Active Indicator (Left Border) */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-teal-500 rounded-r-full" />
              )}

              {/* Badges */}
              {badgeCount !== null && badgeCount > 0 && (
                <span className={`
                  ${isCollapsed
                    ? 'absolute top-1 right-1 w-2.5 h-2.5 p-0 flex items-center justify-center text-[0px] bg-red-500 rounded-full border border-[var(--bg-secondary)]'
                    : 'ml-auto px-2 py-0.5 text-[10px] font-bold bg-red-500/10 text-red-600 rounded-full'
                  } 
                `}>
                  {!isCollapsed && badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle (Desktop Only) */}
      <div className="hidden md:flex justify-center p-3 border-t border-[var(--border-color)]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button (Fixed on screen when menu closed) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-[var(--bg-secondary)] shadow-lg border border-[var(--border-color)] text-[var(--text-primary)]"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className={`
        hidden md:block h-screen sticky top-0 z-30
        transition-all duration-300 ease-in-out 
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-xs shadow-2xl transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}