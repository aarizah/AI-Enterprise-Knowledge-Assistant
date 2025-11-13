"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className="bg-blue-100">
          <Zap className="w-4 h-4 text-blue-600" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm">Legal Assistant</span>
          <span className="text-xs text-gray-500">is thinking...</span>
        </div>
        <Card className="p-4 bg-white border-blue-200 max-w-20">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </Card>
      </div>
    </div>
  );
}