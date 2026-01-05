import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationKeys } from '@/types/i18n';
import { translations } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'dataspeak-language';

// Détecte la langue du navigateur (client-only)
function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined' || !navigator.language) {
    return 'en';
  }
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLanguages: Language[] = ['fr', 'en', 'es', 'de'];

  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  return 'en'; // Défaut en anglais
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Hydrate la langue depuis localStorage ou le navigateur côté client
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['fr', 'en', 'es', 'de'].includes(stored)) {
      setLanguageState(stored as Language);
      return;
    }

    // Sinon détecter la langue du navigateur
    const detected = detectBrowserLanguage();
    setLanguageState(detected);
  }, []);


  // Sauvegarder dans localStorage quand la langue change (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (e) {
      // ignore write errors (e.g., storage disabled)
    }

    // Mettre à jour l'attribut lang du document
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personnalisé pour utiliser les traductions
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

// Hook pour obtenir juste les traductions (sans setLanguage)
export function useT() {
  const { t } = useTranslation();
  return t;
}
