"use client";

import { useRef, useCallback } from "react";

export function useAutoScrollToBottom() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior });
    }
  }, []);

  return { scrollRef, scrollToBottom };
}