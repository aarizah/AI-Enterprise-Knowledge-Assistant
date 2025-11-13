"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Plus,
  MessageSquare,
  Settings,
  HelpCircle,
  Zap
} from "lucide-react";

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">EKA</h1>
        </div>
  <p className="text-sm text-gray-500">Enterprise Knowledge Assistant</p>
      </div>
      
      {/* New Chat Button */}
      <div className="p-4">
        <Button className="w-full" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Chat / OOS
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-900 truncate">Current Conversation</span>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Settings / OOS
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support / OOS
        </Button>
        
        <Separator className="my-2" />
        
        {/* User Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">User</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}