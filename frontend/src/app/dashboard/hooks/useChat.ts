"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, FileAttachment } from "@/app/dashboard/types";
import { ChatService } from '@/app/dashboard/chatService';
import { MESSAGES } from '@/app/dashboard/constants';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    ChatService.createMessage(MESSAGES.INITIAL_ASSISTANT_MESSAGE, "assistant")
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [inputMessage, setInputMessage] = useState("");

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

  return {
    messages,
    isTyping,
    selectedFiles,
    inputMessage,
    setInputMessage,
    sendMessage,
    addFiles,
    removeFile,
    clearFiles,
  };
}