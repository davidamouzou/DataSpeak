import { Database, FileText, Leaf, Plus, Settings, BarChart3, FileDown, X, ChevronLeft, ChevronRight, Pin, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DataSourceModal } from './DataSourceModal';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

interface DataSource {
  id: string;
  name: string;
  type: 'postgresql' | 'csv' | 'mongodb';
  icon: any;
  count?: number;
}

interface Conversation {
  id: string;
  title: string;
  time: string;
  isPinned?: boolean;
}

const dataSources: DataSource[] = [
  { id: '1', name: 'PostgreSQL Production', type: 'postgresql', icon: Database },
  { id: '2', name: 'Fichiers CSV', type: 'csv', icon: FileText, count: 3 },
  { id: '3', name: 'MongoDB Analytics', type: 'mongodb', icon: Leaf },
];

const conversations = {
  today: [
    { id: 'c1', title: 'Ventes par région en 2024', time: '14:32', isPinned: true },
    { id: 'c2', title: 'Top 10 clients actifs', time: '11:05' },
  ],
  yesterday: [
    { id: 'c3', title: 'Analyse des stocks', time: '16:20' },
  ],
};

export function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onClose, activeConversationId, onSelectConversation }: SidebarProps) {
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64 lg:w-70';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full bg-sidebar border-r border-sidebar-border
          transition-all duration-300 ease-in-out z-40 flex flex-col shadow-xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarWidth}
        `}
        style={{ height: 'calc(100vh - 56px)' }}
      >
        {/* Header with Close/Collapse */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-sidebar-border shrink-0">
          {!isCollapsed && (
            <h2 className="text-sidebar-foreground truncate text-sm sm:text-base">Navigation</h2>
          )}
          <div className="flex items-center gap-1">
            <button 
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-sidebar-foreground" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
              )}
            </button>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-sidebar-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Data Sources Section */}
          <div className="p-3 sm:p-4 border-b border-sidebar-border">
            {!isCollapsed && (
              <h3 className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">Sources de données</h3>
            )}
            <div className="space-y-1 sm:space-y-2">
              {dataSources.map((source) => {
                const Icon = source.icon;
                return (
                  <button
                    key={source.id}
                    className={`
                      w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg hover:bg-sidebar-accent transition-colors
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                    title={isCollapsed ? source.name : undefined}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-sidebar-primary shrink-0" />
                    {!isCollapsed && (
                      <>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sidebar-foreground truncate text-xs sm:text-sm">{source.name}</p>
                        </div>
                        {source.count && (
                          <span className="text-xs text-muted-foreground bg-sidebar-accent px-1.5 sm:px-2 py-0.5 rounded">
                            {source.count}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setIsDataSourceModalOpen(true)}
                className={`${isCollapsed? 'w-full justify-center md:w-fit p-1 sm:p-1.5' : 'w-full p-2 sm:p-2.5'}`  + " flex items-center gap-2 text-sidebar-primary hover:bg-sidebar-primary/10 rounded-lg transition-colors text-xs sm:text-sm border border-dashed border-sidebar-border hover:border-sidebar-primary"}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {!isCollapsed && <span>Ajouter une source</span>}
              </button>
            </div>
          </div>

          {/* Conversations Section */}
          <div className="p-3 sm:p-4">
            {!isCollapsed && (
              <h3 className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wide">Conversations</h3>
            )}
            
            <div className="space-y-4">
              {/* Today */}
              <div>
                {!isCollapsed && (
                  <p className="text-muted-foreground mb-1 sm:mb-2 text-xs">Aujourd'hui</p>
                )}
                <div className="space-y-1">
                  {conversations.today.map((conv) => (
                    <div
                      key={conv.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredConversation(conv.id)}
                      onMouseLeave={() => setHoveredConversation(null)}
                    >
                      <button
                        onClick={() => {
                          onSelectConversation(conv.id);
                          // Close sidebar on mobile after selection
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        className={`
                          w-full flex items-center gap-2 p-2 sm:p-2.5 rounded-lg transition-all text-left
                          ${activeConversationId === conv.id 
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                            : 'hover:bg-sidebar-accent text-sidebar-foreground'
                          }
                          ${isCollapsed ? 'justify-center' : ''}
                        `}
                        title={isCollapsed ? conv.title : undefined}
                      >
                        {conv.isPinned && <Pin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />}
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 truncate text-xs sm:text-sm">{conv.title}</span>
                            <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                          </>
                        )}
                      </button>
                      
                      {!isCollapsed && hoveredConversation === conv.id && (
                        <button
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-card hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Yesterday */}
              <div>
                {!isCollapsed && (
                  <p className="text-muted-foreground mb-1 sm:mb-2 text-xs">Hier</p>
                )}
                <div className="space-y-1">
                  {conversations.yesterday.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        // Close sidebar on mobile after selection
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`
                        w-full flex items-center gap-2 p-2 sm:p-2.5 rounded-lg transition-all text-left
                        ${activeConversationId === conv.id 
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' 
                          : 'hover:bg-sidebar-accent text-sidebar-foreground'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? conv.title : undefined}
                    >
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate text-xs sm:text-sm">{conv.title}</span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`border-t border-sidebar-border p-3 sm:p-4 flex-shrink-0 bg-sidebar-accent/50 ${isCollapsed ? 'flex flex-col gap-2' : 'space-y-2'}`}>
          <button className={`
            flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 hover:bg-sidebar-accent rounded-lg transition-colors w-full text-sidebar-foreground
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs sm:text-sm">Rapports</span>}
          </button>
          <button className={`
            flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 hover:bg-sidebar-accent rounded-lg transition-colors w-full text-sidebar-foreground
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <FileDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs sm:text-sm">Exports</span>}
          </button>
          <button className={`
            flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 hover:bg-sidebar-accent rounded-lg transition-colors w-full text-sidebar-foreground
            ${isCollapsed ? 'justify-center' : ''}
          `}>
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-xs sm:text-sm">Paramètres</span>}
          </button>
        </div>
      </aside>
      
      <DataSourceModal isOpen={isDataSourceModalOpen} onClose={() => setIsDataSourceModalOpen(false)} />
    </>
  );
}