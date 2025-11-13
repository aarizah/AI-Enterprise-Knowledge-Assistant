import { Message, FileAttachment } from "@/app/dashboard/types";
import { CHAT_CONSTANTS } from '@/app/dashboard/constants';
import { settings } from "@/lib/settings";

export class ChatService {
  // Generate AI response (now sends to real backend)
  static async generateResponse(message: string, attachments?: FileAttachment[]): Promise<string> {
    try {
      // If there are attachments, use the full function
      if (attachments && attachments.length > 0) {
        return await this.sendMessageWithFiles(message, attachments);
      }

      // If there are no files, just send the message
      const response = await fetch(`${settings.backendUrl}/ai/rag_from_query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.answer.answer || "Could not process the query.";
    } catch (error) {
      console.error('Error generating response:', error);
      // Fallback to simulated response in case of error
      await new Promise(resolve => setTimeout(resolve, CHAT_CONSTANTS.TYPING_SIMULATION_DELAY));
      const hasAttachments = attachments && attachments.length > 0;
      const baseResponse = "Sorry, there was an error connecting to the server. ";
      const attachmentPart = hasAttachments ? "Attachments could not be processed. " : "";
      const conclusionPart = "Please try again later.";
      
      return baseResponse + attachmentPart + conclusionPart;
    }
  }

  // Create a new message
  static createMessage(
    content: string,
    sender: "user" | "assistant",
    attachments?: FileAttachment[]
  ): Message {
    return {
      id: Date.now().toString() + Math.random(),
      content,
      sender,
      timestamp: new Date(),
      attachments: attachments?.length ? [...attachments] : undefined,
    };
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

  // Convert File objects to FileAttachment objects
  static createFileAttachment(file: File): FileAttachment {
    return {
      id: Date.now().toString() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file, // Include the full File object
    };
  }

  // Send files to backend
  static async uploadFiles(files: FileAttachment[]): Promise<any> {
    const formData = new FormData();
    
    // Append each file to FormData
    files.forEach((fileAttachment, index) => {
      formData.append(`files`, fileAttachment.file);
      formData.append(`fileNames`, fileAttachment.name);
    });

    try {
      const response = await fetch(`${settings.backendUrl}/ai/upload_documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading files: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  // Send message with files to backend
  static async sendMessageWithFiles(message: string, attachments?: FileAttachment[]): Promise<string> {
    try {
      // First upload files if any
      if (attachments && attachments.length > 0) {
        await this.uploadFiles(attachments);
      }

      // Send message to backend for RAG processing
      const response = await fetch(`${settings.backendUrl}/ai/rag_from_query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.answer.answer || "Could not process the query.";
    } catch (error) {
      console.error('Error sending message with files:', error);
      throw error;
    }
  }
}