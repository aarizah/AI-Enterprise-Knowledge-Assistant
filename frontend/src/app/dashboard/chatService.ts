import { Message } from "@/app/dashboard/types";
import { CHAT_CONSTANTS } from '@/app/dashboard/constants';
import { settings } from "@/lib/settings";

export class ChatService {
  private static _lastSources: any = null;
  private static _lastConfidence: number | undefined = undefined;

  // Get and clear last sources
  static getLastSources() {
    const sources = this._lastSources;
    this._lastSources = null;
    return sources;
  }

  // Get and clear last confidence
  static getLastConfidence() {
    const confidence = this._lastConfidence;
    this._lastConfidence = undefined;
    return confidence;
  }

  // Generate AI response (now sends to real backend)
  static async generateResponse(message: string): Promise<string> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${settings.backendUrl}/chat/answer`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
        }),
      });

      if (!response.ok) {
        // Intentar obtener el mensaje de error del backend
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || response.statusText;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Store sources temporarily to attach to message later (map to UI shape)
      this._lastSources = (data.sources || []).map((src: any) => ({
        id: src.document_id ?? null,
        page_content: src.text ?? "",
        confidence: src.relevance_score ?? undefined, // Use relevance_score from backend
        cosine_distance: src.cosine_distance ?? undefined,
        metadata: src.metadata ?? {},
      })) || null;
      
      // Store confidence if available (expect a value between 0-1 from backend)
      if (data.confidence !== undefined) {
        this._lastConfidence = Math.round(data.confidence * 100);
      } else {
        // Default to a high confidence if not provided by backend
        this._lastConfidence = 96;
      }
      
      return data.answer || "Could not process the query.";
    } catch (error) {
      console.error('Error generating response:', error);
      // Devolver el error real del backend
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      return `Sorry, there was an error: ${errorMessage}`;
    }
  }

  // Create a new message
  static createMessage(
    content: string,
    sender: "user" | "assistant"
  ): Message {
    return {
      id: Date.now().toString() + Math.random(),
      content,
      sender,
      timestamp: new Date(),
    };
  }

  // Upload documents to backend `/documents` endpoint
  static async uploadDocuments(files: File[], fileNames?: string[]): Promise<{ ok: boolean; message?: string }>{
    const token = localStorage.getItem("token");
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (fileNames && fileNames.length) {
      fileNames.forEach((name) => formData.append("fileNames", name));
    }

    const response = await fetch(`${settings.backendUrl}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return { ok: false, message: text || response.statusText };
    }
    const data = await response.json().catch(() => ({ message: 'Files uploaded and ingested successfully.' }));
    return { ok: true, message: (data && (data.message || data.detail)) || 'Files uploaded and ingested successfully.' };
  }

  // Validate file upload
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (file.size > CHAT_CONSTANTS.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `The file "${file.name}" is too large. The maximum size is ${this.formatFileSize(CHAT_CONSTANTS.MAX_FILE_SIZE)}.`
      };
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!CHAT_CONSTANTS.ACCEPTED_FILE_TYPES.includes(fileExtension as any)) {
      return {
        isValid: false,
        error: `Unsupported file type. Accepted formats: ${CHAT_CONSTANTS.ACCEPTED_FILE_TYPES.join(', ')}`
      };
    }

    return { isValid: true };
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

}