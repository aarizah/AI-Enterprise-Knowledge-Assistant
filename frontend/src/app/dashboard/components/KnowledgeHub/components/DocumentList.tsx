import React from "react";
import DocumentCard from "./DocumentCard";

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

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: number) => Promise<void>;
  deletingDocId: number | null;
}

export default function DocumentList({ 
  documents, 
  isLoading, 
  error, 
  onDelete, 
  deletingDocId 
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading documents...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Error: {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No documents found. Upload your first document to get started.
      </div>
    );
  }

  return (
    <>
      {documents.map((doc) => (
        <DocumentCard 
          key={doc.id}
          doc={doc}
          onDelete={onDelete}
          isDeleting={deletingDocId === doc.id}
        />
      ))}
    </>
  );
}
