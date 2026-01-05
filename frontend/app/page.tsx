"use client"
import { useState } from 'react';
import { Header } from '@/components/layouts/Header';
import { Sidebar } from '@/components/layouts/Sidebar';
import { ChatArea } from '@/components/layouts/ChatArea';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { LoginPage } from '@/app/auth/page';

function AppContent() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');
    const { isAuthenticated } = useUser();

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            <Header
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
            />

            <div className="flex flex-1 overflow-hidden pt-16">
                <Sidebar
                    isOpen={sidebarOpen}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onClose={() => setSidebarOpen(false)}
                    activeConversationId={activeConversationId}
                    onSelectConversation={setActiveConversationId}
                />

                <ChatArea
                    conversationId={activeConversationId}
                    sidebarCollapsed={sidebarCollapsed}
                    sidebarOpen={sidebarOpen}
                />
            </div>
        </div>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <UserProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </UserProvider>
        </LanguageProvider>
    );
}