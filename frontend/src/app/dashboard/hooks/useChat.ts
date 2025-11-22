"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, FileAttachment, SourceReference } from "@/app/dashboard/types";
import { ChatService } from '@/app/dashboard/chatService';
import { MESSAGES } from '@/app/dashboard/constants';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedSources, setSelectedSources] = useState<SourceReference[] | null>(null);
  const [isSourcePanelOpen, setIsSourcePanelOpen] = useState(false);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const sendMessage = useCallback(async (content: string, attachments?: FileAttachment[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    // Add user message
    const userMessage = ChatService.createMessage(content, "user", attachments);
    addMessage(userMessage);

    // Clear input and files
    setInputMessage("");
    setSelectedFiles([]);
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await ChatService.generateResponse(content, attachments);
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
      const errorMessage = ChatService.createMessage(
        "Sorry, there was an error processing your message. Please try again.",
        "assistant"
      );
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [addMessage]);

  const addFiles = useCallback((newFiles: FileAttachment[]) => {
    setSelectedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setInputMessage("");
    setSelectedFiles([]);
    setSelectedSources(null);
    setIsSourcePanelOpen(false);
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
    selectedFiles,
    inputMessage,
    selectedSources,
    isSourcePanelOpen,
    setInputMessage,
    sendMessage,
    addFiles,
    removeFile,
    clearFiles,
    resetChat,
    openSourcePanel,
    closeSourcePanel,
  };
}