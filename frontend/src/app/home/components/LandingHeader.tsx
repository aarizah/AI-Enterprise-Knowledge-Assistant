"use client";

import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";

interface LandingHeaderProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

export function LandingHeader({ onLogin, onGetStarted }: LandingHeaderProps) {
  return (
    <header className="bg-background/60 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">EKA</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onLogin}>
              Log In
            </Button>
            <Button onClick={onGetStarted} className="bg-gradient-to-r from-primary/80 to-accent/80 hover:from-primary hover:to-accent">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}