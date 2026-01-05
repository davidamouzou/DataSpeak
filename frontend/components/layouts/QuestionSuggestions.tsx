import {Sparkles, TrendingUp, BarChart3, Filter, Layers, LucideIcon} from 'lucide-react';
import { QuestionSuggestion, QuestionCategory } from '@/types/suggestions';

interface QuestionSuggestionsProps {
  suggestions: QuestionSuggestion[];
  onSelectQuestion: (question: string) => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

const categoryConfig: Record<QuestionCategory, { color: string; bgColor: string; icon: LucideIcon }> = {
  overview: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    icon: Layers
  },
  analysis: {
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    icon: BarChart3
  },
  comparison: {
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    icon: Filter
  },
  trends: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    icon: TrendingUp
  },
  top: {
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    icon: Sparkles
  },
  aggregation: {
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    icon: BarChart3
  }
};

const complexityBadge: Record<string, { label: string; color: string }> = {
  simple: { label: 'Simple', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  medium: { label: 'Intermédiaire', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
  advanced: { label: 'Avancé', color: 'bg-red-500/10 text-red-700 dark:text-red-400' }
};

export function QuestionSuggestions({
  suggestions,
  onSelectQuestion,
  isLoading = false,
  title = "Questions suggérées",
  subtitle = "Cliquez sur une question pour l'envoyer"
}: QuestionSuggestionsProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="text-foreground">Génération de suggestions...</h3>
        </div>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-accent/50 rounded-xl animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-accent/30 rounded-xl border border-border">
        <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">Aucune suggestion disponible</p>
        <p className="text-sm text-muted-foreground mt-1">
          Connectez une base de données pour voir des suggestions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-linear-to-br from-primary/20 to-chart-3/20 rounded-lg">
        <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Grid de suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          const config = categoryConfig[suggestion.category];
          const CategoryIcon = config.icon;
          const complexity = complexityBadge[suggestion.complexity];

          return (
            <button
              key={suggestion.id}
              onClick={() => onSelectQuestion(suggestion.text)}
              className={`
                group relative p-4 rounded-xl border transition-all duration-200 text-left
                hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                bg-card hover:bg-accent/50 border-border hover:border-primary/50
                animate-slideUp
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Badge de categorise */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 rounded-lg border ${config.bgColor} shrink-0`}>
                  {suggestion.icon ? (
                    <span className="text-lg">{suggestion.icon}</span>
                  ) : (
                     <CategoryIcon className={`w-4 h-4 ${config.color}`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {suggestion.text}
                  </p>
                </div>
              </div>

              {/* Footer: Tags et Complexity */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50">
                {/* Tags */}
                {suggestion.tags && suggestion.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {suggestion.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 bg-accent text-muted-foreground rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Complexity */}
                <span className={`text-xs px-2 py-0.5 rounded-md shrink-0 ${complexity.color}`}>
                  {complexity.label}
                </span>
              </div>

              {/* Hover effect overlay */}
              <div
                  className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/0 to-chart-3/0 group-hover:from-primary/5 group-hover:to-chart-3/5 pointer-events-none transition-all duration-300"/>
            </button>
          );
        })}
      </div>

      {/* Glenden des catégories */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">Catégories</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryConfig).map(([category, config]) => {
            const Icon = config.icon;
            const count = suggestions.filter(s => s.category === category).length;
            
            if (count === 0) return null;

            return (
              <div
                key={category}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${config.bgColor}`}
              >
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                <span className={`text-xs ${config.color}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className={`text-xs ${config.color} opacity-60`}>({count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
