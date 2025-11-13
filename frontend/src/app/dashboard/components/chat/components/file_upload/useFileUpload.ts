"use client";

import { useState, useCallback } from 'react';
import { FileAttachment } from "@/app/dashboard/types";
import { ChatService } from '@/app/dashboard/chatService';
import { CHAT_CONSTANTS } from '@/app/dashboard/constants';

export function useFileUpload(maxFiles: number = CHAT_CONSTANTS.MAX_FILES) {
  const [selectedFiles, setSelectedFiles] = useState<FileAttachment[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles: FileAttachment[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      // Check file count limit
      if (selectedFiles.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed.`);
        break;
      }

      // Validate file
      const validation = ChatService.validateFile(file);
      if (!validation.isValid) {
        errors.push(validation.error!);
        continue;
      }

      // Add valid file
      validFiles.push(ChatService.createFileAttachment(file));
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      // Clear errors after 5 seconds
      setTimeout(() => setUploadErrors([]), 5000);
    }

    return { validFiles, errors };
  }, [selectedFiles.length, maxFiles]);

  const removeFile = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setSelectedFiles([]);
    setUploadErrors([]);
  }, []);

  const clearErrors = useCallback(() => {
    setUploadErrors([]);
  }, []);

  return {
    selectedFiles,
    uploadErrors,
    processFiles,
    removeFile,
    clearFiles,
    clearErrors,
    formatFileSize: ChatService.formatFileSize,
  };
}