'use client'
import LoginPage from "@/app/auth/page";
import {useState} from "react";
import {useUser} from "@/contexts/UserContext";
import {Header} from "@/components/layouts/Header";
import {Sidebar} from "@/components/layouts/Sidebar";
import {ChatArea} from "@/components/layouts/ChatArea";

export default function AppContent() {
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

            <div className="flex flex-1 overflow-hidden pt-14 sm:pt-16">
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