import { useState, useEffect, useCallback } from 'react';
import { QuestionSuggestion, DatabaseSchema } from '../types/suggestions';
import { questionGenerator } from '../utils/questionGenerator';

interface UseQuestionSuggestionsOptions {
  schema?: DatabaseSchema | null;
  lastQuery?: string;
  lastResult?: any;
  mode?: 'initial' | 'schema' | 'followup';
}

export function useQuestionSuggestions({
  schema = null,
  lastQuery = '',
  lastResult = null,
  mode = 'initial'
}: UseQuestionSuggestionsOptions = {}) {
  const [suggestions, setSuggestions] = useState<QuestionSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Génère les suggestions selon le mode
  const generateSuggestions = useCallback(() => {
    setIsLoading(true);

    // Simuler un délai pour effet UX (peut être retiré en prod)
    setTimeout(() => {
      let newSuggestions: QuestionSuggestion[] = [];

      if (mode === 'followup' && lastQuery) {
        // Questions de suivi basées sur la dernière question
        newSuggestions = questionGenerator.getFollowUpQuestions(lastQuery, lastResult);
      } else if (mode === 'schema' && schema) {
        // Questions basées sur le schéma
        questionGenerator.setSchema(schema);
        newSuggestions = questionGenerator.getSchemaBasedQuestions();
      } else {
        // Questions génériques par défaut
        newSuggestions = questionGenerator.getGenericQuestions();
      }

      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 300);
  }, [schema, lastQuery, lastResult, mode]);

  // Régénère les suggestions quand les paramètres changent
  useEffect(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  // Fonction pour régénérer manuellement
  const refresh = useCallback(() => {
    generateSuggestions();
  }, [generateSuggestions]);

  // Fonction pour filtrer les suggestions
  const filterByCategory = useCallback((category: string) => {
    return suggestions.filter(s => s.category === category);
  }, [suggestions]);

  // Fonction pour filtrer par complexité
  const filterByComplexity = useCallback((complexity: string) => {
    return suggestions.filter(s => s.complexity === complexity);
  }, [suggestions]);

  return {
    suggestions,
    isLoading,
    refresh,
    filterByCategory,
    filterByComplexity,
    hasSuggestions: suggestions.length > 0
  };
}
