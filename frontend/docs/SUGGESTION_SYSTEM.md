# 🎯 Système de Suggestions de Questions Auto-générées

## Vue d'ensemble

Le système de suggestions intelligentes de DataSpeak génère automatiquement des questions pertinentes basées sur le schéma de la base de données connectée. Il utilise une approche hybride combinant analyse du schéma et détection du contexte conversationnel.

---

## 🏗️ Architecture

### Composants Principaux

```
/types/suggestions.ts          → Types TypeScript (QuestionSuggestion, DatabaseSchema, etc.)
/utils/questionGenerator.ts    → Moteur de génération de questions
/hooks/useQuestionSuggestions.ts → Hook React pour gérer les suggestions
/components/QuestionSuggestions.tsx → UI d'affichage des suggestions
/data/mockSchema.ts            → Schémas de démonstration
```

---

## 📊 Types de Questions Générées

### 1. **Questions Génériques** (sans connexion DB)
Affichées quand aucune base n'est connectée :
- "Quelles sont les tables disponibles ?"
- "Donne-moi un aperçu des données"
- "Combien de lignes ai-je ?"

### 2. **Questions Basées sur le Schéma**
Générées après analyse du schéma DB :

#### a) Comptage (COUNT)
- ✅ Détection : Toutes les tables
- 📝 Exemple : "Combien de clients sont enregistrés ?"
- 🔍 SQL : `SELECT COUNT(*) FROM customers`

#### b) Agrégations (SUM, AVG)
- ✅ Détection : Colonnes numériques (`price`, `amount`, `total`)
- 📝 Exemple : "Quel est le total de revenue pour les orders ?"
- 🔍 SQL : `SELECT SUM(total_amount) FROM orders`

#### c) Tendances Temporelles
- ✅ Détection : Colonnes de type `date`, `datetime`, `timestamp`
- 📝 Exemple : "Montre-moi l'évolution des orders par mois"
- 🎯 Catégorie : `trends`

#### d) Top N / Classements
- ✅ Détection : Colonnes numériques + dates
- 📝 Exemple : "Top 10 des products avec le plus grand price"
- 🔍 SQL : `SELECT * FROM products ORDER BY price DESC LIMIT 10`

#### e) Répartition par Catégorie
- ✅ Détection : Colonnes texte contenant `status`, `type`, `category`, `country`
- 📝 Exemple : "Répartition des customers par country"
- 🔍 SQL : `SELECT country, COUNT(*) FROM customers GROUP BY country`

#### f) Questions Relationnelles
- ✅ Détection : Foreign keys entre tables
- 📝 Exemple : "Combien de orders par customer ?"
- 🎯 Basé sur : `relationships` dans le schéma

### 3. **Questions de Suivi** (Follow-up)
Générées après une question utilisateur :

| Contexte Détecté | Suggestions Générées |
|-----------------|---------------------|
| Question avec "Combien" | • "Montre-moi le détail"<br>• "Compare avec le mois précédent" |
| Question avec "Top" | • "Et les 10 derniers ?"<br>• "Visualise ces données" |
| Question avec "mois/année" | • "Même chose par année"<br>• "Calcule le taux de croissance" |

---

## 🧠 Algorithme de Génération

### Étape 1 : Analyse du Schéma
```typescript
for each table in schema:
  - Identifier les colonnes numériques
  - Identifier les colonnes de date
  - Identifier les colonnes catégorielles (status, type, etc.)
  - Détecter les clés primaires et étrangères
```

### Étape 2 : Génération de Questions
```typescript
questions = []

// COUNT queries
questions.push(generateCountQuery(table))

// Agrégations (si colonnes numériques)
if (numericColumns.length > 0):
  questions.push(generateSumQuery(table, numericColumn))
  questions.push(generateAvgQuery(table, numericColumn))

// Tendances (si colonnes date)
if (dateColumns.length > 0):
  questions.push(generateTrendQuery(table, dateColumn))
  questions.push(generateRecentQuery(table, dateColumn))

// Répartition (si colonnes catégorielles)
if (categoryColumns.length > 0):
  questions.push(generateGroupByQuery(table, categoryColumn))
```

### Étape 3 : Ranking et Limitation
```typescript
// Score de pertinence
score = {
  simple: 3 points,
  medium: 2 points,
  advanced: 1 point
}

// Diversification
maxQuestionsPerCategory = 3
totalSuggestions = 12
```

---

## 🎨 Catégories de Questions

| Catégorie | Icon | Couleur | Description |
|-----------|------|---------|-------------|
| `overview` | 📚 Layers | Blue | Aperçus généraux |
| `analysis` | 📊 BarChart3 | Purple | Analyses détaillées |
| `comparison` | ⚖️ Filter | Orange | Comparaisons |
| `trends` | 📈 TrendingUp | Emerald | Tendances temporelles |
| `top` | ✨ Sparkles | Amber | Classements Top N |
| `aggregation` | 🔢 BarChart3 | Cyan | Sommes, moyennes |

---

## 🎯 Niveaux de Complexité

### Simple
- Questions COUNT basiques
- SELECT * LIMIT 10
- Pas de JOIN
- **Badge** : 🟢 Vert

### Medium (Intermédiaire)
- GROUP BY
- Agrégations (SUM, AVG)
- Tri simple
- **Badge** : 🟡 Jaune

### Advanced (Avancé)
- Calculs de croissance
- Multi-tables (JOIN)
- Requêtes temporelles complexes
- **Badge** : 🔴 Rouge

---

## 🔧 Utilisation

### Dans un Composant

```tsx
import { useQuestionSuggestions } from '../hooks/useQuestionSuggestions';
import { QuestionSuggestions } from '../components/QuestionSuggestions';

function MyComponent() {
  const { suggestions, isLoading, refresh } = useQuestionSuggestions({
    schema: myDatabaseSchema,  // Schéma de la DB
    lastQuery: '',             // Dernière question (pour follow-up)
    mode: 'schema'             // 'initial' | 'schema' | 'followup'
  });

  return (
    <QuestionSuggestions
      suggestions={suggestions}
      onSelectQuestion={(q) => console.log(q)}
      isLoading={isLoading}
    />
  );
}
```

### Modes de Génération

```typescript
// Mode 1 : Questions génériques (pas de DB)
mode: 'initial'

// Mode 2 : Questions basées sur le schéma
mode: 'schema'
schema: myDatabaseSchema

// Mode 3 : Questions de suivi
mode: 'followup'
lastQuery: "Combien de clients à Paris ?"
lastResult: { ... }
```

---

## 📝 Formatage des Noms

### Tables
```typescript
'user_orders' → 'user order'  (enlève underscore + singularise)
'customers'   → 'customer'    (enlève 's' final)
```

### Colonnes
```typescript
'total_amount' → 'total amount'
'created_at'   → 'created at'
```

---

## 🚀 Améliorations Futures

### Phase 1.5 - Court terme
- [ ] **Détection de contexte métier** : E-commerce, RH, Finance
- [ ] **Templates personnalisés** : Questions spécifiques par industrie
- [ ] **Historique des suggestions** : Sauvegarder les questions populaires
- [ ] **Suggestions multi-langues** : EN, ES, DE

### Phase 2 - Moyen terme
- [ ] **ML-based ranking** : Apprendre des préférences utilisateur
- [ ] **Questions composées** : Combiner plusieurs analyses
- [ ] **Détection d'anomalies** : "Y a-t-il des valeurs aberrantes ?"
- [ ] **Suggestions basées sur l'heure** : Questions contextuelles (matin vs soir)

### Phase 3 - Long terme
- [ ] **Auto-completion intelligente** : Pendant la saisie
- [ ] **Voice-to-suggestion** : Suggestions basées sur l'audio
- [ ] **Collaborative filtering** : "Les utilisateurs similaires ont demandé..."
- [ ] **Integration LLM** : Amélioration continue via GPT-4

---

## 🧪 Tests

### Cas de Test Principaux

```typescript
// Test 1 : Schéma vide
schema = { tables: [] }
expect(suggestions).toEqual(genericQuestions)

// Test 2 : Table simple sans colonnes
schema = { tables: [{ name: 'users', columns: [] }] }
expect(suggestions.length).toBeGreaterThan(0)

// Test 3 : Table avec colonnes numériques
schema = { tables: [{ 
  name: 'products', 
  columns: [{ name: 'price', type: 'decimal' }] 
}] }
expect(suggestions).toContainEqual(expect.objectContaining({
  text: expect.stringContaining('total de price')
}))

// Test 4 : Limiter à 12 suggestions max
schema = complexSchemaWith20Tables
expect(suggestions.length).toBeLessThanOrEqual(12)

// Test 5 : Diversification des catégories
expect(countByCategory('aggregation')).toBeLessThanOrEqual(3)
```

---

## 📊 Métriques de Performance

### Objectifs
- ⏱️ **Génération** : < 200ms pour un schéma de 50 tables
- 🎯 **Pertinence** : 80%+ des suggestions cliquées
- 📈 **Adoption** : 60%+ des utilisateurs cliquent sur une suggestion
- 🔄 **Refresh** : Utilisateurs rafraîchissent < 2 fois en moyenne

### Tracking
```typescript
// À implémenter
analytics.track('suggestion_generated', {
  count: suggestions.length,
  mode: 'schema',
  categories: categoriesUsed
});

analytics.track('suggestion_clicked', {
  suggestionId: 'table-customers-count',
  category: 'aggregation',
  complexity: 'simple'
});
```

---

## 🎨 UI/UX Guidelines

### Affichage
- **Grid** : 2 colonnes sur desktop, 1 sur mobile
- **Max visible** : 6-12 suggestions à la fois
- **Animation** : `slideUp` avec délai progressif (50ms entre chaque)
- **Hover** : Scale 1.02 + border primary

### Interactions
- **Click** : Remplit l'input + focus automatique
- **Refresh** : Icon rotation 180° + régénération
- **Loading** : Skeleton avec pulse

### Accessibilité
- Tous les boutons ont `aria-label`
- Navigation au clavier supportée
- Contrast ratios WCAG AA compliant

---

## 🐛 Debugging

### Logs Utiles
```typescript
// Activer les logs de debug
localStorage.setItem('DEBUG_SUGGESTIONS', 'true')

// Voir le schéma détecté
console.log(questionGenerator.schema)

// Voir toutes les questions avant ranking
console.log(questionsBeforeRanking)
```

### Problèmes Courants

**Pas de suggestions générées**
- ✅ Vérifier que `schema.tables.length > 0`
- ✅ Vérifier que les colonnes ont un `type` valide

**Suggestions non pertinentes**
- ✅ Améliorer le formatage des noms de tables/colonnes
- ✅ Ajouter des mots-clés de détection de colonnes

**Trop lent**
- ✅ Limiter le nombre de tables analysées (top 10)
- ✅ Mettre en cache les suggestions par schéma

---

## 📚 Ressources

- [Text-to-SQL Best Practices](https://arxiv.org/abs/2208.13629)
- [Database Schema Analysis](https://www.dbvis.com/resources/schema-analysis/)
- [Question Suggestion Algorithms](https://research.google/pubs/pub48876/)

---

**Dernière mise à jour** : Janvier 2026  
**Auteur** : Équipe DataSpeak  
**Version** : 1.0.0
