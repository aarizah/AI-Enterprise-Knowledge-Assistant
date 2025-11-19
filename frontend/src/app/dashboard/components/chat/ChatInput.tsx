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
    <div className=" px-8 py-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* File attachments preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-2 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-xl px-3 py-2 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2">
                  <FileSearch className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent-foreground">{file.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {ChatService.formatFileSize(file.size)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemoved(file.id)}
                    className="h-auto p-1 hover:bg-destructive/10"
                  >
                    <X className="w-3 h-3 text-destructive" />
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
              className=" max-h-[200px] resize-none pr-12 rounded-2xl border-border/50 focus:border-accent/50 focus:ring-accent/20 shadow-sm font-normal text-base leading-relaxed"
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
            className="self-end h-12 px-6 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {MESSAGES.KEYBOARD_SHORTCUTS} • {selectedFiles.length} archivos adjuntos
        </p>
      </div>
    </div>
  );
}