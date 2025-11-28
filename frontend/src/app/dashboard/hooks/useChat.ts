"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, SourceReference } from "@/app/dashboard/types";
import { ChatService } from '@/app/dashboard/chatService';
import { MESSAGES } from '@/app/dashboard/constants';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedSources, setSelectedSources] = useState<SourceReference[] | null>(null);
  const [isSourcePanelOpen, setIsSourcePanelOpen] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      
      // Guardar en localStorage y disparar evento
      localStorage.setItem("chat_history", JSON.stringify(newMessages));
      window.dispatchEvent(new Event("chat_updated"));
      
      return newMessages;
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = ChatService.createMessage(content, "user");
    addMessage(userMessage);

    // Clear input
    setInputMessage("");
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await ChatService.generateResponse(content);
      const assistantMessage = ChatService.createMessage(aiResponse, "assistant");
      
      // Attach sources if available
      const sources = ChatService.getLastSources();
      if (sources) {
        assistantMessage.sources = sources;
      }
      
      // Attach confidence if available
      const confidence = ChatService.getLastConfidence();
      if (confidence !== undefined) {
        assistantMessage.confidence = confidence;
      }
      
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorText = error instanceof Error ? error.message : "Unknown error occurred";
      const errorMessage = ChatService.createMessage(
        `Sorry, there was an error: ${errorText}`,
        "assistant"
      );
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [addMessage]);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInputMessage("");
    setSelectedSources(null);
    setIsSourcePanelOpen(false);
    
    // Limpiar localStorage y disparar evento para actualizar sidebar
    localStorage.removeItem("chat_history");
    window.dispatchEvent(new Event("chat_updated"));
  }, []);

  const openSourcePanel = useCallback((sources: SourceReference[]) => {
    setSelectedSources(sources);
    setIsSourcePanelOpen(true);
  }, []);

  const closeSourcePanel = useCallback(() => {
    setIsSourcePanelOpen(false);
  }, []);

  return {
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
  };
}