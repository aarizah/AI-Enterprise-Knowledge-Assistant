"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 justify-start">
      <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-background shadow-md">
        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
          <Zap className="w-4 h-4 text-accent animate-pulse" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-2 max-w-[80%] items-start">
        <div className="flex items-center gap-2 px-1">
          <span className="font-semibold text-xs text-muted-foreground">Legal Assistant</span>
          <span className="text-xs text-muted-foreground/60 font-medium animate-pulse">is thinking...</span>
        </div>
        <Card className="px-5 py-3 bg-card/95 backdrop-blur-sm shadow-md rounded-2xl rounded-tl-md border-border/50">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
            <div className="w-2 h-2 bg-gradient-to-br from-primary to-accent rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
          </div>
        </Card>
      </div>
    </div>
  );
}