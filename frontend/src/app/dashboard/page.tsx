"use client";

import { useChat } from "@/app/dashboard/hooks/useChat";
import { DashboardSidebar } from "@/app/dashboard/components/DashboardSidebar";
import { ChatArea, ChatHeader, ChatInput } from "@/app/dashboard/components/chat";
import { SourcePanel } from "@/app/dashboard/components/chat/components/SourcePanel";
import { useEffect, useState } from "react";
import AnalyticsPanel from "@/app/dashboard/components/AnalyticsPanel";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const [showAnalytics, setShowAnalytics] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/auth/me", {
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
    selectedFiles,
    inputMessage,
    selectedSources,
    isSourcePanelOpen,
    setInputMessage,
    sendMessage,
    addFiles,
    removeFile,
    resetChat,
    openSourcePanel,
    closeSourcePanel,
  } = useChat();

  const handleSendMessage = (content: string, attachments?: typeof selectedFiles) => {
    sendMessage(content, attachments);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 overflow-hidden">
      {/* Column 1: Sidebar Navigation - Fixed width */}
      {!showAnalytics && (
        <DashboardSidebar
          onNewConversation={resetChat}
          onAnalyticsClick={() => setShowAnalytics(true)}
        />
      )}

      {/* Main Content: Either Analytics or Chat UI */}
      <div className="flex-1 flex flex-col min-w-0">
        {showAnalytics ? (
          <AnalyticsPanel onBack={() => setShowAnalytics(false)} />
        ) : (
          <>
            {/* Chat Header */}
            <ChatHeader
              selectedFiles={selectedFiles}
              onFilesSelected={addFiles}
              onFileRemoved={removeFile}
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
              selectedFiles={selectedFiles}
              onSendMessage={handleSendMessage}
              onFilesSelected={addFiles}
              onFileRemoved={removeFile}
              disabled={isTyping}
            />
          </>
        )}
      </div>

      {/* Column 3: Source Panel - Conditional, fixed width 350px, hidden on mobile */}
      {!showAnalytics && isSourcePanelOpen && selectedSources && (
        <div className="hidden lg:block">
          <SourcePanel
            references={selectedSources}
            onClose={closeSourcePanel}
          />
        </div>
      )}
    </div>
  );
}