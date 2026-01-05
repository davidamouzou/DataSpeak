# 🌍 Système d'Internationalisation (i18n) DataSpeak

## Vue d'ensemble

DataSpeak dispose d'un système complet d'internationalisation permettant de supporter **4 langues** :
- 🇫🇷 **Français** (fr) - Langue par défaut
- 🇬🇧 **Anglais** (en)
- 🇪🇸 **Espagnol** (es)
- 🇩🇪 **Allemand** (de)

---

## 🏗️ Architecture

### Structure des Fichiers

```
/types/i18n.ts                    → Types TypeScript (Language, TranslationKeys)
/i18n/translations.ts             → Traductions complètes pour les 4 langues
/contexts/LanguageContext.tsx     → Context React + Provider
/components/LanguageSelector.tsx  → Sélecteur de langue (dropdown)
/utils/questionGenerator.ts       → Générateur multilingue de questions
```

---

## 🔧 Fonctionnalités

### ✅ Détection Automatique
- **Détection du navigateur** : Langue auto-détectée via `navigator.language`
- **Fallback intelligent** : Si la langue n'est pas supportée → Anglais par défaut

### ✅ Persistence
- **localStorage** : Sauvegarde automatique de la préférence utilisateur
- **Clé** : `dataspeak-language`
- **Format** : `'fr' | 'en' | 'es' | 'de'`

### ✅ Mise à jour du DOM
- Attribut `lang` du document mis à jour automatiquement
- Exemple : `<html lang="fr">` → `<html lang="en">`

### ✅ Régénération Dynamique
- **Questions intelligentes** : Régénérées automatiquement lors du changement de langue
- **Traductions UI** : Mises à jour instantanément sans rechargement

---

## 📝 Utilisation

### 1. Dans un Composant React

```tsx
import { useTranslation } from '../contexts/LanguageContext';

function MyComponent() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div>
      <h1>{t.common.appName}</h1>
      <p>{t.emptyState.welcome}</p>
      
      {/* Changer de langue */}
      <button onClick={() => setLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

### 2. Hook Simplifié (Traductions uniquement)

```tsx
import { useT } from '../contexts/LanguageContext';

function MyComponent() {
  const t = useT(); // Juste les traductions, pas setLanguage

  return <h1>{t.header.newConversation}</h1>;
}
```

### 3. Accès Direct aux Traductions

```tsx
import { translations } from '../i18n/translations';

const frenchTranslations = translations['fr'];
console.log(frenchTranslations.common.appName); // "DataSpeak"
```

---

## 🎨 Composant LanguageSelector

### Fonctionnalités
- ✅ Dropdown élégant avec drapeaux
- ✅ Affichage du nom natif (Français, English, Español, Deutsch)
- ✅ Indication visuelle de la langue active (✓)
- ✅ Fermeture automatique au clic extérieur
- ✅ Responsive (nom complet sur desktop, drapeau seul sur mobile)
- ✅ Footer indiquant la langue auto-détectée

### Intégration dans le Header

```tsx
import { LanguageSelector } from './LanguageSelector';

export function Header() {
  return (
    <header>
      {/* ... autres éléments ... */}
      <LanguageSelector />
    </header>
  );
}
```

---

## 📊 Structure des Traductions

### Catégories Principales

| Catégorie | Description | Exemple de Clés |
|-----------|-------------|-----------------|
| `common` | Éléments réutilisables | `loading`, `error`, `save`, `cancel` |
| `header` | En-tête de l'app | `newConversation`, `export`, `settings` |
| `sidebar` | Barre latérale | `dataSources`, `conversations`, `today` |
| `emptyState` | Page d'accueil vide | `welcome`, `subtitle`, `connectSource` |
| `chat` | Zone de conversation | `inputPlaceholder`, `sendButton` |
| `suggestions` | Questions suggérées | `title`, `subtitle`, `categories` |
| `questionTemplates` | Templates de questions | `howMany`, `totalOf`, `topN` |
| `dataSource` | Modal de connexion DB | `modalTitle`, `testConnection` |
| `schema` | Viewer de schéma | `title`, `tables`, `relationships` |
| `examples` | Questions d'exemple | `salesAnalysis`, `customerManagement` |
| `theme` | Sélecteur de thème | `light`, `dark`, `system` |

### Exemple Complet (Français)

```typescript
fr: {
  common: {
    appName: 'DataSpeak',
    loading: 'Chargement...',
    error: 'Erreur',
    save: 'Enregistrer',
    cancel: 'Annuler'
  },
  header: {
    newConversation: 'Nouvelle conversation',
    export: 'Exporter'
  },
  suggestions: {
    title: 'Questions suggérées',
    complexity: {
      simple: 'Simple',
      medium: 'Intermédiaire',
      advanced: 'Avancé'
    },
    categories: {
      overview: 'Aperçu',
      analysis: 'Analyse',
      trends: 'Tendances'
    }
  }
}
```

---

## 🤖 Générateur de Questions Multilingue

### Intégration

Le `QuestionGenerator` adapte automatiquement les questions selon la langue :

```typescript
import { questionGenerator } from '../utils/questionGenerator';

// Configurer la langue
questionGenerator.setLanguage('en');
questionGenerator.setSchema(mySchema);

// Générer les questions
const questions = questionGenerator.getSchemaBasedQuestions();
// → ["How many customers are registered?", "What is the total of revenue?", ...]
```

### Questions Générées

| Type | Français | Anglais | Espagnol | Allemand |
|------|----------|---------|----------|----------|
| **COUNT** | "Combien de clients ?" | "How many customers?" | "¿Cuántos clientes?" | "Wie viele Kunden?" |
| **SUM** | "Quel est le total ?" | "What is the total?" | "¿Cuál es el total?" | "Was ist die Summe?" |
| **AVG** | "Quelle est la moyenne ?" | "What is the average?" | "¿Cuál es el promedio?" | "Was ist der Durchschnitt?" |
| **TOP** | "Top 10 des produits" | "Top 10 products" | "Top 10 de productos" | "Top 10 Produkte" |
| **TREND** | "Évolution par mois" | "Evolution by month" | "Evolución por mes" | "Entwicklung nach Monat" |

---

## 🚀 Hook useQuestionSuggestions

### Passage de la Langue

```tsx
import { useQuestionSuggestions } from '../hooks/useQuestionSuggestions';
import { useTranslation } from '../contexts/LanguageContext';

function MyComponent() {
  const { language } = useTranslation();
  
  const { suggestions } = useQuestionSuggestions({
    schema: mySchema,
    mode: 'schema',
    language: language  // ← Langue passée ici
  });

  return (
    <QuestionSuggestions suggestions={suggestions} />
  );
}
```

### Régénération Automatique

Les suggestions sont **automatiquement régénérées** quand la langue change grâce à `useEffect` :

```typescript
useEffect(() => {
  generateSuggestions();
}, [language]); // ← Dépendance sur language
```

---

## 🎯 Composants Traduits

### Liste Complète

| Composant | Éléments Traduits |
|-----------|-------------------|
| **Header** | Titre, boutons, placeholder search |
| **Sidebar** | Titres sections, dates relatives |
| **EmptyState** | Titre, subtitle, CTA, exemples |
| **ChatArea** | Placeholder input, hints, compteur suggestions |
| **QuestionSuggestions** | Titre, catégories, complexité, états vides |
| **SchemaViewer** | Titre, labels (tables, relations, types) |
| **DataSourceModal** | Labels formulaire, types de sources |
| **ThemeToggle** | Labels thèmes (déjà implémenté) |

---

## 📈 Ajout d'une Nouvelle Langue

### Étape 1 : Ajouter le Type

```typescript
// /types/i18n.ts
export type Language = 'fr' | 'en' | 'es' | 'de' | 'it'; // ← Ajout 'it'

export const LANGUAGES: Record<Language, LanguageConfig> = {
  // ... langues existantes ...
  it: { 
    code: 'it', 
    name: 'Italian', 
    nativeName: 'Italiano', 
    flag: '🇮🇹' 
  }
};
```

### Étape 2 : Ajouter les Traductions

```typescript
// /i18n/translations.ts
export const translations: Record<string, TranslationKeys> = {
  // ... traductions existantes ...
  it: {
    common: {
      appName: 'DataSpeak',
      loading: 'Caricamento...',
      error: 'Errore',
      // ... etc
    },
    // ... toutes les autres clés
  }
};
```

### Étape 3 : Mettre à Jour la Détection

```typescript
// /contexts/LanguageContext.tsx
function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLanguages: Language[] = ['fr', 'en', 'es', 'de', 'it']; // ← Ajout 'it'
  
  if (supportedLanguages.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return 'en';
}
```

### Étape 4 : Tester

```bash
# Changer la langue du navigateur en italien
# Ou forcer dans localStorage :
localStorage.setItem('dataspeak-language', 'it');
# Recharger la page
```

---

## 🧪 Tests

### Test de Détection Automatique

```typescript
// Mock navigator.language
Object.defineProperty(navigator, 'language', {
  value: 'es-ES',
  configurable: true
});

// Devrait détecter 'es'
const detected = detectBrowserLanguage();
expect(detected).toBe('es');
```

### Test de Changement de Langue

```typescript
const { result } = renderHook(() => useTranslation());

// Langue initiale
expect(result.current.language).toBe('fr');

// Changer de langue
act(() => {
  result.current.setLanguage('en');
});

// Vérifier le changement
expect(result.current.language).toBe('en');
expect(result.current.t.common.appName).toBe('DataSpeak');
```

### Test de Persistence

```typescript
localStorage.setItem('dataspeak-language', 'de');

const { result } = renderHook(() => useTranslation());
expect(result.current.language).toBe('de');
```

---

## 🎨 Guidelines de Traduction

### 1. Ton et Style

| Langue | Style | Formalité | Exemples |
|--------|-------|-----------|----------|
| 🇫🇷 Français | Formel, poli | Vouvoiement | "Connectez votre source" |
| 🇬🇧 Anglais | Neutre, direct | Tu/Vous contextuel | "Connect your source" |
| 🇪🇸 Espagnol | Formel | Usted | "Conecta tu fuente" |
| 🇩🇪 Allemand | Formel, précis | Sie | "Verbinden Sie Ihre Quelle" |

### 2. Longueur des Textes

- **Boutons** : Maximum 20 caractères
- **Titres** : Maximum 50 caractères
- **Descriptions** : Maximum 150 caractères

⚠️ **Attention** : L'allemand est souvent plus long que l'anglais !

### 3. Pluriels et Genres

```typescript
// ❌ Mauvais (hardcodé en français)
text: `${count} clients trouvés`

// ✅ Bon (neutre, adaptable)
text: t.results.found.replace('{count}', count.toString())

// Dans translations.ts :
fr: { results: { found: '{count} clients trouvés' } }
en: { results: { found: '{count} clients found' } }
de: { results: { found: '{count} Kunden gefunden' } }
```

### 4. Dates et Formats

```typescript
// Utiliser Intl pour les dates
const formattedDate = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}).format(new Date());

// FR: "3 janvier 2026"
// EN: "January 3, 2026"
// DE: "3. Januar 2026"
```

---

## 🐛 Debugging

### Afficher la Langue Active

```tsx
import { useTranslation } from '../contexts/LanguageContext';

function DebugLanguage() {
  const { language } = useTranslation();
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white px-3 py-1 rounded">
      Current: {language}
    </div>
  );
}
```

### Logs dans la Console

```typescript
// Dans LanguageContext.tsx
useEffect(() => {
  console.log('🌍 Language changed to:', language);
  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;
}, [language]);
```

### Vérifier les Traductions Manquantes

```typescript
function checkMissingTranslations() {
  const languages = ['fr', 'en', 'es', 'de'];
  const keys = Object.keys(translations['fr']);
  
  languages.forEach(lang => {
    keys.forEach(key => {
      if (!translations[lang][key]) {
        console.warn(`❌ Missing translation: ${lang}.${key}`);
      }
    });
  });
}
```

---

## 📊 Statistiques de Traduction

### Couverture

| Langue | Clés | Complétude | Status |
|--------|------|------------|--------|
| 🇫🇷 FR | 150+ | 100% | ✅ Complet |
| 🇬🇧 EN | 150+ | 100% | ✅ Complet |
| 🇪🇸 ES | 150+ | 100% | ✅ Complet |
| 🇩🇪 DE | 150+ | 100% | ✅ Complet |

### Sections Traduites

- ✅ Interface complète (Header, Sidebar, Chat)
- ✅ Suggestions de questions auto-générées
- ✅ Modales et dialogues
- ✅ Messages d'état (loading, erreur, succès)
- ✅ Exemples et tutoriels
- ✅ Labels de formulaires
- ✅ Tooltips et hints

---

## 🚀 Améliorations Futures

### Court Terme
- [ ] **Raccourci clavier** : `Ctrl+Shift+L` pour ouvrir le sélecteur
- [ ] **Toast notification** : "Langue changée en Français"
- [ ] **Animation de transition** : Fade entre langues

### Moyen Terme
- [ ] **Traduction API SQL** : Traduire les commentaires SQL générés
- [ ] **Voice locale** : Adapter la reconnaissance vocale à la langue
- [ ] **Format nombres** : 1,234.56 (EN) vs 1 234,56 (FR)
- [ ] **Suggestions contextuelles** : Questions adaptées à la culture locale

### Long Terme
- [ ] **RTL Support** : Arabe, Hébreu (direction droite-gauche)
- [ ] **Contribution communautaire** : Interface pour ajouter des langues
- [ ] **IA traduction** : Traduction automatique de nouvelles questions
- [ ] **A/B Testing** : Tester différentes formulations par langue

---

## 🔗 Ressources

- [MDN Web Docs - Intl](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [React i18n Best Practices](https://react.i18next.com/)
- [WCAG Internationalization](https://www.w3.org/WAI/WCAG21/Understanding/)
- [Unicode CLDR](https://cldr.unicode.org/)

---

**Dernière mise à jour** : Janvier 2026  
**Auteur** : Équipe DataSpeak  
**Version** : 1.0.0  
**Langues supportées** : FR, EN, ES, DE
