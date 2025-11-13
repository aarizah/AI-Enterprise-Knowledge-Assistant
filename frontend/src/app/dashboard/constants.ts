export const CHAT_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES: 10,
  ACCEPTED_FILE_TYPES: ['.pdf', '.doc', '.docx', '.txt', '.rtf'],
  TYPING_SIMULATION_DELAY: 2000,
  SCROLL_BEHAVIOR: 'smooth' as const,
} as const;

export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 256, // w-64 = 16rem = 256px
  MAX_MESSAGE_HEIGHT: 200,
  MIN_TEXTAREA_HEIGHT: 60,
} as const;

export const MESSAGES = {
  INITIAL_ASSISTANT_MESSAGE: "Hello! I am your AI legal assistant. I can help you analyze documents, answer legal questions, and provide research assistance. How can I help you today?",
  TYPING_INDICATOR: "typing...",
  FILE_UPLOAD_PLACEHOLDER: "Ask a legal question or describe your situation...",
  KEYBOARD_SHORTCUTS: "Press Enter to send, Shift + Enter for a new line",
} as const;