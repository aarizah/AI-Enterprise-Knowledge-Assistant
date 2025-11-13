"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/app/dashboard/components/chat/components/ChatMessage";
import { TypingIndicator } from "@/app/dashboard/components/chat/components/TypingIndicator";
import { Message } from "@/app/dashboard/types";

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

export function ChatArea({ messages, isTyping }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}