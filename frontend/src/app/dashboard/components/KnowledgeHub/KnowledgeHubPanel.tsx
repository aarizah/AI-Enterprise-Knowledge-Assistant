import React, { useState } from "react";
import { StatCard, KnowledgeHubHeader, SearchBar, SuccessMessage, DocumentList } from "./components";
import { QuickUploadModal } from "../chat/QuickUploadModal";
import { useDocuments } from "./hooks/useDocuments";
import { calculateAverageConfidence } from "./utils/chatUtils";
import { KNOWLEDGE_HUB_STATS, DELETE_SUCCESS_DURATION } from "./constants";

export default function KnowledgeHubPanel({ onBack }: { onBack: () => void }) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const { documents, total, totalQueries, isLoading, error, deletingDocId, fetchDocuments, deleteDocument } = useDocuments();
  const calculatedAccuracy = calculateAverageConfidence();
  const avgAccuracy = calculatedAccuracy > 0 ? calculatedAccuracy : null;

  const handleDeleteDocument = async (id: number) => {
    const success = await deleteDocument(id);
    
    if (success) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), DELETE_SUCCESS_DURATION);
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex flex-col overflow-y-auto">
      <KnowledgeHubHeader 
        onBack={onBack}
        onUploadClick={() => setIsUploadDialogOpen(true)}
      />

      <QuickUploadModal 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen}
        onUploadComplete={fetchDocuments}
      />

      <div className="flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Documents" 
            value={<span>{total}</span>} 
            hint={isLoading ? "Loading..." : `${documents.length} loaded`}
          />
          <StatCard 
            title="Total Chunks" 
            value={<span>{documents.reduce((sum, doc) => sum + doc.chunks_count, 0).toLocaleString()}</span>} 
            hint="Across all sources" 
          />
          <StatCard 
            title="Avg Accuracy" 
            value={<span>{avgAccuracy !== null ? `${avgAccuracy}%` : '--'}</span>} 
            hint="From chat responses" 
          />
          <StatCard 
            title="Total Queries" 
            value={<span>{totalQueries.toLocaleString()}</span>} 
            hint="Questions asked" 
          />
        </div>

        <SearchBar />

        {deleteConfirmId && (
          <SuccessMessage message="Document deleted successfully" />
        )}

        <div className="flex flex-col gap-4">
          <div className="text-foreground font-medium text-base">Active Knowledge Sources</div>
          
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            error={error}
            onDelete={handleDeleteDocument}
            deletingDocId={deletingDocId}
          />
        </div>
      </div>
    </div>
  );
}
