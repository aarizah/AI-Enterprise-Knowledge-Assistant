import { useState, useEffect } from "react";
import { settings } from "@/lib/settings";
import { countChatQueries } from "../utils/chatUtils";

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

interface DocumentsResponse {
  total: number;
  documents: Document[];
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [total, setTotal] = useState(0);
  const [totalQueries, setTotalQueries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${settings.backendUrl}/documents?skip=0&limit=100`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: DocumentsResponse = await response.json();
      setDocuments(data.documents);
      setTotal(data.total);
      setTotalQueries(countChatQueries());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch documents");
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      setDeletingDocId(id);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${settings.backendUrl}/documents/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      setDocuments(documents.filter((doc) => doc.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting document:", err);
      alert(`Failed to delete document: ${err instanceof Error ? err.message : "Unknown error"}`);
      return false;
    } finally {
      setDeletingDocId(null);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    total,
    totalQueries,
    isLoading,
    error,
    deletingDocId,
    fetchDocuments,
    deleteDocument,
  };
}
