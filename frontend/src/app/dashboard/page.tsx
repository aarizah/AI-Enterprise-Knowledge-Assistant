"use client";

import { useChat } from "@/app/dashboard/hooks/useChat";
import { DashboardSidebar } from "@/app/dashboard/components/DashboardSidebar";
import { ChatArea, ChatHeader, ChatInput } from "@/app/dashboard/components/chat";
import { SourcePanel } from "@/app/dashboard/components/chat/components/SourcePanel";
import { useEffect, useState } from "react";
import AnalyticsPanel from "@/app/dashboard/components/AnalyticsPanel";
import KnowledgeHubPanel from "@/app/dashboard/components/KnowledgeHub/KnowledgeHubPanel";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { settings } from "@/lib/settings";

export default function Dashboard() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showKnowledgeHub, setShowKnowledgeHub] = useState(false);
  const [documentCount, setDocumentCount] = useState(247);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${settings.backendUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          router.replace("/auth");
        }
      })
      .catch(() => {
        router.replace("/auth");
      });
  }, [router]);

  const {
    messages,
    isTyping,
    inputMessage,
    selectedSources,
    isSourcePanelOpen,
    setInputMessage,
    sendMessage,
    resetChat,
    openSourcePanel,
    closeSourcePanel,
  } = useChat();

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 overflow-hidden">
        {/* Column 1: Sidebar Navigation - Fixed width */}
      {!showAnalytics && !showKnowledgeHub && (
        <DashboardSidebar
          onNewConversation={resetChat}
          onAnalyticsClick={() => setShowAnalytics(true)}
          onKnowledgeHubClick={() => setShowKnowledgeHub(true)}
        />
      )}

      {/* Main Content: Either Analytics or Chat UI */}
      <div className="flex-1 flex flex-col min-w-0">
        {showAnalytics ? (
          <AnalyticsPanel onBack={() => setShowAnalytics(false)} />
        ) : showKnowledgeHub ? (
          <KnowledgeHubPanel onBack={() => setShowKnowledgeHub(false)} />
        ) : (
          <>
            {/* Chat Header */}
            <ChatHeader
              documentsReady={documentCount}
              onDocumentCountChange={setDocumentCount}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
              <ChatArea
                messages={messages}
                isTyping={isTyping}
                onSuggestionSelect={(question) => {
                  setInputMessage(question);
                  sendMessage(question);
                }}
                onOpenSources={openSourcePanel}
              />
            </div>

            {/* Input Area */}
            <ChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              onSendMessage={handleSendMessage}
              disabled={isTyping}
            />
          </>
        )}
      </div>

      {/* Column 3: Source Panel - Conditional, fixed width 350px, hidden on mobile */}
      {!showAnalytics && !showKnowledgeHub && isSourcePanelOpen && selectedSources && (
        <div className="hidden lg:block">
          <SourcePanel
            references={selectedSources}
            onClose={closeSourcePanel}
          />
        </div>
      )}
      </div>
    </>
  );
}