import { Code2, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LoadingMessage } from './LoadingMessage';
import { SqlViewerModal } from './SqlViewerModal';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasData?: boolean;
  data?: any;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const [sqlModalOpen, setSqlModalOpen] = useState(false);
  const [selectedSql, setSelectedSql] = useState('');
  
  const chartData = [
    { name: 'Client A', commandes: 45 },
    { name: 'Client B', commandes: 38 },
    { name: 'Client C', commandes: 32 },
    { name: 'Client D', commandes: 28 },
    { name: 'Client E', commandes: 25 },
  ];

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
        >
          {message.type === 'user' ? (
            /* User Message */
            <div className="max-w-[85%] sm:max-w-3xl bg-primary text-primary-foreground rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-md">
              <p className="text-sm sm:text-base break-words">{message.content}</p>
              <span className="text-xs sm:text-sm opacity-75 mt-1 block">{message.timestamp}</span>
            </div>
          ) : (
            /* Assistant Message */
            <div className="max-w-[95%] sm:max-w-3xl bg-card rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-md border border-border w-full">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className="text-lg sm:text-xl">🤖</span>
                <span className="text-muted-foreground text-sm sm:text-base">Assistant</span>
                <span className="text-xs sm:text-sm text-muted-foreground ml-auto">{message.timestamp}</span>
              </div>

              <p className="text-foreground mb-3 sm:mb-4 text-sm sm:text-base break-words">{message.content}</p>

              {message.hasData && message.data?.type === 'table' && (
                <div className="bg-accent/50 rounded-lg p-2 sm:p-4 border border-border overflow-x-auto">
                  <div className="min-w-[280px]">
                    <table className="w-full text-sm sm:text-base">
                      <thead>
                        <tr className="border-b border-border">
                          {message.data.columns.map((col: string, index: number) => (
                            <th key={index} className="text-left py-2 sm:py-3 px-2 sm:px-4 text-foreground whitespace-nowrap">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {message.data.rows.map((row: string[], rowIndex: number) => (
                          <tr key={rowIndex} className="border-b border-border hover:bg-accent transition-colors">
                            {row.map((cell: string, cellIndex: number) => (
                              <td key={cellIndex} className="py-2 sm:py-3 px-2 sm:px-4 text-foreground whitespace-nowrap">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button 
                      onClick={() => {
                        setSelectedSql('SELECT region, SUM(ventes) as total_ventes, \n  ROUND(((SUM(ventes) - LAG(SUM(ventes)) OVER (ORDER BY annee)) / \n  LAG(SUM(ventes)) OVER (ORDER BY annee) * 100), 2) as croissance\nFROM ventes\nWHERE annee = 2024\nGROUP BY region\nORDER BY total_ventes DESC;');
                        setSqlModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-sm shadow-sm"
                    >
                      <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">Voir le SQL</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-sm shadow-sm">
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">Exporter</span>
                    </button>
                  </div>
                </div>
              )}

              {message.hasData && message.data?.type === 'chart' && (
                <div className="bg-accent/50 rounded-lg p-2 sm:p-4 border border-border">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="oklch(0.552 0.016 285.938)" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="oklch(0.552 0.016 285.938)"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'oklch(1 0 0)', 
                          border: '1px solid oklch(0.92 0.004 286.32)', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          fontSize: '14px'
                        }} 
                      />
                      <Bar dataKey="commandes" fill="oklch(0.488 0.243 264.376)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button 
                      onClick={() => {
                        setSelectedSql('SELECT client_id, nom, COUNT(*) as nombre_commandes\nFROM commandes\nJOIN clients ON commandes.client_id = clients.id\nGROUP BY client_id, nom\nORDER BY nombre_commandes DESC\nLIMIT 10;');
                        setSqlModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-sm shadow-sm"
                    >
                      <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">Voir le SQL</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition-colors text-sm shadow-sm">
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="whitespace-nowrap">Exporter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {isLoading && <LoadingMessage />}
      
      <SqlViewerModal 
        isOpen={sqlModalOpen}
        onClose={() => setSqlModalOpen(false)}
        sql={selectedSql}
      />
    </div>
  );
}