"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Bot, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { Message, FileAttachment } from "@/app/dashboard/types";
import { ChatService } from "@/app/dashboard/chatService";
import { SourceReferences } from "./SourceReference";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formatFileSize = ChatService.formatFileSize;
  const isUser = message.sender === "user";

  // Format time consistently to avoid hydration mismatch
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`flex gap-3 group animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isUser ? "justify-end" : "justify-start"
    }`}>
      {/* Avatar - only show for assistant on the left */}
      {!isUser && (
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-background shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
            <Bot className="w-4 h-4 text-accent" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col space-y-2 ${isUser ? "max-w-[75%] items-end" : "max-w-[80%] items-start"}`}>
        {/* Header with name and time */}
        <div className="flex items-center gap-2 px-1">
          <span className="font-semibold text-xs text-muted-foreground">
            {isUser ? "You" : "Legal Assistant"}
          </span>
          <span className="text-xs text-muted-foreground/60 font-medium">
            {formatTime(message.timestamp)}
          </span>
        </div>
        
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
        <Card className={`p-4 shadow-md hover:shadow-lg transition-all duration-200 ${
          isUser
            ? "bg-gradient-to-br from-primary/30 to-primary/30 text-primary-foreground rounded-3xl rounded-tr-md border-0" 
            : "bg-card/95 backdrop-blur-sm rounded-2xl rounded-tl-md border-border/50"
        }`}>
          <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
            isUser ? "text-card-foreground" : "text-card-foreground"
          }`}>
            {message.content}
          </p>
        </Card>

        {/* Source References - only for assistant messages */}
        {!isUser && message.sources && (
          <SourceReferences references={message.sources} />
        )}
      </div>

      {/* Avatar for user on the right */}
      {isUser && (
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-primary/20 shadow-md">
          <AvatarFallback className="bg-muted">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}