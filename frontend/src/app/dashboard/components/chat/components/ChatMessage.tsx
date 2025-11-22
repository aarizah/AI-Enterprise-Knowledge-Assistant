"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Bot, Copy, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Message, FileAttachment, SourceReference } from "@/app/dashboard/types";
import { ChatService } from "@/app/dashboard/chatService";
import { SourceReferences } from "./SourceReference";

interface ChatMessageProps {
  message: Message;
  onOpenSources?: (sources: SourceReference[]) => void;
}

export function ChatMessage({ message, onOpenSources }: ChatMessageProps) {
  const formatFileSize = ChatService.formatFileSize;
  const isUser = message.sender === "user";

  // Format time consistently to avoid hydration mismatch
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Get confidence border color based on percentage
  const getConfidenceBorderColor = (confidence: number) => {
    if (confidence >= 90) return "border-t-emerald-500";
    if (confidence >= 75) return "border-t-blue-500";
    if (confidence >= 60) return "border-t-yellow-500";
    return "border-t-orange-500";
  };

  // Get confidence badge background color
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 90) return "bg-emerald-500/90 hover:bg-emerald-500";
    if (confidence >= 75) return "bg-blue-500/90 hover:bg-blue-500";
    if (confidence >= 60) return "bg-yellow-500/90 hover:bg-yellow-500";
    return "bg-orange-500/90 hover:bg-orange-500";
  };

  return (
    <div className={`flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isUser ? "items-end" : "items-start"
    }`}>
      <div className={`flex flex-col space-y-3 ${isUser ? "max-w-[75%]" : "max-w-[80%]"}`}>
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-1.5 w-full">
            {message.attachments.map((file) => (
              <div key={file.id} className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted hover:shadow-sm transition-all">
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium text-card-foreground flex-1 truncate">{file.name}</span>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {formatFileSize(file.size)}
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        {/* Message bubble */}
        {isUser ? (
          <Card className="px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-primary/20 to-accent/20 text-primary-foreground rounded-3xl rounded-tr-md border-0">
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-card-foreground">
              {message.content}
            </p>
          </Card>
        ) : (
          <Card className={`shadow-md hover:shadow-lg transition-all duration-200 bg-white rounded-lg overflow-hidden border-t-4 ${
            message.confidence !== undefined ? getConfidenceBorderColor(message.confidence) : "border-t-gray-300"
          }`}>
            {/* Header with icon, name and confidence badge */}
            <div className="flex items-center gap-3 px-4 pb-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <span className="font-semibold text-sm text-foreground">
                EKA Response
              </span>
              {message.confidence !== undefined && (
                <Badge
                  className={`${getConfidenceBadgeColor(message.confidence)} text-white px-2 py-1 font-semibold shadow-sm transition-colors flex items-center gap-1 `}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {message.confidence}% Confidence
                </Badge>
              )}
            </div>
            
            {/* Message content */}
            <div className="px-10 pb-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                {message.content}
              </p>
            </div>

          </Card>
        )}

        {/* Source References - only for assistant messages */}
        {!isUser && message.sources && (
          <SourceReferences
            references={message.sources}
            onOpenSources={onOpenSources}
          />
        )}
      </div>
    </div>
  );
}