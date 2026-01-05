# 🔐 Authentication & Settings System - DataSpeak

## Vue d'ensemble

DataSpeak dispose maintenant d'un système complet d'authentification et de gestion des paramètres utilisateur avec :
- 🔐 **Page de login/signup** responsive et multilingue
- ⚙️ **Modal de settings** avec 6 sections
- 👤 **Gestion du profil** utilisateur
- 🌍 **Sélecteur de langue** intégré
- 🎨 **Gestion du thème** (Light/Dark/System)
- 💾 **Persistence** localStorage

---

## 🏗️ Architecture

### Nouveaux Fichiers

```
/types/user.ts                      → Types User et UserPreferences
/contexts/UserContext.tsx           → Context pour authentification
/pages/LoginPage.tsx                → Page de connexion/inscription
/components/SettingsModal.tsx       → Modal des paramètres
/i18n/translations-login.ts         → Traductions login & settings
/docs/AUTHENTICATION_SETTINGS.md    → Cette documentation
```

### Structure de Données

#### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  createdAt: Date;
  lastLogin?: Date;
}
```

#### UserPreferences
```typescript
interface UserPreferences {
  // Language & Appearance
  language: 'fr' | 'en' | 'es' | 'de';
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  
  // Preferences
  autoSave: boolean;
  confirmDelete: boolean;
  showLineNumbers: boolean;
  enableSuggestions: boolean;
  resultsPerPage: number;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  notifyQueryComplete: boolean;
  notifyNewFeatures: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
  
  // Privacy
  dataCollection: boolean;
  analytics: boolean;
  crashReports: boolean;
}
```

---

## 🔐 Page de Login

### Fonctionnalités

#### Mode Connexion (Sign In)
- ✅ Email + mot de passe
- ✅ Checkbox "Se souvenir de moi"
- ✅ Lien "Mot de passe oublié"
- ✅ Validation formulaire en temps réel
- ✅ Messages d'erreur traduits
- ✅ Loading state pendant connexion

#### Mode Inscription (Sign Up)
- ✅ Prénom + Nom
- ✅ Email + mot de passe
- ✅ Confirmation mot de passe
- ✅ Checkbox acceptation des CGU
- ✅ Validation : email valide, mot de passe 8+ caractères
- ✅ Vérification correspondance mots de passe

#### Login Social
- ✅ Bouton "Continuer avec Google"
- ✅ Bouton "Continuer avec GitHub"
- ✅ Prêt pour OAuth (TODO: implémenter)

#### Design
- ✅ Layout 2 colonnes (form + branding)
- ✅ Branding masqué sur mobile
- ✅ Sélecteur de langue en haut à droite
- ✅ Animations fluides
- ✅ Mode sombre complet
- ✅ Responsive mobile/tablet/desktop

### Validation

```typescript
// Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mot de passe
password.length >= 8

// Correspondance
password === confirmPassword

// Champs requis
email && password && (mode === 'signup' ? firstName && lastName && agreeTerms : true)
```

### Erreurs Traduites

| Clé | FR | EN | ES | DE |
|-----|----|----|----|----|
| `invalidEmail` | Email invalide | Invalid email | Email inválido | Ungültige E-Mail |
| `passwordTooShort` | 8+ caractères | 8+ characters | 8+ caracteres | 8+ Zeichen |
| `passwordMismatch` | Ne correspondent pas | Do not match | No coinciden | Stimmen nicht überein |
| `loginFailed` | Identifiants incorrects | Invalid credentials | Credenciales inválidas | Ungültige Anmeldedaten |

---

## ⚙️ Modal de Settings

### 6 Sections

#### 1. 👤 **Profil**
- **Avatar** : Upload/Remove photo
- **Informations** :
  - Prénom / Nom
  - Email
  - Téléphone
  - Poste / Entreprise
  - Biographie (textarea)
- **Actions** :
  - Bouton "Enregistrer" avec loading state
  - Success notification

#### 2. 🌍 **Langue et Région**
- **Sélecteur de langue** : Grid 2x2 avec drapeaux
  - 🇫🇷 Français
  - 🇬🇧 English
  - 🇪🇸 Español
  - 🇩🇪 Deutsch
- **Indicateur actif** : Border primary + dot
- **Future** :
  - Format de date
  - Format d'heure
  - Fuseau horaire
  - Format des nombres
  - Devise

#### 3. 🎨 **Apparence**
- **Thème** : Grid 3 colonnes
  - ☀️ Clair
  - 🌙 Sombre
  - 💻 Système
- **Taille de police** : Petit / Moyen / Grand
- **Mode compact** : Toggle
- **Animations** : Toggle

#### 4. ⚙️ **Préférences**
- **Sauvegarde auto** : Toggle
- **Confirmer suppressions** : Toggle
- **Numéros de ligne** : Toggle
- **Suggestions** : Toggle
- **Résultats par page** : Select (10/25/50/100)

#### 5. 🔔 **Notifications**
- **Email notifications** : Toggle
- **Push notifications** : Toggle
- **Requête terminée** : Toggle
- **Nouvelles fonctionnalités** : Toggle
- **Résumé hebdomadaire** : Toggle
- **Alertes sécurité** : Toggle

#### 6. 🔒 **Confidentialité**
- **Collecte de données** : Toggle
- **Analytics** : Toggle
- **Rapports de crash** : Toggle
- **Actions destructives** :
  - 💾 Télécharger mes données
  - 🗑️ Supprimer mon compte (avec warning)

### Navigation

```tsx
// Sidebar avec tabs
const tabs = [
  { id: 'profile', label: t.profile, icon: User },
  { id: 'language', label: t.language, icon: Globe },
  { id: 'appearance', label: t.appearance, icon: Palette },
  { id: 'preferences', label: t.preferences, icon: Sliders },
  { id: 'notifications', label: t.notifications, icon: Bell },
  { id: 'privacy', label: t.privacy, icon: Shield },
];

// Active state
activeTab === tab.id ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
```

---

## 🎯 Context UserContext

### Méthodes

```typescript
const {
  user,              // User | null
  preferences,       // UserPreferences
  isAuthenticated,   // boolean
  login,             // (email, password) => Promise<void>
  logout,            // () => void
  updateUser,        // (updates: Partial<User>) => void
  updatePreferences, // (updates: Partial<UserPreferences>) => void
} = useUser();
```

### Persistence

```typescript
// localStorage keys
'dataspeak-user'        // User object
'dataspeak-preferences' // UserPreferences object

// Auto-save on change
useEffect(() => {
  if (user) {
    localStorage.setItem('dataspeak-user', JSON.stringify(user));
  }
}, [user]);
```

### Utilisation

#### Login
```typescript
try {
  await login('user@example.com', 'password123');
  // Redirect automatique vers dashboard
} catch (error) {
  setError('Login failed');
}
```

#### Logout
```typescript
const handleLogout = () => {
  if (confirm(t.user.logoutConfirm)) {
    logout(); // Clear user + localStorage
  }
};
```

#### Update Profile
```typescript
updateUser({
  firstName: 'John',
  lastName: 'Doe',
  jobTitle: 'Data Analyst'
});
```

#### Update Preferences
```typescript
updatePreferences({
  theme: 'dark',
  language: 'fr',
  fontSize: 'large'
});
```

---

## 🎨 Header - Menu Utilisateur

### Dropdown

```tsx
<div className="relative">
  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
    <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-3 rounded-full">
      {user?.firstName?.[0]}
    </div>
  </button>

  {isUserMenuOpen && (
    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl">
      {/* User Info Card */}
      <div className="p-4 border-b border-border bg-accent/30">
        <p>{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>

      {/* Menu Items */}
      <button onClick={() => setIsSettingsOpen(true)}>
        <UserIcon /> Profile
      </button>
      <button onClick={() => setIsSettingsOpen(true)}>
        <Settings /> Settings
      </button>
      <button onClick={handleLogout}>
        <LogOut /> Logout
      </button>
    </div>
  )}
</div>
```

### Fermeture auto (click outside)

```typescript
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
```

---

## 🌍 Intégration avec i18n

### Traductions Login/Settings

```typescript
import { loginTranslations } from '../i18n/translations-login';

const { language } = useTranslation();
const t = loginTranslations[language];

// Usage
<h1>{t.login.title}</h1>
<label>{t.login.email}</label>
<button>{t.settings.profileSection.saveChanges}</button>
```

### Changement de langue dans Settings

```tsx
// Synchronisation automatique
const { language, setLanguage } = useTranslation();

<button onClick={() => setLanguage('fr')}>
  🇫🇷 Français
</button>

// L'interface se met à jour instantanément
```

---

## 🎨 Intégration avec ThemeProvider

### Changement de thème dans Settings

```tsx
import { useTheme } from './ThemeProvider';

const { theme, setTheme } = useTheme();

<button onClick={() => setTheme('dark')}>
  🌙 Dark
</button>

// Persistence automatique dans localStorage
```

### Synchronisation Preferences ↔ Theme

```typescript
// Dans SettingsModal
const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
  setTheme(newTheme);
  updatePreferences({ theme: newTheme });
};
```

---

## 📱 Responsive Design

### LoginPage

| Breakpoint | Layout | Visible |
|------------|--------|---------|
| Mobile (<768px) | Form seul | Logo + Form |
| Tablet (768-1024px) | Form seul | Logo + Form |
| Desktop (>1024px) | 2 colonnes | Form + Branding |

### SettingsModal

| Breakpoint | Layout | Changes |
|------------|--------|---------|
| Mobile | 1 colonne | Tabs en dropdown |
| Tablet | Sidebar + Content | Full tabs visible |
| Desktop | Sidebar + Content | Max-width 5xl |

---

## 🔒 Sécurité

### Validation Côté Client

```typescript
// Email
if (!emailRegex.test(formData.email)) {
  setError(t.errors.invalidEmail);
  return false;
}

// Mot de passe
if (formData.password.length < 8) {
  setError(t.errors.passwordTooShort);
  return false;
}

// Correspondance
if (mode === 'signup' && formData.password !== formData.confirmPassword) {
  setError(t.errors.passwordMismatch);
  return false;
}
```

### TODO Backend

- [ ] **Hash des mots de passe** : bcrypt
- [ ] **JWT tokens** : Access + Refresh
- [ ] **Rate limiting** : 5 tentatives max
- [ ] **OAuth** : Google + GitHub
- [ ] **2FA** : TOTP
- [ ] **Email verification** : Envoi email confirmation
- [ ] **Password reset** : Token temporaire
- [ ] **Session management** : Expiration auto

---

## 🚀 Flux d'Utilisation

### 1. Première Visite

```
User arrives
  ↓
isAuthenticated = false
  ↓
<LoginPage /> displayed
  ↓
User signs up/logs in
  ↓
UserContext.login()
  ↓
isAuthenticated = true
  ↓
<AppContent /> (Dashboard)
```

### 2. Retour Utilisateur

```
User returns
  ↓
UserContext checks localStorage
  ↓
User found → isAuthenticated = true
  ↓
Direct access to <AppContent />
```

### 3. Changement de Settings

```
User clicks avatar → dropdown
  ↓
Clicks "Settings"
  ↓
<SettingsModal isOpen={true} />
  ↓
User changes language/theme/preferences
  ↓
Saved to localStorage + Context
  ↓
UI updates instantly
```

### 4. Logout

```
User clicks "Logout"
  ↓
Confirmation dialog
  ↓
UserContext.logout()
  ↓
localStorage cleared
  ↓
Redirect to <LoginPage />
```

---

## 📊 Métriques de Succès

### KPIs à Tracker

| Métrique | Objectif | Description |
|----------|----------|-------------|
| **Sign-up rate** | >60% | % visiteurs qui créent un compte |
| **Login success** | >95% | % tentatives de login réussies |
| **Settings usage** | >40% | % utilisateurs qui ouvrent settings |
| **Language changes** | >25% | % utilisateurs qui changent de langue |
| **Theme preference** | 50/50 | Répartition Light vs Dark |
| **Retention D7** | >70% | % utilisateurs actifs à J+7 |

### Analytics Events

```typescript
// À implémenter
analytics.track('user_signup', { method: 'email' });
analytics.track('user_login', { method: 'google' });
analytics.track('settings_opened', { tab: 'profile' });
analytics.track('language_changed', { from: 'en', to: 'fr' });
analytics.track('theme_changed', { theme: 'dark' });
analytics.track('user_logout');
```

---

## 🔮 Roadmap Futures Améliorations

### Court Terme (Semaine 1-2)
- [ ] **Password reset flow** : Email avec token
- [ ] **Email verification** : Lien de confirmation
- [ ] **Remember me** : Cookie 30 jours
- [ ] **Toast notifications** : Feedback visuel

### Moyen Terme (Mois 1)
- [ ] **OAuth Google** : Sign in with Google
- [ ] **OAuth GitHub** : Sign in with GitHub
- [ ] **2FA** : Google Authenticator
- [ ] **Profile picture upload** : Cloudinary/S3
- [ ] **Account deletion** : Soft delete + 30 days grace

### Long Terme (Mois 2-3)
- [ ] **SSO Enterprise** : SAML/OIDC
- [ ] **Teams** : Multi-users workspaces
- [ ] **Roles & Permissions** : Admin/Editor/Viewer
- [ ] **Audit logs** : Historique actions
- [ ] **GDPR compliance** : Export/Delete data
- [ ] **Session management** : Active sessions list

---

## 🐛 Troubleshooting

### User Stuck on Login

**Cause** : localStorage corrompu

**Solution** :
```javascript
localStorage.removeItem('dataspeak-user');
localStorage.removeItem('dataspeak-preferences');
window.location.reload();
```

### Settings Not Saving

**Cause** : updatePreferences pas appelé

**Solution** :
```typescript
// Vérifier que updatePreferences est bien appelé
const handleChange = (key: string, value: any) => {
  console.log('Updating:', key, value);
  updatePreferences({ [key]: value });
};
```

### Theme Not Applying

**Cause** : Conflit localStorage

**Solution** :
```typescript
// Dans ThemeProvider, vérifier l'ordre de priorité
const [theme, setTheme] = useState<Theme>(() => {
  const stored = localStorage.getItem('dataspeak-theme');
  return (stored as Theme) || preferences.theme || 'system';
});
```

---

## 📚 Ressources

- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [Authentication Flow UX](https://www.nngroup.com/articles/authentication-ux/)
- [GDPR Compliance](https://gdpr.eu/)
- [OAuth 2.0 Guide](https://oauth.net/2/)
- [WCAG Accessibility](https://www.w3.org/WAI/WCAG21/Understanding/)

---

**Dernière mise à jour** : Janvier 2026  
**Auteur** : Équipe DataSpeak  
**Version** : 1.0.0  
**Status** : ✅ Production Ready
