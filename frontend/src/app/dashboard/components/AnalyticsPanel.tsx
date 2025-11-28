import React from "react";
import { ArrowLeft, CheckCircle2, Zap, DollarSign, Info } from "lucide-react";
// Fake/mock data for analytics
const analyticsData = {
  citationRate: 92,
  citationRateChange: 5,
  avgResponseTime: 1.2,
  avgResponseTimeChange: -0.3,
  monthlyCost: 124,
  monthlyCostChange: -35,
  noAnswerRate: 3,
  queryVolume: Array.from({ length: 30 }, (_, i) => Math.floor(20 + Math.random() * 20)),
  responseQuality: [
    { label: "High Confidence (90-100%)", value: 68, color: "bg-chart-2" },
    { label: "Medium Confidence (70-89%)", value: 24, color: "bg-primary" },
    { label: "Low Confidence (50-69%)", value: 5, color: "bg-chart-5" },
    { label: "No Answer (No sources found)", value: 3, color: "bg-muted" },
  ],
  systemPerformance: {
    vectorSearch: 45,
    vectorSearchP95: 68,
    llmGeneration: 890,
    llmGenerationP95: 1800,
    cacheHitRate: 78,
    cacheSavings: 43,
  },
  costAnalysis: [
    { label: "GPT-4 Queries", value: 89.2 },
    { label: "Embeddings Generation", value: 24.5 },
  ],
};
function AnalyticsPanel({ onBack }: { onBack: () => void }) {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-6 px-8 py-6 border-b bg-card/95 ">
        <button
          className="flex items-center gap-2 text-base rounded-md p-2 text-muted-foreground hover:text-primary hover:bg-muted font-medium transition"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Chat</span>
        </button>
        <div className="flex flex-col">
          <span className=" text-foreground tracking-tight">Analytics</span>
          <span className="text-sm text-muted-foreground -mt-1">Performance, quality, and cost metrics</span>
        </div>
        
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 flex flex-col gap-8">
        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Citation Rate"
            value={`${analyticsData.citationRate}%`}
            change={`+${analyticsData.citationRateChange}% vs last month`}
            icon={<CheckCircle2 className="w-5 h-5 text-chart-2" />}
          />
          <StatCard
            title="Avg Response Time"
            value={`${analyticsData.avgResponseTime}s`}
            change={`~${analyticsData.avgResponseTimeChange}s improvement`}
            icon={<Zap className="w-5 h-5 text-chart-4" />}
          />
          <StatCard
            title="Monthly Cost"
            value={`$${analyticsData.monthlyCost}`}
            change={`~${analyticsData.monthlyCostChange}% with caching`}
            icon={<DollarSign className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title={'"No Answer" Rate'}
            value={`${analyticsData.noAnswerRate}%`}
            change="Better than hallucinating"
            icon={<Info className="w-5 h-5 text-muted-foreground" />}
          />
        </div>

        {/* Query Volume & Response Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 text-lg">Query Volume</div>
            <div className="text-xs text-muted-foreground mb-2">Daily queries over the last 30 days</div>
            <div className="flex items-end gap-1 h-24">
              {analyticsData.queryVolume.map((v, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-t ${i === analyticsData.queryVolume.length - 1 ? "bg-primary" : "bg-muted"}`}
                  style={{ height: `${v * 2}px` }}
                />
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 text-lg">Response Quality Breakdown</div>
            <div className="text-xs text-muted-foreground mb-2">How confident and accurate are responses</div>
            <div className="flex flex-col gap-3">
              {analyticsData.responseQuality.map((q) => (
                <div key={q.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${q.color}`}></div>
                  <div className="flex-1 text-xs text-muted-foreground">{q.label}</div>
                  <div className="w-1/2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`${q.color} h-2 rounded-full`} style={{ width: `${q.value}%` }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-8 text-right">{q.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Performance & Cost Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 mb-2 text-lg">System Performance</div>
            <div className="flex flex-col gap-3">
              <PerfBar
                label="Vector Search"
                value={analyticsData.systemPerformance.vectorSearch}
                p95={analyticsData.systemPerformance.vectorSearchP95}
                colorClass="bg-chart-2"
                unit="ms"
              />
              <PerfBar
                label="LLM Generation"
                value={analyticsData.systemPerformance.llmGeneration}
                p95={analyticsData.systemPerformance.llmGenerationP95}
                colorClass="bg-primary"
                unit="ms"
              />
              <PerfBar
                label="Cache Hit Rate"
                value={analyticsData.systemPerformance.cacheHitRate}
                p95={null}
                colorClass="bg-primary"
                unit="%"
                extra={`Saving ~$${analyticsData.systemPerformance.cacheSavings}/month`}
              />
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 mb-2 text-lg">Cost Analysis</div>
            <div className="flex flex-col gap-3">
              {analyticsData.costAnalysis.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className="flex-1 text-xs text-muted-foreground">{c.label}</div>
                  <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${c.value * 0.8}%` }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-12 text-right">${c.value.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl p-4 flex flex-col gap-1 min-h-[90px] border border-border">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
        {icon}
        {title}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-chart-2">{change}</div>
    </div>
  );
}

function PerfBar({ label, value, p95, colorClass, unit, extra }: { label: string; value: number; p95: number | null; colorClass: string; unit: string; extra?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="ml-auto font-semibold text-foreground">{value}{unit}</span>
        {p95 !== null && <span className="text-muted-foreground">p95: {p95}{unit}</span>}
        {extra && <span className="text-chart-2 ml-2">{extra}</span>}
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div className={`${colorClass} h-2 rounded-full`} style={{ width: `${Math.min(value, 100)}%` }}></div>
      </div>
    </div>
  );
}

export default AnalyticsPanel;
