export type QuestionCategory =
  | 'overview'      // Aperçu général
  | 'analysis'      // Analyses détaillées
  | 'comparison'    // Comparaisons
  | 'trends'        // Tendances temporelles
  | 'top'           // Top N / Classements
  | 'aggregation';  // Sommes, moyennes, totaux

export interface QuestionSuggestion {
  id: string;
  text: string;
  category: QuestionCategory;
  icon?: string;
  sql?: string; // SQL généré (optionnel, pour preview)
  complexity: 'simple' | 'medium' | 'advanced';
  tags?: string[]; // Ex: ['ventes', 'clients', 'produits']
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
  rowCount?: number;
}

export interface ColumnSchema {
  name: string;
  type: string; // 'string', 'number', 'date', 'boolean'
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencedTable?: string;
  isNullable?: boolean;
}

export interface DatabaseSchema {
  tables: TableSchema[];
  relationships?: {
    from: string;
    to: string;
    type: 'one-to-many' | 'many-to-many';
  }[];
}
