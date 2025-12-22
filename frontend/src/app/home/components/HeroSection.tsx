"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, Upload, Zap } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onUploadDocument: () => void;
  stats: Array<{
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    label: string;
  }>;
}

export function HeroSection({ onGetStarted, onUploadDocument, stats }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="space-y-8">
          {/* Logo and Title */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary/80 to-accent/80 rounded-3xl flex items-center justify-center shadow-xl shadow-primary/30">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl"></div>
              <Zap className="w-10 h-10 text-primary-foreground relative z-10" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight">
              Your Enterprise Knowledge Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect your company's knowledge, get instant answers with citations, and execute actions.
              Reduce search time by 40% with AI Enterprise Knowledge Assistant.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary/70 to-accent/70 hover:from-primary hover:to-accent transition-all shadow-lg shadow-primary/20"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button
              onClick={onUploadDocument}
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 border-primary/30 hover:border-accent/50 hover:bg-accent/5 transition-all"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12">
            <p className="text-sm text-muted-foreground mb-8">Trusted by enterprise teams worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}