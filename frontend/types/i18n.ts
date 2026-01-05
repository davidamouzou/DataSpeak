export type Language = 'fr' | 'en' | 'es' | 'de';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  fr: { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  en: { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  de: { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
};

export interface TranslationKeys {
  // Common
  common: {
    appName: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    search: string;
    filters: string;
    export: string;
    import: string;
    refresh: string;
    settings: string;
  };

  // Header
  header: {
    newConversation: string;
    dataSource: string;
    export: string;
    settings: string;
    userMenu: string;
  };

  // Sidebar
  sidebar: {
    dataSources: string;
    addSource: string;
    conversations: string;
    today: string;
    yesterday: string;
    lastWeek: string;
    older: string;
    noConversations: string;
    collapse: string;
    expand: string;
  };

  // Empty State
  emptyState: {
    welcome: string;
    subtitle: string;
    connectSource: string;
    connectSourceDesc: string;
    addSource: string;
    viewSchema: string;
    viewSchemaDesc: string;
    smartSuggestions: string;
    suggestionsDesc: string;
    examplesTitle: string;
    tryExamples: string;
  };

  // Chat
  chat: {
    inputPlaceholder: string;
    sendButton: string;
    attachFile: string;
    voiceInput: string;
    thinking: string;
    processingQuery: string;
    enterToSend: string;
    shiftEnterNewLine: string;
  };

  // Suggestions
  suggestions: {
    title: string;
    subtitle: string;
    basedOnSchema: string;
    followUpQuestions: string;
    regenerate: string;
    noSuggestions: string;
    connectDbForSuggestions: string;
    categoriesLegend: string;
    complexity: {
      simple: string;
      medium: string;
      advanced: string;
    };
    categories: {
      overview: string;
      analysis: string;
      comparison: string;
      trends: string;
      top: string;
      aggregation: string;
    };
  };

  // Question Templates (for generation)
  questionTemplates: {
    howMany: string; // "How many {table} are registered?"
    totalOf: string; // "What is the total of {column}?"
    averageOf: string; // "What is the average of {column}?"
    evolutionBy: string; // "Show me the evolution by month"
    topN: string; // "Top 10 {table} with highest {column}"
    recentN: string; // "What are the 10 most recent {table}?"
    distributionBy: string; // "Distribution of {table} by {column}"
    countPer: string; // "How many {table2} per {table1}?"
    showDetail: string; // "Show me the details"
    compareWith: string; // "Compare with previous month"
    andBottom: string; // "And the bottom 10?"
    sameByYear: string; // "Same thing by year"
    calculateGrowth: string; // "Calculate growth rate"
    exportCsv: string; // "Export this data to CSV"
    visualize: string; // "Visualize this data"
  };

  // Data Source Modal
  dataSource: {
    modalTitle: string;
    addNewSource: string;
    selectType: string;
    sourceTypes: {
      postgresql: string;
      mysql: string;
      mongodb: string;
      csv: string;
      excel: string;
    };
    connectionFields: {
      host: string;
      port: string;
      database: string;
      username: string;
      password: string;
      ssl: string;
    };
    testConnection: string;
    testing: string;
    connectionSuccess: string;
    connectionFailed: string;
    saveConnection: string;
  };

  // Schema Viewer
  schema: {
    title: string;
    tables: string;
    relationships: string;
    table: string;
    rows: string;
    primaryKey: string;
    foreignKey: string;
    nullable: string;
    type: string;
    relationshipType: string;
  };

  // Messages
  messages: {
    userMessage: string;
    assistantMessage: string;
    errorMessage: string;
    systemMessage: string;
  };

  // Example Questions
  examples: {
    salesAnalysis: {
      title: string;
      question: string;
    };
    customerManagement: {
      title: string;
      question: string;
    };
    trends: {
      title: string;
      question: string;
    };
    performance: {
      title: string;
      question: string;
    };
  };

  // Theme
  theme: {
    title: string;
    light: string;
    dark: string;
    system: string;
  };
}
