"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";


interface LoadingBarProps {
  text?: string;
}


const EKA_STEPS = [
  "Analyzing the context of your question",
  "Searching the business knowledge base",
  "Checking relevant sources",
  "Generating a personalized answer",
];

export function LoadingBar({ text }: LoadingBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = "0%";
      setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.transition = "width 2.2s cubic-bezier(0.4, 0, 0.2, 1)";
          barRef.current.style.width = "100%";
        }
      }, 100);
    }
    // Animar pasos de EKA
    stepRef.current = 0;
    setStep(0);
    const interval = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % EKA_STEPS.length;
      setStep(stepRef.current);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center w-full py-2">
      <Card className="w-full max-w-md px-4 py-3 bg-background/95 border border-border/40 shadow rounded-xl flex flex-col items-center">
        <div className="flex items-center gap-2 mb-1">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">{text || "EKA está trabajando en tu respuesta..."}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-1">
          <div
            ref={barRef}
            className="h-2 bg-primary rounded-full transition-all"
            style={{ width: "0%" }}
          />
        </div>
        <div className="mt-2 text-xs text-center text-muted-foreground/80 font-normal min-h-[18px]">
          {EKA_STEPS[step]}
        </div>
      </Card>
    </div>
  );
}
