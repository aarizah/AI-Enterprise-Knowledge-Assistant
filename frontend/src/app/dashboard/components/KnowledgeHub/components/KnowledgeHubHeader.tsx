import React from "react";
import { ArrowLeft, UploadCloud } from "lucide-react";

interface KnowledgeHubHeaderProps {
  onBack: () => void;
  onUploadClick: () => void;
}

export default function KnowledgeHubHeader({ onBack, onUploadClick }: KnowledgeHubHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b bg-card/95 sticky top-0 z-10">
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-muted font-normal transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Chat</span>
        </button>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-foreground">Knowledge Hub</span>
          </div>
          <span className="text-sm text-muted-foreground -mt-0.5">
            Manage your verified knowledge sources
          </span>
        </div>
        
        {/* Demo Badge */}
        <div className="px-3 py-2 bg-muted/50 border border-border/50 rounded-lg">
          <p className="text-[10px] text-muted-foreground font-normal">
            <span className="font-medium text-foreground">Demo environment</span> — Limited storage & rate limits apply
          </p>
        </div>
      </div>
      
      <button 
        onClick={onUploadClick}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition"
      >
        <UploadCloud className="w-4 h-4" />
        Upload Documents
      </button>
    </div>
  );
}
