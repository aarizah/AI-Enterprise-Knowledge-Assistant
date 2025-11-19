"use client";

import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { FileText, BookOpen } from "lucide-react";
import type { SourceReference } from "@/app/dashboard/types";

interface SourceReferencesProps {
  references: SourceReference[];
}

export function SourceReferences({ references }: SourceReferencesProps) {
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="
  inline-flex items-center gap-2 px-4 py-2
  rounded-xl
  bg-primary/50
  text-accent-foreground
  hover:bg-primary/80
  border border-primary/40
  text-xs font-semibold
  transition-all duration-200
  shadow-sm hover:shadow-md hover:-translate-y-0.5
">

          <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>Sources ({references.length})</span>
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        side="right" 
        align="start"
        className="w-160 p-0"
        sideOffset={8}
        collisionPadding={{ top: 20, bottom: 40, left: 20, right: 20 }}
      >
        <div className="p-4 border-b bg-muted">
          <h3 className="font-semibold text-sm text-popover-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Source References
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {references.length} {references.length === 1 ? 'source' : 'sources'} found
          </p>
        </div>

        <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-5 space-y-4">
            {references.map((reference, index) => (
              <div key={index} className="space-y-2">
                {/* Header with document info */}
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">
                    [{index + 1}]
                  </Badge>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm text-popover-foreground break-words">
                        {reference.metadata?.source || "Unknown Document"}
                      </span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {reference.metadata?.page && (
                          <Badge variant="secondary" className="text-xs">
                            p. {reference.metadata.page}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="pl-8">
                  <div className="bg-muted border border-border rounded-md p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {reference.page_content}
                    </p>
                  </div>

                  {/* Metadata */}
                  {reference.metadata && (
                    <div className="mt-2 space-y-1">
                      {reference.metadata.h1 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground font-medium min-w-[60px]">H1:</span>
                          <span className="text-xs text-popover-foreground">{reference.metadata.h1}</span>
                        </div>
                      )}
                      {reference.metadata.h2 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground font-medium min-w-[60px]">Section:</span>
                          <span className="text-xs text-popover-foreground">{reference.metadata.h2}</span>
                        </div>
                      )}
                      {reference.metadata.h3 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground font-medium min-w-[60px]">Subsection:</span>
                          <span className="text-xs text-popover-foreground">{reference.metadata.h3}</span>
                        </div>
                      )}
                      {reference.metadata.type && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground font-medium min-w-[60px]">Type:</span>
                          <span className="text-xs text-popover-foreground uppercase">{reference.metadata.type}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Separator between references */}
                {index < references.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
