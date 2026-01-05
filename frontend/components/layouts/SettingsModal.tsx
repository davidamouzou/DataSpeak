import { useState } from 'react';
import {
  X, User, Globe, Palette, Sliders, Bell, Shield, Info,
  Camera, Upload, Save, Loader
} from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { loginTranslations } from '@/i18n/translations-login';
import { LANGUAGES, Language } from '@/types/i18n';
import { useTheme } from './ThemeProvider';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'language' | 'appearance' | 'preferences' | 'notifications' | 'privacy';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage } = useTranslation();
  const { user, preferences, updateUser, updatePreferences } = useUser();
  const { theme, setTheme } = useTheme();
  const t = loginTranslations[language].settings;

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    jobTitle: user?.jobTitle || '',
    company: user?.company || '',
    bio: user?.bio || '',
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile' as SettingsTab, label: t.profile, icon: User },
    { id: 'language' as SettingsTab, label: t.language, icon: Globe },
    { id: 'appearance' as SettingsTab, label: t.appearance, icon: Palette },
    { id: 'preferences' as SettingsTab, label: t.preferences, icon: Sliders },
    { id: 'notifications' as SettingsTab, label: t.notifications, icon: Bell },
    { id: 'privacy' as SettingsTab, label: t.privacy, icon: Shield },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateUser(profileForm);

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    updatePreferences({ [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden animate-scaleIn flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sliders className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl text-foreground">{t.title}</h2>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-border p-4 overflow-y-auto flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left
                      ${activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg text-foreground mb-1">{t.profileSection.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.profileSection.subtitle}</p>
                </div>

                {/* Avatar */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-chart-3 rounded-full flex items-center justify-center text-2xl text-white">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                      <Upload className="w-4 h-4" />
                      {t.profileSection.uploadPhoto}
                    </button>
                    <button className="px-3 py-2 bg-accent text-foreground rounded-lg hover:bg-accent/80 transition-colors text-sm">
                      {t.profileSection.removePhoto}
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.profileSection.firstName}
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.profileSection.lastName}
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.profileSection.email}
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.profileSection.phone}
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.profileSection.jobTitle}
                      </label>
                      <input
                        type="text"
                        value={profileForm.jobTitle}
                        onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                        className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.profileSection.company}
                    </label>
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                      className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.profileSection.bio}
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder={t.profileSection.bioPlaceholder}
                      rows={4}
                      className="w-full px-4 py-2 bg-accent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground resize-none"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          {t.profileSection.saving}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {t.profileSection.saveChanges}
                        </>
                      )}
                    </button>
                    {saveSuccess && (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">
                        ✓ Saved successfully
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Language Tab */}
            {activeTab === 'language' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg text-foreground mb-1">{t.languageSection.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.languageSection.subtitle}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-3">
                      {t.languageSection.selectLanguage}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(LANGUAGES).map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`
                            flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
                            ${language === lang.code
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-border/60 hover:bg-accent'
                            }
                          `}
                        >
                          <span className="text-2xl">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="text-sm text-foreground">{lang.nativeName}</div>
                            <div className="text-xs text-muted-foreground">{lang.name}</div>
                          </div>
                          {language === lang.code && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg text-foreground mb-1">{t.appearanceSection.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.appearanceSection.subtitle}</p>
                </div>

                <div className="space-y-6">
                  {/* Theme */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-3">
                      {t.appearanceSection.colorScheme}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'system'].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => setTheme(themeOption as any)}
                          className={`
                            p-4 rounded-xl border-2 transition-all
                            ${theme === themeOption
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-border/60 hover:bg-accent'
                            }
                          `}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className={`
                              w-12 h-12 rounded-lg border border-border flex items-center justify-center
                              ${themeOption === 'light' ? 'bg-white' : themeOption === 'dark' ? 'bg-gray-900' : 'bg-linear-to-br from-white to-gray-900'}
                            `}>
                              {themeOption === 'light' && '☀️'}
                              {themeOption === 'dark' && '🌙'}
                              {themeOption === 'system' && '💻'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>                    <div className="mt-3">
                      
                    </div>                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="block text-sm text-muted-foreground mb-3">
                      {t.appearanceSection.fontSize}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => handlePreferenceChange('fontSize', size)}
                          className={`
                            p-4 rounded-xl border-2 transition-all
                            ${preferences.fontSize === size
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-border/60 hover:bg-accent'
                            }
                          `}
                        >
                          <div className="text-sm text-foreground">
                            {t.appearanceSection.fontSizes[size]}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                      <div>
                        <div className="text-sm text-foreground">{t.appearanceSection.compactMode}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.compactMode}
                        onChange={(e) => handlePreferenceChange('compactMode', e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                      <div>
                        <div className="text-sm text-foreground">{t.appearanceSection.animations}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.animations}
                        onChange={(e) => handlePreferenceChange('animations', e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg text-foreground mb-1">{t.preferencesSection.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.preferencesSection.subtitle}</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.preferencesSection.autoSave}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.autoSave}
                      onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.preferencesSection.confirmDelete}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.confirmDelete}
                      onChange={(e) => handlePreferenceChange('confirmDelete', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.preferencesSection.showLineNumbers}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.showLineNumbers}
                      onChange={(e) => handlePreferenceChange('showLineNumbers', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.preferencesSection.enableSuggestions}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.enableSuggestions}
                      onChange={(e) => handlePreferenceChange('enableSuggestions', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <div className="p-4 bg-accent rounded-xl">
                    <label className="block text-sm text-foreground mb-2">
                      {t.preferencesSection.resultsPerPage}
                    </label>
                    <select
                      value={preferences.resultsPerPage}
                      onChange={(e) => handlePreferenceChange('resultsPerPage', parseInt(e.target.value))}
                      className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg text-foreground mb-1">{t.notificationsSection.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.notificationsSection.subtitle}</p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.notificationsSection.emailNotifications}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.notificationsSection.queryComplete}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifyQueryComplete}
                      onChange={(e) => handlePreferenceChange('notifyQueryComplete', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.notificationsSection.newFeatures}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.notifyNewFeatures}
                      onChange={(e) => handlePreferenceChange('notifyNewFeatures', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.notificationsSection.weeklyDigest}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.weeklyDigest}
                      onChange={(e) => handlePreferenceChange('weeklyDigest', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.notificationsSection.securityAlerts}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.securityAlerts}
                      onChange={(e) => handlePreferenceChange('securityAlerts', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg text-foreground mb-1">{t.privacySection.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.privacySection.subtitle}</p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.privacySection.dataCollection}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.dataCollection}
                      onChange={(e) => handlePreferenceChange('dataCollection', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.privacySection.analytics}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-accent rounded-xl cursor-pointer">
                    <div>
                      <div className="text-sm text-foreground">{t.privacySection.crashReports}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.crashReports}
                      onChange={(e) => handlePreferenceChange('crashReports', e.target.checked)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
                    />
                  </label>

                  <div className="pt-6 border-t border-border space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 transition-colors">
                      <Save className="w-4 h-4" />
                      {t.privacySection.downloadData}
                    </button>

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg hover:bg-destructive/20 transition-colors">
                      <Shield className="w-4 h-4" />
                      {t.privacySection.deleteAccount}
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      {t.privacySection.deleteAccountWarning}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
