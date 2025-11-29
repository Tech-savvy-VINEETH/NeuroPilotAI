import React from 'react';
import { Settings as SettingsIcon, Bell, Mic, Brain, Shield, User, Palette, Check, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Theme } from '../types';
import { themeConfigs, applyThemeToDocument } from '../utils/themeUtils';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function Settings() {
  const { state, dispatch } = useApp();

  const handleThemeChange = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // Theme will be applied via useEffect in AppContext, but apply immediately for instant feedback
    applyThemeToDocument(theme);
  };

  const toggleMode = () => {
    dispatch({ type: 'SET_MODE', payload: state.mode === 'focus' ? 'relax' : 'focus' });
  };

  const getThemePreviewGradient = (theme: Theme) => {
    const config = themeConfigs[theme];
    return `bg-gradient-to-r ${config.gradient}`;
  };

  const themes: Theme[] = ['light', 'dark', 'blue', 'purple', 'green', 'orange', 'red', 'pink', 'indigo', 'teal'];

  const settingSections = [
    {
      title: 'Appearance & Themes',
      icon: Palette,
      gradient: 'from-blue-500 to-purple-600',
      settings: [
        {
          name: 'Color Theme',
          description: 'Choose your preferred color scheme for the interface',
          action: (
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={cn(
                      "relative group p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105",
                      state.theme === theme
                        ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                        : "border-[var(--border-color)] hover:border-[var(--text-secondary)]"
                    )}
                    title={themeConfigs[theme].name}
                  >
                    <div className={cn("w-10 h-10 rounded-lg shadow-md mx-auto", getThemePreviewGradient(theme))} />
                    {state.theme === theme && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="block text-xs mt-2 font-medium text-center leading-tight text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                      {themeConfigs[theme].name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Productivity Mode',
      icon: Brain,
      gradient: 'from-orange-500 to-amber-500',
      settings: [
        {
          name: 'Current Mode',
          description: 'Focus mode for deep work, Relax mode for lighter tasks',
          action: (
            <Button
              onClick={toggleMode}
              className={cn(
                "w-full sm:w-auto px-6 py-6 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-3",
                state.mode === 'focus'
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white border-2 border-orange-500 hover:from-orange-500 hover:to-amber-500"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-2 border-green-500 hover:from-green-500 hover:to-emerald-500"
              )}
            >
              {state.mode === 'focus' ? (
                <>
                  <span className="text-2xl">🎯</span>
                  <div className="text-left">
                    <div className="text-sm opacity-90 font-normal">Current Mode</div>
                    <div className="text-lg font-bold">Focus Mode</div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl">☕</span>
                  <div className="text-left">
                    <div className="text-sm opacity-90 font-normal">Current Mode</div>
                    <div className="text-lg font-bold">Relax Mode</div>
                  </div>
                </>
              )}
            </Button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      gradient: 'from-red-500 to-pink-600',
      settings: [
        {
          name: 'Wellness Nudges',
          description: 'Receive reminders for breaks, hydration, and wellness',
          action: (
            <div className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          )
        },
        {
          name: 'Task Reminders',
          description: 'Get notified about upcoming deadlines and priorities',
          action: (
            <div className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Voice & AI',
      icon: Mic,
      gradient: 'from-cyan-500 to-blue-600',
      settings: [
        {
          name: 'Voice Input',
          description: 'Enable voice commands for task creation and chat',
          action: (
            <div className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          )
        },
        {
          name: 'AI Suggestions',
          description: 'Get intelligent task prioritization and time estimates',
          action: (
            <div className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          )
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-600',
      settings: [
        {
          name: 'Data Encryption',
          description: 'All your data is encrypted and stored securely',
          action: (
            <span className="px-3 py-1 rounded-full text-sm bg-green-500/10 text-green-500 border border-green-500/20 font-medium">
              Enabled
            </span>
          )
        },
        {
          name: 'Analytics',
          description: 'Help improve NeuroPilot with anonymous usage data',
          action: (
            <div className="relative inline-flex items-center cursor-pointer group">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto h-full overflow-y-auto space-y-8 animate-fade-in pb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-[var(--text-primary)] tracking-tight">
          Settings
        </h1>
        <p className="text-[var(--text-secondary)]">
          Customize your NeuroPilot experience
        </p>
      </div>

      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon;

          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <Card className="p-6 bg-[var(--bg-secondary)]/50 backdrop-blur-md border-[var(--border-color)] hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br", section.gradient)}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {section.settings.map((setting, settingIndex) => (
                    <div
                      key={setting.name}
                      className={cn(
                        "py-3 border-b border-[var(--border-color)] last:border-0",
                        setting.name === 'Color Theme' ? 'block' : 'flex items-center justify-between'
                      )}
                    >
                      <div className={cn(setting.name === 'Color Theme' ? 'mb-4' : 'flex-1 mr-4')}>
                        <h3 className="font-medium mb-1 text-[var(--text-primary)]">
                          {setting.name}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {setting.description}
                        </p>
                      </div>
                      <div className={cn(setting.name === 'Color Theme' ? 'w-full' : 'flex-shrink-0')}>
                        {setting.action}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 bg-[var(--bg-secondary)]/50 backdrop-blur-md border-[var(--border-color)]">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Profile & Account
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-[var(--text-primary)]">
                  Productivity Score
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Your current productivity level
                </p>
              </div>
              <div className="px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <span className="font-bold">{state.productivityScore}%</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-[var(--bg-secondary)]/50 backdrop-blur-md border-[var(--border-color)]">
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            About NeuroPilot
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              Version 1.0.0
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              NeuroPilot is your AI-powered productivity assistant, designed to help you manage tasks,
              optimize your schedule, and maintain wellness throughout your workday.
            </p>
            <div className="flex items-center space-x-4 pt-4">
              <Button variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                Terms of Service
              </Button>
              <Button variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10">
                Support
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}