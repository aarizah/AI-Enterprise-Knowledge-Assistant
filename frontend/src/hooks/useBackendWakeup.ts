"use client";

import { useEffect, useRef, useState } from "react";
import { settings } from "@/lib/settings";

/**
 * Hook to wake up the backend on app load.
 * Makes a request to the health endpoint to trigger cold start
 * before users need to interact with the app.
 * Returns isReady when the backend responds successfully.
 */
export function useBackendWakeup() {
  const hasWokenUp = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only wake up once per session
    if (hasWokenUp.current) return;
    
    const wakeUpBackend = async () => {
      try {
        hasWokenUp.current = true;
        
        // Poll the backend until it responds
        const maxAttempts = 60; // 60 attempts = 3 minutes max
        let attempts = 0;
        
        const checkHealth = async (): Promise<boolean> => {
          try {
            const response = await fetch(`${settings.backendUrl}/healthz`, {
              method: "GET",
              mode: "cors",
              signal: AbortSignal.timeout(5000), // 5 second timeout
            });
            
            return response.ok;
          } catch (error) {
            return false;
          }
        };

        while (attempts < maxAttempts) {
          const healthy = await checkHealth();
          
          if (healthy) {
            setIsReady(true);
            return;
          }
          
          attempts++;
          // Wait 3 seconds between attempts
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // If we exhausted all attempts, still show the app
        setIsReady(true);
      } catch (error) {
        // On error, show the app anyway
        setIsReady(true);
      }
    };

    wakeUpBackend();
  }, []);

  return { isReady };
}
