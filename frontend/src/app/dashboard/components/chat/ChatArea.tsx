"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/app/dashboard/components/chat/components/ChatMessage";
import { LoadingBar } from "@/app/dashboard/components/chat/components/LoadingBar";
import { Message, SourceReference } from "@/app/dashboard/types";
import { SUGGESTED_QUESTIONS } from "@/app/dashboard/constants";

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  documentCount?: number;
  onSuggestionSelect?: (question: string) => void;
  onOpenSources?: (sources: SourceReference[]) => void;
}

export function ChatArea({ messages, isTyping, documentCount = 0, onSuggestionSelect, onOpenSources }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Estado vacío: sin scroll, centrado
  if (messages.length === 0 && !isTyping) {
    return (
      <div className="flex-1 px-8 py-12 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6 mx-auto">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-3">Ask me anything</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-8 mx-auto">
            Start a conversation with your AI assistant. Ask questions, analyze documents, or get insights from your knowledge base.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onSuggestionSelect?.(q)}
                className="px-4 py-2 bg-muted/50 rounded-lg text-xs text-muted-foreground border border-border/50 hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Con mensajes: ScrollArea habilitado
  return (
    <ScrollArea className="flex-1 px-8 py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onOpenSources={onOpenSources}
          />
        ))}
        
        {isTyping && <LoadingBar text={`Searching ${documentCount} ${documentCount === 1 ? 'document' : 'documents'}...`} />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}