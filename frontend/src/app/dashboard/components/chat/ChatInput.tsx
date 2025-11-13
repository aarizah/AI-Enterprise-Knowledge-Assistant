"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileUploadComponent } from "./components/file_upload/FileUploadComponent";
import { FileAttachment } from "@/app/dashboard/types";
import { ChatService } from "@/app/dashboard/chatService";
import { MESSAGES } from "@/app/dashboard/constants";
import { Send, Paperclip, FileSearch, X } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  selectedFiles: FileAttachment[];
  onSendMessage: (content: string, attachments?: FileAttachment[]) => void;
  onFilesSelected: (files: FileAttachment[]) => void;
  onFileRemoved: (fileId: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  selectedFiles,
  onSendMessage,
  onFilesSelected,
  onFileRemoved,
  disabled = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    onSendMessage(inputMessage, selectedFiles);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = inputMessage.trim() || selectedFiles.length > 0;

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* File attachments preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <FileSearch className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">{file.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {ChatService.formatFileSize(file.size)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemoved(file.id)}
                    className="h-auto p-1 hover:bg-red-100"
                  >
                    <X className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>
            <Separator className="mt-3" />
          </div>
        )}
        
        {/* Input area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              placeholder={MESSAGES.FILE_UPLOAD_PLACEHOLDER}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="min-h-[60px] max-h-[200px] resize-none pr-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    disabled={disabled}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Subir Documentos</DialogTitle>
                  </DialogHeader>
                  <FileUploadComponent
                    selectedFiles={selectedFiles}
                    onFilesSelected={onFilesSelected}
                    onFileRemoved={onFileRemoved}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!canSend || disabled}
            className="self-end bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          {MESSAGES.KEYBOARD_SHORTCUTS} • {selectedFiles.length} archivos adjuntos
        </p>
      </div>
    </div>
  );
}