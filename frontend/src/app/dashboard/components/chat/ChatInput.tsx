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
    <div className="px-6 py-4">
      <div className="max-w-3xl mx-auto">
        {/* File attachments preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1.5">
              {selectedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-lg px-2 py-1 hover:shadow-sm transition-all">
                  <FileSearch className="w-3 h-3 text-accent" />
                  <span className="text-xs font-medium text-accent-foreground">{file.name}</span>
                  <Badge variant="secondary" className="text-[10px] px-1 py-0">
                    {ChatService.formatFileSize(file.size)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemoved(file.id)}
                    className="h-auto p-0.5 hover:bg-destructive/10"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Input area */}
        <div className="relative bg-white rounded-2xl shadow-sm border border-border/50 px-4 py-2.5 flex items-center gap-2">
          <Textarea
            ref={textareaRef}
            placeholder={MESSAGES.FILE_UPLOAD_PLACEHOLDER}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="flex-1 min-h-[36px] max-h-[100px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0 text-sm leading-normal placeholder:text-muted-foreground/60"
            rows={1}
          />
          
          <Button 
            onClick={handleSendMessage}
            disabled={!canSend || disabled}
            size="sm"
            className="h-8 w-8 p-0 bg-gradient-to-r from-primary to-accent hover:shadow-md transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          {MESSAGES.KEYBOARD_SHORTCUTS} • {selectedFiles.length} archivos adjuntos
        </p>
      </div>
    </div>
  );
}