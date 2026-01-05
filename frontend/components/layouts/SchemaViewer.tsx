import { Database, Table, Key, Link2, X } from 'lucide-react';
import { DatabaseSchema, TableSchema } from '@/types/suggestions';

interface SchemaViewerProps {
  schema: DatabaseSchema;
  onClose: () => void;
}

export function SchemaViewer({ schema, onClose }: SchemaViewerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b border-border bg-linear-to-r from-primary/10 to-chart-3/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/20 rounded-lg">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl text-foreground">Schéma de la base de données</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {schema.tables.length} table{schema.tables.length > 1 ? 's' : ''} • 
                  {schema.relationships?.length || 0} relation{(schema.relationships?.length || 0) > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
          {/* Tables Grid */}
          <div className="space-y-4">
            {schema.tables.map((table) => (
              <TableCard key={table.name} table={table} />
            ))}
          </div>

          {/* Relationships */}
          {schema.relationships && schema.relationships.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 text-primary" />
                <h3 className="text-foreground">Relations entre tables</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {schema.relationships.map((rel, index) => (
                  <div
                    key={index}
                    className="p-4 bg-accent/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {rel.from}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="px-2 py-1 bg-chart-3/10 text-chart-3 rounded">
                        {rel.to}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Type: {rel.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TableCard({ table }: { table: TableSchema }) {
  const primaryKeys = table.columns.filter(col => col.isPrimaryKey);
  const foreignKeys = table.columns.filter(col => col.isForeignKey);

  return (
    <div className="bg-accent/30 border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Table Header */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-chart-3/5 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-primary" />
            <h4 className="text-foreground">{table.name}</h4>
          </div>
          {table.rowCount && (
            <span className="text-xs px-2 py-1 bg-accent text-muted-foreground rounded">
              {table.rowCount.toLocaleString()} lignes
            </span>
          )}
        </div>
        
        {/* Keys info */}
        {(primaryKeys.length > 0 || foreignKeys.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {primaryKeys.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded">
                <Key className="w-3 h-3" />
                <span>{primaryKeys.length} clé{primaryKeys.length > 1 ? 's' : ''} primaire{primaryKeys.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {foreignKeys.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded">
                <Link2 className="w-3 h-3" />
                <span>{foreignKeys.length} clé{foreignKeys.length > 1 ? 's' : ''} étrangère{foreignKeys.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Columns */}
      <div className="p-4">
        <div className="space-y-2">
          {table.columns.map((column) => (
            <div
              key={column.name}
              className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {column.isPrimaryKey && (
                  <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {column.isForeignKey && !column.isPrimaryKey && (
                  <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                )}
                <span className="text-sm text-foreground truncate">{column.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 bg-accent text-muted-foreground rounded">
                  {column.type}
                </span>
                {column.isNullable && (
                  <span className="text-xs text-muted-foreground">nullable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
