import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface SqlViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sql: string;
  executionTime?: number;
  rowCount?: number;
}

export function SqlViewerModal({ isOpen, onClose, sql, executionTime = 0.245, rowCount = 4 }: SqlViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn border border-border">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-foreground text-base sm:text-lg mb-1">Requête SQL générée</h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Exécutée en {executionTime}s • {rowCount} résultats
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* SQL Code */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-xs sm:text-sm z-10 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Copier</span>
                </>
              )}
            </button>

            <pre className="bg-secondary/50 text-foreground p-3 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm border border-border">
              <code className="font-mono">{sql}</code>
            </pre>
          </div>

          {/* Execution Details */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-chart-1/10 rounded-lg p-3 sm:p-4 border border-chart-1/20">
              <p className="text-chart-1 mb-1 text-xs sm:text-sm">Temps d'exécution</p>
              <p className="text-foreground text-sm sm:text-base">{executionTime}s</p>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3 sm:p-4 border border-emerald-500/20">
              <p className="text-emerald-600 dark:text-emerald-400 mb-1 text-xs sm:text-sm">Résultats</p>
              <p className="text-foreground text-sm sm:text-base">{rowCount} lignes</p>
            </div>
            <div className="bg-chart-3/10 rounded-lg p-3 sm:p-4 border border-chart-3/20">
              <p className="text-chart-3 mb-1 text-xs sm:text-sm">Type</p>
              <p className="text-foreground text-sm sm:text-base">SELECT</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-border bg-accent/50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm sm:text-base"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}