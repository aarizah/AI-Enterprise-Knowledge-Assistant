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

  return (
    <div className="flex gap-3 group">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={message.sender === "assistant" ? "bg-blue-100" : "bg-gray-100"}>
          {message.sender === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4 text-blue-600" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">
            {message.sender === "user" ? "You" : "Legal Assistant"}
          </span>
          <span className="text-xs text-gray-500">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2">
            {message.attachments.map((file) => (
              <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-900 flex-1">{file.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {formatFileSize(file.size)}
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        <Card className={`p-4 ${
          message.sender === "assistant" 
            ? "bg-white border-blue-200" 
            : "bg-blue-50 border-blue-200"
        }`}>
          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </Card>

        {/* Source References - only for assistant messages */}
        {message.sender === "assistant" && message.sources && (
          <SourceReferences references={message.sources} />
        )}
      </div>
    </div>
  );
}