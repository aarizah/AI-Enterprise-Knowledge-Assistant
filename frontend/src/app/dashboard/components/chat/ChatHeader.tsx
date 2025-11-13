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
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Legal Assistant Chat</h2>
          <p className="text-sm text-gray-500">Ask questions, upload documents, get legal insights</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
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