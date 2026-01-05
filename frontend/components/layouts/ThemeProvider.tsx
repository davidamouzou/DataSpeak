import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // Hydrate the theme from localStorage on the client only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('dataspeak-theme');
      if (stored) setTheme(stored as Theme);
    } catch (e) {
      // ignore parse/storage errors
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      let applied: 'light' | 'dark' = 'light';

      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
        applied = systemTheme;
      } else {
        applied = theme;
      }

      root.classList.remove('light', 'dark');
      root.classList.add(applied);
      setEffectiveTheme(applied);
    };

    updateTheme();

    // Listen to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('dataspeak-theme', theme);
    } catch (e) {
      // ignore write errors (e.g., storage disabled)
    }
  }, [theme]);

  // Keyboard shortcut: Ctrl/Cmd + Shift + L to toggle theme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setTheme((current) => {
          if (current === 'light') return 'dark';
          if (current === 'dark') return 'system';
          return 'light';
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}