"use client";

import { useBackendWakeup } from "@/hooks/useBackendWakeup";
import { ServerStartup } from "@/components/ServerStartup";

/**
 * Client component that wakes up the backend on app initialization.
 * Shows a loading screen until the backend is ready.
 * Used in the root layout to ensure backend is ready before user interactions.
 */
export function BackendWakeupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isReady } = useBackendWakeup();
  
  if (!isReady) {
    return <ServerStartup />;
  }
  
  return <>{children}</>;
}
