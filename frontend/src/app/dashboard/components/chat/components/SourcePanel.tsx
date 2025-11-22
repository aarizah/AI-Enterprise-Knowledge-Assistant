"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X, ExternalLink } from "lucide-react";
import type { SourceReference } from "@/app/dashboard/types";

interface SourcePanelProps {
  references: SourceReference[];
  onClose: () => void;
}

export function SourcePanel({ references, onClose }: SourcePanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!references || references.length === 0) {
    return null;
  }

  const selectedSource = references[selectedIndex];

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "bg-gray-500";
    if (confidence >= 90) return "bg-emerald-500";
    if (confidence >= 80) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div className="w-[450px] border-l border-border bg-background flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-background flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">Sources</h3>
            <Badge variant="secondary" className="text-[10px] mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              {references.length} verified
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b bg-background px-3 py-2 flex gap-2 overflow-x-auto shrink-0">
        {references.map((ref, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              selectedIndex === index
                ? 'border-2 border-primary'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted border-2 border-transparent'
            }`}
          >
            <span>Source {index + 1}</span>
            {ref.confidence && (
              <Badge className={`${getConfidenceColor(ref.confidence)} text-white text-[10px] px-1.5 py-0`}>
                {ref.confidence}%
              </Badge>
            )}
              <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                {97}% 
              </Badge>
          </button>
        ))}
      </div>

      {/* Source Content with ScrollArea */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-5 space-y-4">
            {/* Document Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b">
              <div className="flex-1">
                <h4 className="font-semibold text-base mb-1 flex items-center gap-2">
                  {selectedSource.metadata?.source || "Unknown Document"}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </h4>
                {selectedSource.metadata?.page && (
                  <Badge variant="outline" className="text-xs">
                    Page {selectedSource.metadata.page}
                  </Badge>
                )}
                {selectedSource.metadata?.h2 && (
                  <Badge variant="outline" className="mx-5 text-xs">
                    {selectedSource.metadata.h2}
                  </Badge>
                )}
                {selectedSource.metadata?.h1 && (
                  <Badge variant="outline" className="mx-5 text-xs">
                    {selectedSource.metadata.h1}
                  </Badge>
                )}
                {selectedSource.metadata?.h3 && (
                  <Badge variant="outline" className="mx-5 text-xs">
                    {selectedSource.metadata.h3}
                  </Badge>
                )}
              </div>
            </div>

            {/* Excerpt Section */}
            <div>
              <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Excerpt
              </h5>
              <div className="bg-muted/30 border border-border rounded-lg p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedSource.page_content}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
