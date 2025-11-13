export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File; // File object to access content
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  attachments?: FileAttachment[];
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  selectedFiles: FileAttachment[];
}