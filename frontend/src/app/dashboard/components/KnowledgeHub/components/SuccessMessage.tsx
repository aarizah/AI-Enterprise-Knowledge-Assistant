import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="bg-chart-2/10 border border-chart-2/30 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <CheckCircle2 className="w-5 h-5 text-chart-2" />
      <p className="text-sm font-medium text-chart-2">{message}</p>
    </div>
  );
}
