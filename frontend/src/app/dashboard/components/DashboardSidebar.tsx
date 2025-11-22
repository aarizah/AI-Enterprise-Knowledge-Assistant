"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { 
  Plus,
  MessageSquare,
  Settings,
  HelpCircle,
  Zap,
  Clock,
  Target,
  Flame,
  Database,
  BarChart3
} from "lucide-react";

interface DashboardSidebarProps {
  className?: string;
  onNewConversation?: () => void;
  onAnalyticsClick?: () => void;
}

export function DashboardSidebar({ className, onNewConversation, onAnalyticsClick }: DashboardSidebarProps) {
  return (
    <div className={`w-75 bg-sidebar/95 border-r border-sidebar-border/50 flex flex-col  ${className}`}>
      {/* Section 1: Header with Logo and Tagline */}
      <div className="p-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 ring-2 ring-primary/10">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">EKA</h1>
            <p className="text-[11px] text-muted-foreground font-medium">Your AI-powered assistant</p>
          </div>
        </div>
      </div>

      <Separator className="mx-6 bg-sidebar-border/50" />
      
      {/* Section 2: New Conversation Button */}
      <div className="px-5 pb-3">
        <Button onClick={onNewConversation} className="w-full h-9 bg-gradient-to-br from-primary/60 to-accent/60 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 font-medium text-xs" size="sm">
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          New Conversation
        </Button>
      </div>

      <Separator className="mx-6 bg-sidebar-border/50" />

      {/* Section 3: Primary Navigation */}
      <div className="px-5 py-3 space-y-1">
        <Button variant="ghost" className="w-full h-9 justify-start hover: rounded-lg font-semibold text-s text-foreground border  hover:border-accent/70 transition-all">
          <Database className="w-4 h-5 mr-2.5" />
          Knowledge Base
        </Button>
        <Button
          variant="ghost"
          className="w-full h-9 justify-start hover: rounded-lg font-semibold text-s text-foreground border  hover:border-accent/70 transition-all"
          onClick={onAnalyticsClick}
        >
          <BarChart3 className="w-4 h-4 mr-2.5" />
          Analytics
        </Button>
      </div>

      <Separator className="mx-5 bg-sidebar-border/50" />

      {/* Section 4: Your Impact This Week */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-muted-foreground tracking-wide">Your Impact This Week</p>
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] font-semibold hover:text-foreground">
            Details
          </Button>
        </div>
        
        <div className="space-y-1.5">
          {/* Time Saved Card */}
          <Card className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50">
            <div className="flex items-start justify-between mb-1.5">
              <span className="text-[11px] font-medium text-emerald-700">Time Saved</span>
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xl font-bold text-emerald-900">142 min</p>
              <p className="text-[10px] text-emerald-700">≈ 2.4 hours this week</p>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Queries Card */}
            <Card className="p-2.5 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200/50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Target className="w-3.5 h-3.5 text-violet-600" />
                <span className="text-[10px] font-medium text-violet-700">Queries</span>
              </div>
              <p className="text-xl font-bold text-violet-900">23</p>
            </Card>

            {/* Streak Card */}
            <Card className="p-2.5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[10px] font-medium text-orange-700">Streak</span>
              </div>
              <p className="text-xl font-bold text-orange-900">5 days</p>
            </Card>
          </div>
        </div>
      </div>

      <Separator className="mx-5 bg-sidebar-border/50" />

      {/* Section 5: Bottom Navigation */}
      <div className="p-5 mt-auto">
        <Button variant="ghost" className="w-full justify-start hover:bg-sidebar-accent/50 rounded-lg h-8 font-medium text-muted-foreground">
          <Settings className="w-3.5 h-3.5 mr-2.5" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
    </div>
  );
}