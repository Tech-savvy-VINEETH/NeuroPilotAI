import React from 'react';
import { Settings as SettingsIcon, Bell, Mic, Brain, Shield, User, Palette, Check } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Theme } from '../types';
import { themeConfigs, applyThemeToDocument } from '../utils/themeUtils';

export function Settings() {
  const { state, dispatch } = useApp();

  const handleThemeChange = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
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
                    className={`relative group p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      state.theme === theme
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                        : state.theme === 'dark'
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={themeConfigs[theme].name}
                  >
                    <div className={`w-10 h-10 rounded-lg ${getThemePreviewGradient(theme)} shadow-md mx-auto`} />
                    {state.theme === theme && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className={`block text-xs mt-2 font-medium text-center leading-tight ${
                      state.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
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
      settings: [
        {
          name: 'Current Mode',
          description: 'Focus mode for deep work, Relax mode for lighter tasks',
          action: (
            <button
              onClick={toggleMode}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                state.mode === 'focus'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}
            >
              {state.mode === 'focus' ? 'Focus Mode' : 'Relax Mode'}
            </button>
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          name: 'Wellness Nudges',
          description: 'Receive reminders for breaks, hydration, and wellness',
          action: (
            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-blue-600 transition-colors duration-200">
              <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6 transition-transform duration-200" />
            </button>
          )
        },
        {
          name: 'Task Reminders',
          description: 'Get notified about upcoming deadlines and priorities',
          action: (
            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-blue-600 transition-colors duration-200">
              <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6 transition-transform duration-200" />
            </button>
          )
        }
      ]
    },
    {
      title: 'Voice & AI',
      icon: Mic,
      settings: [
        {
          name: 'Voice Input',
          description: 'Enable voice commands for task creation and chat',
          action: (
            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-blue-600 transition-colors duration-200">
              <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6 transition-transform duration-200" />
            </button>
          )
        },
        {
          name: 'AI Suggestions',
          description: 'Get intelligent task prioritization and time estimates',
          action: (
            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-blue-600 transition-colors duration-200">
              <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-6 transition-transform duration-200" />
            </button>
          )
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      settings: [
        {
          name: 'Data Encryption',
          description: 'All your data is encrypted and stored securely',
          action: (
            <span className={`px-3 py-1 rounded-full text-sm ${
              state.theme === 'dark' 
                ? 'bg-green-900/30 text-green-300' 
                : 'bg-green-100 text-green-700'
            }`}>
              Enabled
            </span>
          )
        },
        {
          name: 'Analytics',
          description: 'Help improve NeuroPilot with anonymous usage data',
          action: (
            <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 transition-colors duration-200">
              <span className="inline-block w-4 h-4 transform bg-white rounded-full translate-x-1 transition-transform duration-200" />
            </button>
          )
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 h-full">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Settings
        </h1>
        <p className={`${
          state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Customize your NeuroPilot experience
        </p>
      </div>

      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => {
          const Icon = section.icon;
          
          return (
            <div
              key={section.title}
              className={`${
                state.theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } rounded-xl border shadow-lg p-6 transition-all duration-300`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${sectionIndex * 0.1}s both`
              }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-xl font-semibold ${
                  state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {section.title}
                </h2>
              </div>

              <div className="space-y-6">
                {section.settings.map((setting, settingIndex) => (
                  <div
                    key={setting.name}
                    className={`${
                      setting.name === 'Color Theme' ? 'block' : 'flex items-start justify-between'
                    } py-3`}
                  >
                    <div className={`${setting.name === 'Color Theme' ? 'mb-4' : 'flex-1 mr-4'}`}>
                      <h3 className={`font-medium mb-1 ${
                        state.theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {setting.name}
                      </h3>
                      <p className={`text-sm ${
                        state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {setting.description}
                      </p>
                    </div>
                    <div className={`${setting.name === 'Color Theme' ? 'w-full' : 'flex-shrink-0'}`}>
                      {setting.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className={`${
        state.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-xl border shadow-lg p-6`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className={`text-xl font-semibold ${
            state.theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Profile & Account
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className={`font-medium ${
                state.theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Productivity Score
              </h3>
              <p className={`text-sm ${
                state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your current productivity level
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              state.theme === 'dark' 
                ? 'bg-purple-900/30 text-purple-300' 
                : 'bg-purple-100 text-purple-700'
            }`}>
              <span className="font-bold">{state.productivityScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={`${
        state.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      } rounded-xl border shadow-lg p-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${
          state.theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          About NeuroPilot
        </h2>
        <div className="space-y-3">
          <p className={`text-sm ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Version 1.0.0
          </p>
          <p className={`text-sm ${
            state.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            NeuroPilot is your AI-powered productivity assistant, designed to help you manage tasks, 
            optimize your schedule, and maintain wellness throughout your workday.
          </p>
          <div className="flex items-center space-x-4 pt-2">
            <button className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
              state.theme === 'dark'
                ? 'text-blue-400 hover:bg-blue-900/20'
                : 'text-blue-600 hover:bg-blue-50'
            }`}>
              Privacy Policy
            </button>
            <button className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
              state.theme === 'dark'
                ? 'text-blue-400 hover:bg-blue-900/20'
                : 'text-blue-600 hover:bg-blue-50'
            }`}>
              Terms of Service
            </button>
            <button className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
              state.theme === 'dark'
                ? 'text-blue-400 hover:bg-blue-900/20'
                : 'text-blue-600 hover:bg-blue-50'
            }`}>
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}