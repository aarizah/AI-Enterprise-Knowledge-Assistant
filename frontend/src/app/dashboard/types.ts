export interface SourceReference {
  id: null;
  page_content: string;
  confidence?: number; // Relevance score 0-100 for this specific source (from backend relevance_score)
  cosine_distance?: number; // Cosine distance from backend (0-1, lower is better)
  metadata?: {
    h1?: string;
    h2?: string;
    h3?: string;
    page: number;
    source: string;
    type?: string;
    split_id?: number;
  };
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  sources?: SourceReference[];
  confidence?: number; // Confidence score 0-100 for assistant responses
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
}