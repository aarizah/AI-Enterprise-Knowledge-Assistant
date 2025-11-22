"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUploadComponent } from "./components/file_upload/FileUploadComponent";
import { FileAttachment } from "@/app/dashboard/types";
import { FileSearch, Upload } from "lucide-react";

interface ChatHeaderProps {
  selectedFiles: FileAttachment[];
  onFilesSelected: (files: FileAttachment[]) => void;
  onFileRemoved: (fileId: string) => void;
}

export function ChatHeader({ selectedFiles, onFilesSelected, onFileRemoved }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-border/50 px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 >AI Knowledge Assistant</h2>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium text-emerald-700">247 docs ready</span>
          </div>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 rounded-lg border-muted-foreground/20 hover:bg-muted/50 transition-all">
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs font-medium">Quick Upload</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Documents</DialogTitle>
            </DialogHeader>
            <FileUploadComponent
              selectedFiles={selectedFiles}
              onFilesSelected={onFilesSelected}
              onFileRemoved={onFileRemoved}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}