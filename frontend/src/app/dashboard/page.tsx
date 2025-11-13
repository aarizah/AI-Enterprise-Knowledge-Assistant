"use client";

import { useChat } from "@/app/dashboard/hooks/useChat";
import { DashboardSidebar } from "@/app/dashboard/components/DashboardSidebar";
import { ChatArea, ChatHeader, ChatInput } from "@/app/dashboard/components/chat";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
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
    setInputMessage,
    sendMessage,
    addFiles,
    removeFile,
  } = useChat();

  const handleSendMessage = (content: string, attachments?: typeof selectedFiles) => {
    sendMessage(content, attachments);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <DashboardSidebar />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header with Upload Options */}
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
      </div>
    </div>
  );
}