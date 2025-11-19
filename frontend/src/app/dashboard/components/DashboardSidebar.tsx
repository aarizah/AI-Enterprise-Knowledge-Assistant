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
    <div className={`w-72 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col shadow-2xl shadow-black/5 ${className}`}>
      {/* Header */}
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 ring-2 ring-primary/10">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">EKA</h1>
            <p className="text-xs text-muted-foreground font-medium">Enterprise Knowledge</p>
          </div>
        </div>
      </div>
      
      {/* New Chat Button */}
      <div className="px-4 pb-4">
        <Button className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 font-semibold" size="default">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sidebar-accent to-sidebar-accent/50 border border-accent/20 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 group">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <MessageSquare className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground truncate">Current Conversation</span>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-sidebar-border/50 bg-gradient-to-b from-transparent to-sidebar/50 backdrop-blur-sm space-y-1">
        <Button variant="ghost" className="w-full justify-start hover:bg-sidebar-accent/50 rounded-xl h-10">
          <Settings className="w-4 h-4 mr-3" />
          <span className="text-sm font-medium">Settings</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start hover:bg-sidebar-accent/50 rounded-xl h-10">
          <HelpCircle className="w-4 h-4 mr-3" />
          <span className="text-sm font-medium">Help & Support</span>
        </Button>
        
        <Separator className="my-3 bg-sidebar-border/50" />
        
        {/* User Info */}
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/30 transition-colors cursor-pointer">
          <Avatar className="w-9 h-9 ring-2 ring-accent/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">U</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">User</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}