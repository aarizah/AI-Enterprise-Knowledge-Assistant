import React, { useState } from "react";
import { CheckCircle2, FileText, File, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_type: string;
  upload_date: string;
  user_id: number;
  chunks_count: number;
  file_size_bytes: number;
  status: string;
}

interface DocumentCardProps {
  doc: Document;
  onDelete: (id: number) => Promise<void>;
  isDeleting: boolean;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <div className="h-2 bg-foreground/80 rounded-full" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function DocumentCard({ doc, onDelete, isDeleting }: DocumentCardProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className={`bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center gap-4 transition-all duration-300 ${
        isDeleting ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        {doc.file_type.toLowerCase() === "pdf" ? <FileText className="w-6 h-6" /> : <File className="w-6 h-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="truncate font-medium text-foreground">{doc.filename}</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-chart-2/10 text-chart-2 border border-chart-2/30 font-normal capitalize">
            {doc.status}
          </span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
          <span className="uppercase">{doc.file_type}</span>
          <span>•</span>
          <span>{formatFileSize(doc.file_size_bytes)}</span>
          <span>•</span>
          <span>{doc.chunks_count} chunks</span>
          <span>•</span>
          <span>Uploaded {formatDate(doc.upload_date)}</span>
        </div>
        <div className="mt-4 grid grid-cols-12 items-center gap-4">
          <div className="col-span-6">
            <div className="text-xs text-muted-foreground mb-1">Processing Status</div>
            <ProgressBar value={doc.status === "processed" ? 100 : 50} />
          </div>
          <div className="col-span-3">
            <div className="text-xs text-muted-foreground">Chunks</div>
            <div className="text-sm font-medium text-foreground">{doc.chunks_count}</div>
          </div>
          <div className="col-span-3 flex items-center gap-2">
            <div className="text-xs text-muted-foreground">Status</div>
            {doc.status === "processed" && (
              <div className="inline-flex items-center gap-1 text-xs font-normal text-chart-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg p-2 transition-colors"
              disabled={isDeleting}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52 p-1">
            <DialogTrigger asChild>
              <DropdownMenuItem 
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-md px-3 py-2.5 text-sm font-normal"
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete document
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">{doc.filename}</p>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="uppercase">{doc.file_type}</span>
              <span>•</span>
              <span>{formatFileSize(doc.file_size_bytes)}</span>
              <span>•</span>
              <span>{doc.chunks_count} chunks</span>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <DialogTrigger asChild>
              <button className="px-4 py-2 rounded-lg border border-input bg-background hover:bg-muted text-sm font-medium transition">
                Cancel
              </button>
            </DialogTrigger>
            <button 
              onClick={() => onDelete(doc.id)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete Document"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
