"use client";

import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, BookOpen } from "lucide-react";
import type { SourceReference } from "@/app/dashboard/types";

interface SourceReferencesProps {
  references: SourceReference[];
}

export function SourceReferences({ references }: SourceReferencesProps) {
  console.log("REFERENCES:", references);
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors border border-blue-200">
          <BookOpen className="w-3 h-3" />
          <span>Sources ({references.length})</span>
        </button>
      </PopoverTrigger>
      
      <PopoverContent 
        side="right" 
        align="start"
        className="w-96 p-0"
        sideOffset={8}
      >
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Source References
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {references.length} {references.length === 1 ? 'source' : 'sources'} found
          </p>
        </div>

        <ScrollArea className="max-h-[500px]">
          <div className="p-4 space-y-4">
            {references.map((reference, index) => (
              <div key={reference.id} className="space-y-2">
                {/* Header with document info */}
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">
                    [{index + 1}]
                  </Badge>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-sm text-gray-900 break-words">
                        {reference.documentName}
                      </span>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {reference.pageNumber && (
                          <Badge variant="secondary" className="text-xs">
                            p. {reference.pageNumber}
                          </Badge>
                        )}
                        {reference.relevanceScore && (
                          <Badge 
                            variant="outline" 
                            className="text-xs"
                            title={`Relevance: ${(reference.relevanceScore * 100).toFixed(1)}%`}
                          >
                            {(reference.relevanceScore * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="pl-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {reference.excerpt}
                    </p>
                  </div>

                  {/* Metadata */}
                  {reference.metadata && Object.keys(reference.metadata).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {reference.metadata.author && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-500 font-medium min-w-[60px]">Author:</span>
                          <span className="text-xs text-gray-700">{reference.metadata.author}</span>
                        </div>
                      )}
                      {reference.metadata.date && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-500 font-medium min-w-[60px]">Date:</span>
                          <span className="text-xs text-gray-700">{reference.metadata.date}</span>
                        </div>
                      )}
                      {reference.metadata.section && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-500 font-medium min-w-[60px]">Section:</span>
                          <span className="text-xs text-gray-700">{reference.metadata.section}</span>
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
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
