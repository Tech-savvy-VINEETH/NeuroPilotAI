import { useState } from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function Header() {
    const { state, dispatch } = useApp();
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const toggleTheme = () => {
        dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
    };

    return (
        <header className={`
      sticky top-0 z-40 w-full h-16 
      bg-[var(--bg-primary)]/80 backdrop-blur-md 
      border-b border-[var(--border-color)]
      transition-all duration-300
    `}>
            <div className="h-full px-4 flex items-center justify-between gap-4">
                {/* Left: Mobile Menu Trigger (handled by Sidebar) & Brand (if needed) */}
                <div className="flex items-center lg:hidden">
                    {/* Mobile menu button placeholder - actual button is in Sidebar for now, 
              but we might want to move it here later */}
                </div>

                {/* Center: Global Search */}
                <div className="flex-1 max-w-2xl flex items-center justify-center">
                    <div className={`
            relative group transition-all duration-300 ease-out
            ${isSearchFocused ? 'w-full' : 'w-40 md:w-96'}
          `}>
                        <div className={`
              absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
              text-[var(--text-secondary)] group-hover:text-teal-500 transition-colors
            `}>
                            <Search className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            className={`
                w-full pl-10 pr-12 py-2 
                bg-[var(--bg-secondary)] 
                border border-[var(--border-color)] 
                rounded-xl text-sm 
                text-[var(--text-primary)]
                placeholder-[var(--text-secondary)]
                focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500
                transition-all duration-200
              `}
                            placeholder="Search anything..."
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-[var(--border-color)] bg-[var(--bg-primary)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-secondary)]">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Notifications */}
                    <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-teal-500 transition-colors relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-[var(--bg-primary)]"></span>
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-purple-500 transition-colors"
                    >
                        {state.theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>

                    {/* User Profile */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 p-[2px] cursor-pointer hover:scale-105 transition-transform">
                        <div className="h-full w-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center">
                            <User className="h-4 w-4 text-teal-600" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
