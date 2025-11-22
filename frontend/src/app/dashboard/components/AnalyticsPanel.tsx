import React from "react";
import { ArrowLeft } from "lucide-react";
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
    { label: "High Confidence (90-100%)", value: 68, color: "bg-emerald-400" },
    { label: "Medium Confidence (70-89%)", value: 24, color: "bg-violet-500" },
    { label: "Low Confidence (50-69%)", value: 5, color: "bg-orange-400" },
    { label: "No Answer (No sources found)", value: 3, color: "bg-slate-200" },
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
      <div className="flex items-center gap-6 px-8 py-6 border-b bg-white/95">
        <button
          className="flex items-center gap-2 text-base text-slate-600 hover:text-violet-600 font-medium transition"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Chat</span>
        </button>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-900 tracking-tight">Analytics</span>
          <span className="text-sm text-slate-400 -mt-1">Performance, quality, and cost metrics</span>
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
            icon={<span className="text-emerald-500"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#10B981" fillOpacity="0.12"/><path d="M7.5 10.5l2 2 3-4" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
          />
          <StatCard
            title="Avg Response Time"
            value={`${analyticsData.avgResponseTime}s`}
            change={`~${analyticsData.avgResponseTimeChange}s improvement`}
            icon={<span className="text-yellow-400"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FBBF24" fillOpacity="0.12"/><path d="M10 5v5l3 3" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
          />
          <StatCard
            title="Monthly Cost"
            value={`$${analyticsData.monthlyCost}`}
            change={`~${analyticsData.monthlyCostChange}% with caching`}
            icon={<span className="text-violet-500"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#8B5CF6" fillOpacity="0.12"/><path d="M10 6v8M7 10h6" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
          />
          <StatCard
            title={'"No Answer" Rate'}
            value={`${analyticsData.noAnswerRate}%`}
            change="Better than hallucinating"
            icon={<span className="text-slate-400"><svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#64748B" fillOpacity="0.12"/><path d="M10 7v3m0 3h.01" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
          />
        </div>

        {/* Query Volume & Response Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-slate-100">
            <div className="font-semibold text-slate-700 text-lg">Query Volume</div>
            <div className="text-xs text-slate-400 mb-2">Daily queries over the last 30 days</div>
            <div className="flex items-end gap-1 h-24">
              {analyticsData.queryVolume.map((v, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-t ${i === analyticsData.queryVolume.length - 1 ? "bg-violet-500" : "bg-slate-200"}`}
                  style={{ height: `${v * 2}px` }}
                />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-slate-100">
            <div className="font-semibold text-slate-700 text-lg">Response Quality Breakdown</div>
            <div className="text-xs text-slate-400 mb-2">How confident and accurate are responses</div>
            <div className="flex flex-col gap-3">
              {analyticsData.responseQuality.map((q) => (
                <div key={q.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${q.color}`}></div>
                  <div className="flex-1 text-xs text-slate-600">{q.label}</div>
                  <div className="w-1/2 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`${q.color} h-2 rounded-full`} style={{ width: `${q.value}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-500 w-8 text-right">{q.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Performance & Cost Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-slate-100">
            <div className="font-semibold text-slate-700 mb-2 text-lg">System Performance</div>
            <div className="flex flex-col gap-3">
              <PerfBar
                label="Vector Search"
                value={analyticsData.systemPerformance.vectorSearch}
                p95={analyticsData.systemPerformance.vectorSearchP95}
                color="emerald"
                unit="ms"
              />
              <PerfBar
                label="LLM Generation"
                value={analyticsData.systemPerformance.llmGeneration}
                p95={analyticsData.systemPerformance.llmGenerationP95}
                color="violet"
                unit="ms"
              />
              <PerfBar
                label="Cache Hit Rate"
                value={analyticsData.systemPerformance.cacheHitRate}
                p95={null}
                color="violet"
                unit="%"
                extra={`Saving ~$${analyticsData.systemPerformance.cacheSavings}/month`}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-slate-100">
            <div className="font-semibold text-slate-700 mb-2 text-lg">Cost Analysis</div>
            <div className="flex flex-col gap-3">
              {analyticsData.costAnalysis.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className="flex-1 text-xs text-slate-600">{c.label}</div>
                  <div className="w-2/3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-violet-400 h-2 rounded-full" style={{ width: `${c.value * 0.8}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-500 w-12 text-right">${c.value.toFixed(2)}</div>
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
    <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1 min-h-[90px]">
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        {icon}
        {title}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-emerald-500">{change}</div>
    </div>
  );
}

function PerfBar({ label, value, p95, color, unit, extra }: { label: string; value: number; p95: number | null; color: string; unit: string; extra?: string }) {
  const barColor = color === "emerald" ? "bg-emerald-400" : "bg-violet-500";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>{label}</span>
        <span className="ml-auto font-semibold text-slate-800">{value}{unit}</span>
        {p95 !== null && <span className="text-slate-400">p95: {p95}{unit}</span>}
        {extra && <span className="text-emerald-500 ml-2">{extra}</span>}
      </div>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div className={`${barColor} h-2 rounded-full`} style={{ width: `${Math.min(value, 100)}%` }}></div>
      </div>
    </div>
  );
}

export default AnalyticsPanel;
