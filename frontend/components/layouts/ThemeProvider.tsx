"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  // 1. Handle Mounting and theme initialization
  useEffect(() => {
    const stored = localStorage.getItem('dataspeak-theme') as Theme | null;
    
    // Use requestAnimationFrame to avoid synchronous setState inside useEffect
    // which triggers ESLint warning about cascading renders.
    const raf = requestAnimationFrame(() => {
      if (stored) {
        setTheme(stored);
      }
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    const getSystemTheme = () => 
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const updateTheme = () => {
      const applied = theme === 'system' ? getSystemTheme() : theme;
      
      root.classList.remove('light', 'dark');
      root.classList.add(applied);
      setEffectiveTheme(applied);
      
      try {
        localStorage.setItem('dataspeak-theme', theme);
      } catch { /* ignore */ }
    };

    updateTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') updateTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // 2. Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setTheme(current => {
          if (current === 'light') return 'dark';
          if (current === 'dark') return 'system';
          return 'light';
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent UI flicker by not rendering children until mounted if they depend on the theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

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