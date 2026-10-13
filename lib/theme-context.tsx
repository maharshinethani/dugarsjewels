'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

type ThemeName = 'ocean-midnight' | 'ocean-pearl';

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
  setTheme: (t: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = 'dugars-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('ocean-pearl');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(THEME_KEY) : null;
    if (stored === 'ocean-midnight' || stored === 'ocean-pearl') {
      setThemeState(stored);
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('ocean-midnight');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme === 'ocean-midnight' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  const setTheme = useCallback((t: ThemeName) => setThemeState(t), []);
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'ocean-midnight' ? 'ocean-pearl' : 'ocean-midnight'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
