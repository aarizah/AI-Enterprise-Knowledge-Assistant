"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, Info, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ChatService } from "@/app/dashboard/chatService";

interface QuickUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "indexing" | "complete" | "error";
  error?: string;
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
const ACCEPTED_TYPES = [".pdf"];

export function QuickUploadModal({ open, onOpenChange, onUploadComplete }: QuickUploadModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!ACCEPTED_TYPES.includes(extension)) {
      return `File type ${extension} is not supported`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    
    return null;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    const uploadFiles: UploadFile[] = [];
    
    for (const file of fileArray) {
      const error = validateFile(file);
      
      if (error) {
        toast.error(error);
        continue;
      }

      uploadFiles.push({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: "pending",
      });
    }

    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const simulateUpload = async (_fileId: string) => {};

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    // Mark as uploading visually
    setFiles((prev) => prev.map((f) => (
      f.status === "pending" ? { ...f, status: "uploading", progress: 10 } : f
    )));

    const uploadResponse = await ChatService.uploadDocuments(pendingFiles.map((f) => f.file));

    if (uploadResponse.ok) {
      // Mark as indexing then complete
      setFiles((prev) => prev.map((f) => (
        f.status === "uploading" ? { ...f, status: "indexing", progress: 70 } : f
      )));

      // Small delay to show indexing state
      await new Promise((r) => setTimeout(r, 800));
      setFiles((prev) => prev.map((f) => (
        f.status === "indexing" ? { ...f, status: "complete", progress: 100 } : f
      )));

      toast.success("Documents uploaded", {
        description: uploadResponse.message || "Your documents are being indexed and will be ready shortly.",
      });

      onUploadComplete();
      setTimeout(() => {
        onOpenChange(false);
        setFiles([]);
      }, 500);
    } else {
      setFiles((prev) => prev.map((f) => (
        f.status !== "complete" ? { ...f, status: "error", error: uploadResponse.message } : f
      )));
      toast.error("Upload failed", { description: uploadResponse.message });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const isUploading = files.some((f) => f.status === "uploading" || f.status === "indexing");
  const hasFiles = files.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Upload document</DialogTitle>
          <DialogDescription className="text-sm">
            Add new knowledge to your AI Assistant. Files will be indexed automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-1">
          {/* Demo Notice */}
          <div className="bg-amber-50 border border-amber-200/50 rounded-lg p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-amber-700" />
            </div>
            <div className="text-xs text-amber-800 space-y-1">
              <p className="font-medium">Demo environment</p>
              <p>Max {MAX_FILES} files · Max {formatFileSize(MAX_FILE_SIZE)} each · Uploads periodically cleared</p>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PDF up to {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          {/* File List */}
          {hasFiles && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {files.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {uploadFile.status === "complete" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : uploadFile.status === "uploading" || uploadFile.status === "indexing" ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {uploadFile.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(uploadFile.file.size)}</span>
                      {uploadFile.status === "uploading" && (
                        <>
                          <span>•</span>
                          <span>Uploading...</span>
                        </>
                      )}
                      {uploadFile.status === "indexing" && (
                        <>
                          <span>•</span>
                          <span>Indexing...</span>
                        </>
                      )}
                      {uploadFile.status === "complete" && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600">Complete</span>
                        </>
                      )}
                    </div>
                  </div>

                  {uploadFile.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setFiles([]);
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!hasFiles || isUploading || files.every((f) => f.status !== "pending")}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
