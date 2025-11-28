import React from "react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  hint?: string;
}

export default function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm p-6 border border-border flex flex-col gap-3">
      <div className="text-muted-foreground text-sm font-normal">{title}</div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      {hint && <div className="text-xs text-chart-2 font-normal">{hint}</div>}
    </div>
  );
}
