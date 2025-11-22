export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File; // File object to access content
}

export interface SourceReference {
  id: null;
  page_content: string;
  confidence?: number; // Confidence score 0-100 for this specific source
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
  attachments?: FileAttachment[];
  sources?: SourceReference[];
  confidence?: number; // Confidence score 0-100 for assistant responses
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  selectedFiles: FileAttachment[];
}