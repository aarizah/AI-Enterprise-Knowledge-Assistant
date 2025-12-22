"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuickUploadModal } from "./QuickUploadModal";
import { Upload, Database } from "lucide-react";

interface ChatHeaderProps {
  documentsReady?: number;
  onDocumentCountChange?: (count: number) => void;
}

export function ChatHeader({ documentsReady = 0, onDocumentCountChange }: ChatHeaderProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docCount, setDocCount] = useState(documentsReady);

  const handleUploadComplete = () => {
    const newCount = docCount + 1;
    setDocCount(newCount);
    onDocumentCountChange?.(newCount);
  };

  return (
    <div className="bg-white border-b border-border/50 px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold text-foreground">AI Knowledge Assistant</h2>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-200/50">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">
              {docCount} {docCount === 1 ? "document" : "documents"} ready
            </span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsUploadModalOpen(true)}
          className="h-8 rounded-lg border-border hover:bg-accent/10 hover:border-accent/50 transition-all"
        >
          <Upload className="w-3.5 h-3.5 mr-1.5" />
          <span className="text-xs font-medium">Quick Upload</span>
        </Button>

        <QuickUploadModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      </div>
    </div>
  );
}