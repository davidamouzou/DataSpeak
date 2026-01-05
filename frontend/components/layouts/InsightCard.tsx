import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface InsightCardProps {
  type: 'positive' | 'negative' | 'warning' | 'info';
  title: string;
  description: string;
  metric?: string;
  trend?: number;
}

export function InsightCard({ type, title, description, metric, trend }: InsightCardProps) {
  const configs = {
    positive: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      textColor: 'text-green-700',
    },
    negative: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: TrendingDown,
      iconColor: 'text-red-600',
      textColor: 'text-red-700',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: AlertCircle,
      iconColor: 'text-orange-600',
      textColor: 'text-orange-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h4 className={`${config.textColor}`}>{title}</h4>
            {metric && (
              <span className="text-gray-900">{metric}</span>
            )}
          </div>
          
          <p className="text-gray-700">{description}</p>
          
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}% vs période précédente</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
