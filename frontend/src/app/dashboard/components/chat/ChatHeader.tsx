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
    <div className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-8 py-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-card-foreground tracking-tight mb-1">AI Assistant</h2>
          <p className="text-sm text-muted-foreground font-medium">Ask questions, upload documents, get documents insights</p>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="default" className="rounded-xl border-accent/20 hover:bg-accent/10 hover:border-accent/40 hover:shadow-md transition-all duration-200 font-medium">
                <FileSearch className="w-4 h-4 mr-2" />
                Document Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Legal Documents</DialogTitle>
              </DialogHeader>
              <FileUploadComponent
                selectedFiles={selectedFiles}
                onFilesSelected={onFilesSelected}
                onFileRemoved={onFileRemoved}
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Quick Upload/OOS
          </Button>
        </div>
      </div>
    </div>
  );
}