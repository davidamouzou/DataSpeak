import { AlertTriangle, RefreshCw, Eye } from 'lucide-react';

interface ErrorMessageProps {
  title: string;
  message: string;
  suggestions?: string[];
  onRetry?: () => void;
  onViewSchema?: () => void;
}

export function ErrorMessage({ title, message, suggestions, onRetry, onViewSchema }: ErrorMessageProps) {
  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="max-w-3xl bg-white rounded-xl px-4 py-3 shadow-sm mr-12 border-l-4 border-red-500">
        <div className="flex items-center gap-2 mb-3">
          <span>🤖</span>
          <span className="text-gray-500">Assistant</span>
        </div>

        <div className="space-y-4">
          {/* Error Header */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-red-700 mb-1">{title}</h4>
              <p className="text-gray-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                "{message}"
              </p>
            </div>
          </div>

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span>💡</span>
                <span className="text-blue-700">Suggestions :</span>
              </div>
              <ul className="space-y-1 ml-6">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-700 list-disc">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Réessayer</span>
              </button>
            )}
            {onViewSchema && (
              <button
                onClick={onViewSchema}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Voir le schéma</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
