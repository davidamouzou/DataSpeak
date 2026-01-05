import { X, Database, FileText, Leaf, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SourceType = 'postgresql' | 'mongodb' | 'csv' | 'mysql';

interface DataSourceConfig {
  type: SourceType;
  name: string;
  icon: any;
  color: string;
  description: string;
}

const dataSources: DataSourceConfig[] = [
  {
    type: 'postgresql',
    name: 'PostgreSQL',
    icon: Database,
    color: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
    description: 'Base de données relationnelle PostgreSQL',
  },
  {
    type: 'mysql',
    name: 'MySQL',
    icon: Database,
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    description: 'Base de données relationnelle MySQL',
  },
  {
    type: 'mongodb',
    name: 'MongoDB',
    icon: Leaf,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Base de données NoSQL MongoDB',
  },
  {
    type: 'csv',
    name: 'Fichiers CSV/Excel',
    icon: FileText,
    color: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
    description: 'Importer des fichiers CSV ou Excel',
  },
];

export function DataSourceModal({ isOpen, onClose }: DataSourceModalProps) {
  const [selectedType, setSelectedType] = useState<SourceType | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [formData, setFormData] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleConnect = async () => {
    setConnecting(true);
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConnected(true);
    setConnecting(false);
    
    // Auto close after success
    setTimeout(() => {
      onClose();
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setSelectedType(null);
    setConnected(false);
    setFormData({
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-card rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
          <h2 className="text-foreground text-base sm:text-lg">Ajouter une source de données</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!selectedType ? (
            /* Source Type Selection */
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm sm:text-base">Choisissez le type de source de données à connecter :</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {dataSources.map((source) => {
                  const Icon = source.icon;
                  return (
                    <button
                      key={source.type}
                      onClick={() => setSelectedType(source.type)}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all text-left group"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${source.color} border rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-foreground mb-1 text-sm sm:text-base truncate group-hover:text-primary transition-colors">{source.name}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{source.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : selectedType === 'csv' ? (
            /* CSV Upload */
            <div className="space-y-4">
              <button
                onClick={() => setSelectedType(null)}
                className="text-primary hover:underline mb-4 text-sm sm:text-base"
              >
                ← Retour
              </button>
              
              <div className="border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center hover:border-primary transition-colors cursor-pointer bg-accent/30">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-foreground mb-2 text-sm sm:text-base">Glissez vos fichiers ici</h3>
                <p className="text-muted-foreground mb-4 text-xs sm:text-sm">ou cliquez pour parcourir</p>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base shadow-sm">
                  Choisir des fichiers
                </button>
                <p className="text-muted-foreground mt-4 text-xs sm:text-sm">Formats acceptés : CSV, XLSX, XLS</p>
              </div>
            </div>
          ) : (
            /* Database Connection Form */
            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={() => setSelectedType(null)}
                className="text-primary hover:underline text-sm sm:text-base"
              >
                ← Retour
              </button>

              {connected ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-scaleIn border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-emerald-700 dark:text-emerald-300 text-sm sm:text-base">Connexion réussie !</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm text-center px-4">Votre source de données a été connectée avec succès.</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-foreground mb-2 text-sm sm:text-base">Hôte</label>
                    <input
                      type="text"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      placeholder="localhost ou IP"
                      className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-foreground mb-2 text-sm sm:text-base">Port</label>
                      <input
                        type="text"
                        value={formData.port}
                        onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                        placeholder={selectedType === 'postgresql' ? '5432' : '27017'}
                        className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-foreground mb-2 text-sm sm:text-base">Base de données</label>
                      <input
                        type="text"
                        value={formData.database}
                        onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                        placeholder="nom_base"
                        className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-foreground mb-2 text-sm sm:text-base">Nom d'utilisateur</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="utilisateur"
                      className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-2 text-sm sm:text-base">Mot de passe</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 sm:px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleConnect}
                      disabled={connecting}
                      className={`
                        flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg transition-all text-sm sm:text-base shadow-sm
                        ${connecting 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-primary/90 hover:shadow'
                        }
                      `}
                    >
                      {connecting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Connexion en cours...
                        </span>
                      ) : (
                        'Tester la connexion'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}