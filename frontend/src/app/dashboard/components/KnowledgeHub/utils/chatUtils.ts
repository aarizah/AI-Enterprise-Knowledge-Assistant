/**
 * Cuenta el número total de queries del usuario desde el historial del chat
 */
export function countChatQueries(): number {
  try {
    const chatHistory = localStorage.getItem("chat_history");
    if (!chatHistory) return 0;
    
    const history = JSON.parse(chatHistory);
    // Contar solo los mensajes del usuario (queries)
    return history.filter((msg: any) => msg.sender === "user").length;
  } catch {
    return 0;
  }
}

/**
 * Calcula el promedio de confidence de todas las respuestas del asistente
 */
export function calculateAverageConfidence(): number {
  try {
    const chatHistory = localStorage.getItem("chat_history");
    if (!chatHistory) return 0;
    
    const history = JSON.parse(chatHistory);
    
    // Filtrar solo mensajes del asistente que tengan confidence o sources con confidence
    const assistantMessages = history.filter((msg: any) => msg.sender === "assistant");
    
    if (assistantMessages.length === 0) return 0;
    
    const confidences: number[] = [];
    
    assistantMessages.forEach((msg: any) => {
      // Si el mensaje tiene "I don't have that information", lo saltamos
      if (msg.content?.toLowerCase().includes("i don't have that information")) {
        return;
      }
      
      // Buscar la mejor confidence (igual que en ChatMessage)
      if (msg.sources && msg.sources.length > 0) {
        const sourceConfidences = msg.sources
          .map((src: any) => src.confidence)
          .filter((conf: any) => typeof conf === "number");
        
        if (sourceConfidences.length > 0) {
          confidences.push(Math.max(...sourceConfidences));
          return;
        }
      }
      
      // Si no hay sources con confidence, usar la confidence del mensaje
      if (typeof msg.confidence === "number") {
        confidences.push(msg.confidence);
      }
    });
    
    if (confidences.length === 0) return 0;
    
    const average = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
    return Math.round(average * 10) / 10; // Redondear a 1 decimal
  } catch {
    return 0;
  }
}

/**
 * Formatea un número grande con separadores de miles
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
