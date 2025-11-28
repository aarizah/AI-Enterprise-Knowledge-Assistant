"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { countChatQueries, calculateAverageConfidence } from "./KnowledgeHub/utils/chatUtils";
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
  BarChart3,
  LogOut
} from "lucide-react";

interface DashboardSidebarProps {
  className?: string;
  onNewConversation?: () => void;
  onAnalyticsClick?: () => void;
  onKnowledgeHubClick?: () => void;
}

export function DashboardSidebar({ className, onNewConversation, onAnalyticsClick, onKnowledgeHubClick }: DashboardSidebarProps) {
  const router = useRouter();
  const [queriesCount, setQueriesCount] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState<number | null>(null);

  useEffect(() => {
    // Actualizar el conteo inicial
    setQueriesCount(countChatQueries());
    const accuracy = calculateAverageConfidence();
    setAvgAccuracy(accuracy > 0 ? accuracy : null);

    // Actualizar cada vez que cambie el localStorage
    const handleStorageChange = () => {
      setQueriesCount(countChatQueries());
      const accuracy = calculateAverageConfidence();
      setAvgAccuracy(accuracy > 0 ? accuracy : null);
    };

    window.addEventListener("storage", handleStorageChange);
    // También escuchar cambios personalizados (cuando se agrega un mensaje en la misma pestaña)
    window.addEventListener("chat_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chat_updated", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth");
  };

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
        <Button onClick={onKnowledgeHubClick} variant="ghost" className="w-full h-9 justify-start hover: rounded-lg font-semibold text-s text-foreground border  hover:border-accent/70 hover:text-black transition-all">
          <Database className="w-4 h-5 mr-2.5" />
          Knowledge Base
        </Button>
        <Button
          variant="ghost"
          className="w-full h-9 justify-start hover: rounded-lg font-semibold text-s text-foreground border hover:text-black  hover:border-accent/70 transition-all"
          onClick={onAnalyticsClick}
        >
          <BarChart3 className="w-4 h-4 mr-2.5" />
          Analytics
        </Button>
      </div>

      <Separator className="mx-5 bg-sidebar-border/50" />

      {/* Section 4: Session Stats */}
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-muted-foreground tracking-wide">Current Session</p>
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] font-semibold hover:text-foreground" onClick={onKnowledgeHubClick}>
            View All
          </Button>
        </div>
        
        <div className="space-y-2">
          {/* Time Saved Card - Primary metric */}
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-emerald-700">Time Saved</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-emerald-900 leading-tight py-2">{queriesCount * 5} min</p>
            <p className="text-[10px] text-emerald-700/80 mt-0.5">≈ {Math.floor(queriesCount * 5 / 60)}h {(queriesCount * 5) % 60}m this session</p>
          </div>

          {/* Stats Grid - Secondary metrics */}
          <div className="grid grid-cols-2 gap-2">
            {/* Accuracy Card */}
            <div className="p-2.5 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-medium text-blue-700">Accuracy</span>
              </div>
              <p className="text-lg font-bold text-blue-900 leading-tight py-2">{avgAccuracy !== null ? `${avgAccuracy}%` : '--'}</p>
              <p className="text-[9px] text-blue-600/80 mt-0.5">Avg confidence</p>
            </div>

            {/* Questions Asked Card */}
            <div className="p-2.5 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200/50 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-4 h-4 text-violet-600" />
                <span className="text-[10px] font-medium text-violet-700">Queries</span>
              </div>
              <p className="text-lg font-bold text-violet-900 leading-tight py-2">{queriesCount}</p>
              <p className="text-[9px] text-violet-600/80 mt-0.5">Questions asked</p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mx-5 bg-sidebar-border/50" />

      {/* Section 5: Bottom Navigation */}
      <div className="p-5 mt-auto space-y-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-muted-foreground/10 active:bg-accent/20 rounded-xl p-2.5 transition-all duration-200 group border border-transparent hover:border-border/50">
              <div className="relative">
                <Avatar className="w-9 h-9 border border-border shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold">JD</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 block w-3 h-3 bg-emerald-500 border-2 border-sidebar rounded-full ring-2 ring-emerald-500/20" title="Online"></span>
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground leading-tight truncate">John Doe</span>
                <span className="text-xs text-muted-foreground leading-tight">Admin</span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 p-2" sideOffset={8}>
            <div className="px-3 py-2 mb-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@company.com</p>
            </div>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="focus:text-black focus:bg-muted-foreground/10 cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


      </div>
    </div>
  );
}