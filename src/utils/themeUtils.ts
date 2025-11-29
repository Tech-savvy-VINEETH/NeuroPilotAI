import { Theme } from '../types';

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  hover: string;
  gradient: string;
  icon: string;
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  light: {
    name: 'Light',
    primary: 'bg-blue-600',
    secondary: 'bg-gray-100',
    accent: 'bg-purple-600',
    background: 'bg-gray-50',
    surface: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    gradient: 'from-blue-500 to-purple-600',
    icon: 'text-blue-600'
  },
  dark: {
    name: 'Dark',
    primary: 'bg-blue-600',
    secondary: 'bg-gray-800',
    accent: 'bg-purple-600',
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    gradient: 'from-blue-500 to-purple-600',
    icon: 'text-blue-400'
  },
  blue: {
    name: 'Ocean Blue',
    primary: 'bg-blue-600',
    secondary: 'bg-blue-50',
    accent: 'bg-cyan-600',
    background: 'bg-blue-50',
    surface: 'bg-white',
    text: 'text-blue-900',
    textSecondary: 'text-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-100',
    gradient: 'from-blue-500 to-cyan-500',
    icon: 'text-blue-600'
  },
  purple: {
    name: 'Royal Purple',
    primary: 'bg-purple-600',
    secondary: 'bg-purple-50',
    accent: 'bg-indigo-600',
    background: 'bg-purple-50',
    surface: 'bg-white',
    text: 'text-purple-900',
    textSecondary: 'text-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100',
    gradient: 'from-purple-500 to-indigo-500',
    icon: 'text-purple-600'
  },
  green: {
    name: 'Forest Green',
    primary: 'bg-green-600',
    secondary: 'bg-green-50',
    accent: 'bg-emerald-600',
    background: 'bg-green-50',
    surface: 'bg-white',
    text: 'text-green-900',
    textSecondary: 'text-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-100',
    gradient: 'from-green-500 to-emerald-500',
    icon: 'text-green-600'
  },
  orange: {
    name: 'Sunset Orange',
    primary: 'bg-orange-600',
    secondary: 'bg-orange-50',
    accent: 'bg-amber-600',
    background: 'bg-orange-50',
    surface: 'bg-white',
    text: 'text-orange-900',
    textSecondary: 'text-orange-700',
    border: 'border-orange-200',
    hover: 'hover:bg-orange-100',
    gradient: 'from-orange-500 to-amber-500',
    icon: 'text-orange-600'
  },
  red: {
    name: 'Cherry Red',
    primary: 'bg-red-600',
    secondary: 'bg-red-50',
    accent: 'bg-rose-600',
    background: 'bg-red-50',
    surface: 'bg-white',
    text: 'text-red-900',
    textSecondary: 'text-red-700',
    border: 'border-red-200',
    hover: 'hover:bg-red-100',
    gradient: 'from-red-500 to-rose-500',
    icon: 'text-red-600'
  },
  pink: {
    name: 'Blossom Pink',
    primary: 'bg-pink-600',
    secondary: 'bg-pink-50',
    accent: 'bg-fuchsia-600',
    background: 'bg-pink-50',
    surface: 'bg-white',
    text: 'text-pink-900',
    textSecondary: 'text-pink-700',
    border: 'border-pink-200',
    hover: 'hover:bg-pink-100',
    gradient: 'from-pink-500 to-fuchsia-500',
    icon: 'text-pink-600'
  },
  indigo: {
    name: 'Deep Indigo',
    primary: 'bg-indigo-600',
    secondary: 'bg-indigo-50',
    accent: 'bg-violet-600',
    background: 'bg-indigo-50',
    surface: 'bg-white',
    text: 'text-indigo-900',
    textSecondary: 'text-indigo-700',
    border: 'border-indigo-200',
    hover: 'hover:bg-indigo-100',
    gradient: 'from-indigo-500 to-violet-500',
    icon: 'text-indigo-600'
  },
  teal: {
    name: 'Tropical Teal',
    primary: 'bg-teal-600',
    secondary: 'bg-teal-50',
    accent: 'bg-cyan-600',
    background: 'bg-teal-50',
    surface: 'bg-white',
    text: 'text-teal-900',
    textSecondary: 'text-teal-700',
    border: 'border-teal-200',
    hover: 'hover:bg-teal-100',
    gradient: 'from-teal-500 to-cyan-500',
    icon: 'text-teal-600'
  }
};

export function getThemeClasses(theme: Theme) {
  const config = themeConfigs[theme];

  if (theme === 'dark') {
    return {
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      surfaceSecondary: 'bg-gray-750',
      text: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      border: 'border-gray-700',
      borderSecondary: 'border-gray-600',
      hover: 'hover:bg-gray-700',
      hoverSecondary: 'hover:bg-gray-750',
      primary: 'bg-blue-600',
      primaryHover: 'hover:bg-blue-700',
      accent: 'bg-purple-600',
      accentHover: 'hover:bg-purple-700',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      success: 'bg-green-600',
      warning: 'bg-orange-600',
      error: 'bg-red-600',
      info: 'bg-blue-600',
      primaryText: 'text-blue-400'
    };
  }

  return {
    background: config.background,
    surface: config.surface,
    surfaceSecondary: config.secondary,
    text: config.text,
    textSecondary: config.textSecondary,
    textMuted: 'text-gray-500',
    border: config.border,
    borderSecondary: config.border,
    hover: config.hover,
    hoverSecondary: config.hover,
    primary: config.primary,
    primaryHover: `hover:${config.primary.replace('bg-', 'bg-').replace('-600', '-700')}`,
    accent: config.accent,
    accentHover: `hover:${config.accent.replace('bg-', 'bg-').replace('-600', '-700')}`,
    gradient: `bg-gradient-to-r ${config.gradient}`,
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    error: 'bg-red-600',
    info: config.primary,
    primaryText: config.icon
  };
}

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;

  // Remove all theme classes
  root.classList.remove('dark');
  Object.keys(themeConfigs).forEach(t => {
    root.classList.remove(`theme-${t}`);
  });

  // Apply new theme
  if (theme === 'dark') {
    root.classList.add('dark');
    document.body.style.backgroundColor = '#111827';
  } else {
    root.classList.add(`theme-${theme}`);
    const config = themeConfigs[theme];
    document.body.style.backgroundColor = config.background.includes('gray-50') ? '#f8f9fc' :
      config.background.includes('blue-50') ? '#eff6ff' :
        config.background.includes('purple-50') ? '#faf5ff' :
          config.background.includes('green-50') ? '#f0fdf4' :
            config.background.includes('orange-50') ? '#fff7ed' :
              config.background.includes('red-50') ? '#fef2f2' :
                config.background.includes('pink-50') ? '#fdf2f8' :
                  config.background.includes('indigo-50') ? '#eef2ff' :
                    config.background.includes('teal-50') ? '#f0fdfa' : '#f8f9fc';
  }
}