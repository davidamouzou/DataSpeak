import { useState, useEffect, useRef } from 'react';
import { Paperclip, Mic, Send, RefreshCw } from 'lucide-react';
import { MessageList } from './MessageList';
import { EmptyState } from './EmptyState';
import { QuestionSuggestions } from './QuestionSuggestions';
import { useQuestionSuggestions } from '@/hooks/useQuestionSuggestions';
import { mockEcommerceSchema } from '@/data/mockSchema';

interface ChatAreaProps {
  conversationId: string | null;
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
}

export function ChatArea({ conversationId, sidebarCollapsed, sidebarOpen }: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionMode, setSuggestionMode] = useState<'initial' | 'schema' | 'followup'>('schema');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hook pour les suggestions intelligentes
  const { 
    suggestions, 
    isLoading: suggestionsLoading,
    refresh: refreshSuggestions
  } = useQuestionSuggestions({
    schema: mockEcommerceSchema, // En production, cela viendra d'une vraie connexion DB
    lastQuery: messages.length > 0 ? messages[messages.length - 2]?.content : '',
    mode: messages.length === 0 ? 'schema' : suggestionMode
  });

  // Mock messages for demo
  useEffect(() => {
    if (conversationId === 'conv-1') {
      setMessages([
        {
          id: '1',
          type: 'user',
          content: 'Montre-moi les ventes par région en 2024',
          timestamp: '14:32',
        },
        {
          id: '2',
          type: 'assistant',
          content: 'Voici les résultats :',
          timestamp: '14:32',
          hasData: true,
          data: {
            type: 'table',
            columns: ['Région', 'Ventes (€)', 'Croissance'],
            rows: [
              ['Île-de-France', '2,450,000', '+12%'],
              ['Auvergne-Rhône-Alpes', '1,890,000', '+8%'],
              ['Nouvelle-Aquitaine', '1,234,000', '+15%'],
              ['Occitanie', '987,000', '+5%'],
            ],
          },
        },
      ]);
      setSuggestionMode('followup');
    } else if (conversationId === 'conv-2') {
      setMessages([
        {
          id: '3',
          type: 'user',
          content: 'Quels sont les 10 clients les plus actifs ?',
          timestamp: '11:05',
        },
        {
          id: '4',
          type: 'assistant',
          content: 'Voici le top 10 des clients actifs :',
          timestamp: '11:05',
          hasData: true,
          data: {
            type: 'chart',
            chartType: 'bar',
          },
        },
      ]);
      setSuggestionMode('followup');
    } else {
      setMessages([]);
      setSuggestionMode('schema');
    }
  }, [conversationId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInput('')
    setIsLoading(true);
    setSuggestionMode('followup');

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Je traite votre demande...',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  // Fonction pour sélectionner une suggestion
  const handleSelectSuggestion = (question: string) => {
    setInput(question);
    // Auto-focus sur le textarea
    textareaRef.current?.focus();
  };

  if (!conversationId && messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-background w-full min-w-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        {/* Suggestions intelligentes */}
        {messages.length <= 2 && (
          <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 border-b border-border max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {messages.length === 0 
                    ? `${suggestions.length} questions basées sur votre schéma` 
                    : 'Questions de suivi'}
                </span>
              </div>
              <button
                onClick={refreshSuggestions}
                className="p-1.5 hover:bg-accent rounded-lg transition-colors group"
                title="Régénérer les suggestions"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:rotate-180 transition-all duration-300" />
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-1 sm:gap-2 bg-card border border-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent transition-all">
              <button
                type="button"
                className="p-2 sm:p-3 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                aria-label="Joindre un fichier"
              >
                <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Posez votre question..."
                className="flex-1 px-1 sm:px-2 py-2 sm:py-3 resize-none outline-none max-h-30 text-sm sm:text-base min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />

              <button
                type="button"
                className="p-2 sm:p-3 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 hidden sm:block"
                aria-label="Saisie vocale"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className={`
                  p-2 sm:p-3 m-1 rounded-lg transition-all flex-shrink-0
                  ${input.trim() 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-sm' 
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }
                `}
                aria-label="Envoyer"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            {/* Hint text */}
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Appuyez sur <kbd className="px-1.5 py-0.5 bg-accent border border-border rounded text-[10px]">Entrée</kbd> pour envoyer, 
              <kbd className="px-1.5 py-0.5 bg-accent border border-border rounded text-[10px] ml-1">Maj+Entrée</kbd> pour une nouvelle ligne
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}