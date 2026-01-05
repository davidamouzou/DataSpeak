import { 
  QuestionSuggestion, 
  DatabaseSchema, 
  TableSchema, 
  QuestionCategory 
} from '../types/suggestions';

/**
 * Générateur intelligent de questions basé sur le schéma de la base de données
 */
export class QuestionGenerator {
  private schema: DatabaseSchema | null = null;

  setSchema(schema: DatabaseSchema) {
    this.schema = schema;
  }

  /**
   * Génère des questions génériques (sans connexion DB)
   */
  getGenericQuestions(): QuestionSuggestion[] {
    return [
      {
        id: 'gen-1',
        text: "Quelles sont les tables disponibles dans ma base de données ?",
        category: 'overview',
        icon: '📊',
        complexity: 'simple',
        tags: ['schéma', 'structure']
      },
      {
        id: 'gen-2',
        text: "Donne-moi un aperçu des données dans chaque table",
        category: 'overview',
        icon: '👁️',
        complexity: 'simple',
        tags: ['aperçu', 'données']
      },
      {
        id: 'gen-3',
        text: "Combien de lignes ai-je dans ma base de données ?",
        category: 'aggregation',
        icon: '🔢',
        complexity: 'simple',
        tags: ['comptage', 'volume']
      },
      {
        id: 'gen-4',
        text: "Montre-moi les relations entre mes tables",
        category: 'overview',
        icon: '🔗',
        complexity: 'medium',
        tags: ['relations', 'schéma']
      },
      {
        id: 'gen-5',
        text: "Identifie les colonnes avec beaucoup de valeurs nulles",
        category: 'analysis',
        icon: '⚠️',
        complexity: 'medium',
        tags: ['qualité', 'données']
      }
    ];
  }

  /**
   * Génère des questions basées sur le schéma DB
   */
  getSchemaBasedQuestions(): QuestionSuggestion[] {
    if (!this.schema) return this.getGenericQuestions();

    const questions: QuestionSuggestion[] = [];
    
    // Pour chaque table, générer des questions pertinentes
    this.schema.tables.forEach(table => {
      questions.push(...this.generateTableQuestions(table));
    });

    // Questions sur les relations entre tables
    if (this.schema.relationships && this.schema.relationships.length > 0) {
      questions.push(...this.generateRelationshipQuestions());
    }

    // Limiter à 12 suggestions max pour ne pas surcharger l'interface
    return this.rankAndLimit(questions, 12);
  }

  /**
   * Génère des questions pour une table spécifique
   */
  private generateTableQuestions(table: TableSchema): QuestionSuggestion[] {
    const questions: QuestionSuggestion[] = [];
    const tableName = this.formatTableName(table.name);

    // Questions de base (COUNT)
    questions.push({
      id: `table-${table.name}-count`,
      text: `Combien de ${tableName} sont enregistrés ?`,
      category: 'aggregation',
      icon: '🔢',
      complexity: 'simple',
      sql: `SELECT COUNT(*) FROM ${table.name}`,
      tags: [tableName, 'comptage']
    });

    // Trouver les colonnes numériques
    const numericColumns = table.columns.filter(col => 
      ['number', 'integer', 'decimal', 'float'].includes(col.type.toLowerCase())
    );

    if (numericColumns.length > 0) {
      const numCol = numericColumns[0];
      questions.push({
        id: `table-${table.name}-sum-${numCol.name}`,
        text: `Quel est le total de ${this.formatColumnName(numCol.name)} pour les ${tableName} ?`,
        category: 'aggregation',
        icon: '➕',
        complexity: 'simple',
        sql: `SELECT SUM(${numCol.name}) FROM ${table.name}`,
        tags: [tableName, 'somme']
      });

      questions.push({
        id: `table-${table.name}-avg-${numCol.name}`,
        text: `Quelle est la moyenne de ${this.formatColumnName(numCol.name)} ?`,
        category: 'analysis',
        icon: '📊',
        complexity: 'simple',
        sql: `SELECT AVG(${numCol.name}) FROM ${table.name}`,
        tags: [tableName, 'moyenne']
      });
    }

    // Trouver les colonnes de date
    const dateColumns = table.columns.filter(col => 
      ['date', 'datetime', 'timestamp'].includes(col.type.toLowerCase())
    );

    if (dateColumns.length > 0) {
      const dateCol = dateColumns[0];
      questions.push({
        id: `table-${table.name}-trend-${dateCol.name}`,
        text: `Montre-moi l'évolution des ${tableName} par mois`,
        category: 'trends',
        icon: '📈',
        complexity: 'medium',
        tags: [tableName, 'tendance', 'temps']
      });

      questions.push({
        id: `table-${table.name}-recent`,
        text: `Quels sont les 10 ${tableName} les plus récents ?`,
        category: 'top',
        icon: '🆕',
        complexity: 'simple',
        sql: `SELECT * FROM ${table.name} ORDER BY ${dateCol.name} DESC LIMIT 10`,
        tags: [tableName, 'récent']
      });
    }

    // Trouver les colonnes catégorielles
    const categoryColumns = table.columns.filter(col => 
      ['string', 'varchar', 'text'].includes(col.type.toLowerCase()) &&
      !col.isPrimaryKey &&
      ['status', 'type', 'category', 'state', 'country', 'city'].some(keyword => 
        col.name.toLowerCase().includes(keyword)
      )
    );

    if (categoryColumns.length > 0) {
      const catCol = categoryColumns[0];
      questions.push({
        id: `table-${table.name}-group-${catCol.name}`,
        text: `Répartition des ${tableName} par ${this.formatColumnName(catCol.name)}`,
        category: 'analysis',
        icon: '🥧',
        complexity: 'medium',
        sql: `SELECT ${catCol.name}, COUNT(*) FROM ${table.name} GROUP BY ${catCol.name}`,
        tags: [tableName, 'répartition']
      });
    }

    // Top N si colonne numérique et nom pertinent
    if (numericColumns.length > 0) {
      const valueCol = numericColumns.find(col => 
        ['price', 'amount', 'total', 'revenue', 'sales'].some(keyword =>
          col.name.toLowerCase().includes(keyword)
        )
      ) || numericColumns[0];

      questions.push({
        id: `table-${table.name}-top-${valueCol.name}`,
        text: `Top 10 des ${tableName} avec le plus grand ${this.formatColumnName(valueCol.name)}`,
        category: 'top',
        icon: '🏆',
        complexity: 'medium',
        sql: `SELECT * FROM ${table.name} ORDER BY ${valueCol.name} DESC LIMIT 10`,
        tags: [tableName, 'classement']
      });
    }

    return questions;
  }

  /**
   * Génère des questions basées sur les relations entre tables
   */
  private generateRelationshipQuestions(): QuestionSuggestion[] {
    const questions: QuestionSuggestion[] = [];

    if (!this.schema?.relationships) return questions;

    this.schema.relationships.forEach(rel => {
      const fromTable = this.formatTableName(rel.from);
      const toTable = this.formatTableName(rel.to);

      questions.push({
        id: `rel-${rel.from}-${rel.to}`,
        text: `Combien de ${toTable} par ${fromTable} ?`,
        category: 'analysis',
        icon: '🔗',
        complexity: 'medium',
        tags: [fromTable, toTable, 'relation']
      });
    });

    return questions;
  }

  /**
   * Génère des questions de suivi basées sur la conversation
   */
  getFollowUpQuestions(lastQuery: string, lastResult?: any): QuestionSuggestion[] {
    const questions: QuestionSuggestion[] = [];

    // Détection du contexte de la dernière question
    const hasCount = lastQuery.toLowerCase().includes('combien');
    const hasTop = lastQuery.toLowerCase().includes('top');
    const hasDate = lastQuery.toLowerCase().includes('mois') || 
                    lastQuery.toLowerCase().includes('année') ||
                    lastQuery.toLowerCase().includes('date');

    if (hasCount) {
      questions.push({
        id: 'followup-detail',
        text: "Montre-moi le détail de ces données",
        category: 'analysis',
        icon: '🔍',
        complexity: 'simple',
        tags: ['détail']
      });

      questions.push({
        id: 'followup-compare',
        text: "Compare avec le mois précédent",
        category: 'comparison',
        icon: '⚖️',
        complexity: 'medium',
        tags: ['comparaison', 'temps']
      });
    }

    if (hasTop) {
      questions.push({
        id: 'followup-bottom',
        text: "Et les 10 derniers ?",
        category: 'top',
        icon: '⬇️',
        complexity: 'simple',
        tags: ['classement']
      });
    }

    if (hasDate) {
      questions.push({
        id: 'followup-yearly',
        text: "Même chose par année",
        category: 'trends',
        icon: '📅',
        complexity: 'medium',
        tags: ['tendance']
      });

      questions.push({
        id: 'followup-growth',
        text: "Calcule le taux de croissance",
        category: 'analysis',
        icon: '📊',
        complexity: 'advanced',
        tags: ['croissance', 'analyse']
      });
    }

    // Questions génériques de suivi
    questions.push({
      id: 'followup-export',
      text: "Exporte ces données en CSV",
      category: 'overview',
      icon: '💾',
      complexity: 'simple',
      tags: ['export']
    });

    questions.push({
      id: 'followup-viz',
      text: "Visualise ces données",
      category: 'overview',
      icon: '📈',
      complexity: 'simple',
      tags: ['visualisation']
    });

    return questions.slice(0, 6);
  }

  /**
   * Classe et limite les questions par pertinence
   */
  private rankAndLimit(questions: QuestionSuggestion[], limit: number): QuestionSuggestion[] {
    // Score de pertinence : simple = 3, medium = 2, advanced = 1
    const scored = questions.map(q => ({
      question: q,
      score: q.complexity === 'simple' ? 3 : q.complexity === 'medium' ? 2 : 1
    }));

    // Trier par score décroissant
    scored.sort((a, b) => b.score - a.score);

    // Diversifier les catégories
    const diversified: QuestionSuggestion[] = [];
    const categoryCounts: Record<QuestionCategory, number> = {
      overview: 0,
      analysis: 0,
      comparison: 0,
      trends: 0,
      top: 0,
      aggregation: 0
    };

    for (const item of scored) {
      const category = item.question.category;
      // Max 3 questions par catégorie
      if (categoryCounts[category] < 3) {
        diversified.push(item.question);
        categoryCounts[category]++;
      }
      if (diversified.length >= limit) break;
    }

    return diversified;
  }

  /**
   * Formate le nom d'une table pour l'affichage
   */
  private formatTableName(tableName: string): string {
    // Enlever les underscores et mettre en minuscules
    return tableName
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/s$/, ''); // Enlever le 's' final si pluriel
  }

  /**
   * Formate le nom d'une colonne pour l'affichage
   */
  private formatColumnName(columnName: string): string {
    return columnName
      .replace(/_/g, ' ')
      .toLowerCase();
  }
}

// Export singleton instance
export const questionGenerator = new QuestionGenerator();
