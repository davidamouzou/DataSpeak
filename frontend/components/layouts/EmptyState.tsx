import { Database, MessageSquare, Sparkles, Eye } from 'lucide-react';
import { useState } from 'react';
import { DataSourceModal } from './DataSourceModal';
import { QuestionSuggestions } from './QuestionSuggestions';
import { SchemaViewer } from './SchemaViewer';
import { useQuestionSuggestions } from '@/hooks/useQuestionSuggestions';
import { mockEcommerceSchema } from '@/data/mockSchema';

export function EmptyState() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  
  // Utiliser le hook de suggestions
  const { suggestions, isLoading } = useQuestionSuggestions({
    schema: mockEcommerceSchema,
    mode: 'schema'
  });
  
  const exampleQuestions = [
    {
      icon: '📊',
      title: 'Analyse des ventes',
      question: 'Quelles sont mes meilleures ventes ce mois-ci ?',
    },
    {
      icon: '👥',
      title: 'Gestion clients',
      question: 'Montre-moi les clients inactifs depuis 3 mois',
    },
    {
      icon: '📈',
      title: 'Tendances',
      question: 'Quelle est l\'évolution des revenus sur l\'année ?',
    },
    {
      icon: '💰',
      title: 'Performance',
      question: 'Quels sont les produits les plus rentables ?',
    },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary/5 via-background to-chart-3/5 overflow-y-auto">
      <div className="max-w-5xl w-full py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-chart-3 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg animate-scaleIn">
            <span className="text-3xl sm:text-4xl">💬</span>
          </div>
          
          <h1 className="text-foreground mb-2 sm:mb-3 px-4">Bienvenue sur DataSpeak</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto px-4 text-sm sm:text-base">
            Interrogez vos données en langage naturel et obtenez des insights instantanés.
            Commencez par connecter une source de données ou essayez une question exemple.
          </p>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mx-4 sm:mx-0">
          {/* Connect Database Card */}
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-border animate-slideUp">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-foreground mb-1">Connectez une source</h2>
                <p className="text-muted-foreground text-sm">
                  PostgreSQL, MySQL ou CSV
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow"
            >
              <Database className="w-4 h-4" />
              <span className="text-sm">Ajouter une source</span>
            </button>
          </div>

          {/* View Schema Card */}
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-border animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-chart-3" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-foreground mb-1">Voir le schéma démo</h2>
                <p className="text-muted-foreground text-sm">
                  Base e-commerce avec 5 tables
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setShowSchema(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-chart-3/10 text-chart-3 border border-chart-3/20 rounded-lg hover:bg-chart-3/20 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Voir le schéma</span>
            </button>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-8 mx-4 sm:mx-0">
          <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-border animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Suggestions intelligentes</h3>
            </div>
            
            <QuestionSuggestions
              suggestions={suggestions.slice(0, 6)}
              onSelectQuestion={(q) => console.log('Selected:', q)}
              isLoading={isLoading}
              title="Questions générées automatiquement"
              subtitle="Basées sur l'analyse du schéma de votre base de données"
            />
          </div>
        </div>

        {/* Example Questions - Simplified version */}
        <div className="px-4 sm:px-0">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <h3 className="text-foreground text-sm sm:text-base">Ou essayez ces exemples</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exampleQuestions.map((item, index) => (
              <button
                key={index}
                className="group flex items-start gap-3 p-3 sm:p-4 bg-card hover:bg-accent border border-border hover:border-primary/50 rounded-xl transition-all text-left shadow-sm hover:shadow animate-slideUp"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-foreground mb-1 text-sm sm:text-base group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground text-xs sm:text-sm break-words">
                    "{item.question}"
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <DataSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {showSchema && (
        <SchemaViewer schema={mockEcommerceSchema} onClose={() => setShowSchema(false)} />
      )}
    </div>
  );
}