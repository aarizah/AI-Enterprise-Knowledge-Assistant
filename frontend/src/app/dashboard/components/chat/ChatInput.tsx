"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGES } from "@/app/dashboard/constants";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  onSendMessage,
  disabled = false
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    onSendMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend = inputMessage.trim();

  return (
    <div className="px-6 py-4">
      <div className="max-w-3xl mx-auto">
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
          {MESSAGES.KEYBOARD_SHORTCUTS}
        </p>
      </div>
    </div>
  );
}