"use client";

import { useEffect, useState } from "react";

export function ServerStartup() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/20 to-accent/10 flex items-center justify-center z-50">
      <div className="text-center space-y-8 px-4">
        {/* Logo/Icon animado */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse"></div>
          <div className="relative">
            <svg
              className="w-24 h-24 mx-auto text-primary animate-spin-slow"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Texto principal */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            EKA
          </h1>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <p className="text-xl text-foreground font-medium min-h-[28px]">
            Starting server{dots}
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're preparing your Enterprise Knowledge Assistant DEMO. 
            This may take a few moments.
          </p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-64 h-1 mx-auto bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-pulse-slow rounded-full"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
