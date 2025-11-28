"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Bot, Copy, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Message, SourceReference } from "@/app/dashboard/types";
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

  // Check if the message is a "no information" response
  const isNoInfoResponse = message.content.toLowerCase().includes("i don't have that information");

  // Get the best source confidence (highest relevance_score)
  const getBestSourceConfidence = (): number | undefined => {
    if (isNoInfoResponse) return undefined; // No confidence for "no info" responses
    if (!message.sources || message.sources.length === 0) return message.confidence;
    
    const sourceConfidences = message.sources
      .map(src => src.confidence)
      .filter((conf): conf is number => conf !== undefined);
    
    if (sourceConfidences.length === 0) return message.confidence;
    
    return Math.max(...sourceConfidences);
  };

  const displayConfidence = getBestSourceConfidence();
  const shouldShowSources = !isNoInfoResponse && message.sources && message.sources.length > 0;

  // Get confidence border color based on percentage
  const getConfidenceBorderColor = (confidence: number) => {
    if (confidence >= 90) return "border-t-emerald-500/70";   // Verde suave
    if (confidence >= 70) return "border-t-teal-500/60";      // Verde azulado
    if (confidence >= 50) return "border-t-amber-500/60";     // Ámbar suave
    return "border-t-rose-500/60";                            // Rosa suave
  };

  // Get confidence badge background color
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 90) return "bg-emerald-500/85 hover:bg-emerald-500/95";  // Verde suave
    if (confidence >= 70) return "bg-teal-500/80 hover:bg-teal-500/90";       // Verde azulado
    if (confidence >= 50) return "bg-amber-500/80 hover:bg-amber-500/90";     // Ámbar suave
    return "bg-rose-500/80 hover:bg-rose-500/90";                             // Rosa suave
  };

  return (
    <div className={`flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isUser ? "items-end" : "items-start"
    }`}>
      <div className={`flex flex-col space-y-3 ${isUser ? "max-w-[75%]" : "max-w-[80%]"}`}>
        {/* Message bubble */}
        {isUser ? (
          <Card className="px-5 py-2 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-primary/20 to-accent/20 text-primary-foreground rounded-3xl rounded-tr-md border-0">
            <p className="text-sm whitespace-pre-wrap leading-relaxed text-card-foreground">
              {message.content}
            </p>
          </Card>
        ) : (
          <Card className={`shadow-md hover:shadow-lg transition-all duration-200 bg-white rounded-lg overflow-hidden border-t-4 ${
            isNoInfoResponse 
              ? "border-t-slate-400" 
              : displayConfidence !== undefined 
                ? getConfidenceBorderColor(displayConfidence) 
                : "border-t-gray-300"
          }`}>
            {/* Header with icon, name and confidence badge */}
            <div className="flex items-center gap-3 px-4 pb-3">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <span className="font-semibold text-sm text-foreground">
                EKA Response
              </span>
              {displayConfidence !== undefined && (
                <Badge
                  className={`${getConfidenceBadgeColor(displayConfidence)} text-white px-2 py-1 font-semibold shadow-sm transition-colors flex items-center gap-1 `}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {displayConfidence}% Confidence
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

        {/* Source References - only for assistant messages with valid sources */}
        {!isUser && shouldShowSources && (
          <SourceReferences
            references={message.sources!}
            onOpenSources={onOpenSources}
          />
        )}
      </div>
    </div>
  );
}