import { Search, Plus, Menu, Database, CheckCircle2, Settings, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';
import { useTranslation } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { loginTranslations } from '@/i18n/translations-login';
import {Logo} from "@/components/layouts/Logo";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const { language } = useTranslation();
  const { user, logout } = useUser();
  const t = loginTranslations[language];

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    if (confirm(t.user.logoutConfirm)) {
      logout();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-card border-b border-border z-50 backdrop-blur-sm bg-card/95">
        <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Logo/>
              <span className="hidden sm:block text-foreground">DataSpeak</span>
            </div>

            {/* Connection Status - Hidden on mobile and small tablets */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300 whitespace-nowrap text-sm">PostgreSQL connecté</span>
            </div>
          </div>

          {/* Center Section - Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`${t.settings.title}...`}
                className="w-full pl-10 pr-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* New Conversation Button */}
            <button className="hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow whitespace-nowrap">
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">{language === 'fr' ? 'Nouvelle conversation' : language === 'es' ? 'Nueva conversación' : language === 'de' ? 'Neues Gespräch' : 'New conversation'}</span>
              <span className="lg:hidden">{language === 'fr' ? 'Nouveau' : language === 'es' ? 'Nuevo' : language === 'de' ? 'Neu' : 'New'}</span>
            </button>

            {/* Mobile: Plus icon only */}
            <button className="md:hidden p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm">
              <Plus className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pr-2 hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-chart-3 rounded-full text-primary-foreground shadow-sm flex-shrink-0">
                  <span className="text-sm">{user?.firstName?.[0] || 'U'}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-scaleIn">
                  {/* User Info */}
                  <div className="p-4 border-b border-border bg-accent/30">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-chart-3 rounded-full text-primary-foreground text-lg">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent text-foreground transition-colors text-left"
                    >
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{t.user.profile}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent text-foreground transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{t.settings.title}</span>
                    </button>

                    <div className="my-2 border-t border-border"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">{t.user.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}