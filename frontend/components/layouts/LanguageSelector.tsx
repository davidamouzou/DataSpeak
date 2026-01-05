import { useState, useRef, useEffect } from 'react';
import { Languages, Check } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { LANGUAGES, Language } from '@/types/i18n';

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const currentLanguage = LANGUAGES[language];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-accent border border-border transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-foreground hidden sm:inline">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
        <span className="text-sm text-foreground sm:hidden">
          {currentLanguage.flag}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-scaleIn">
          <div className="p-2">
            <div className="px-3 py-2 text-xs text-muted-foreground uppercase tracking-wide border-b border-border mb-2">
              Languages
            </div>
            {Object.values(LANGUAGES).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`
                  w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors text-left
                  ${language === lang.code
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent text-foreground'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <div className="text-sm">{lang.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{lang.name}</div>
                  </div>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 text-xs text-muted-foreground border-t border-border bg-accent/30">
            <span>Auto-detected: {LANGUAGES[language].flag}</span>
          </div>
        </div>
      )}
    </div>
  );
}
