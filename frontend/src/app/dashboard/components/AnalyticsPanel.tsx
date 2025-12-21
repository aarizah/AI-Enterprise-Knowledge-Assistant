import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle2, Zap, DollarSign, Info } from "lucide-react";
import { settings } from "@/lib/settings";

interface AnalyticsData {
  citation_rate: number;
  no_answer_rate: number;
  avg_response_time: number;
  query_volume: number;
  high_confidence_rate: number;
  medium_confidence_rate: number;
  low_confidence_rate: number;
  vector_cost: number;
  llm_total_cost: number;
  vector_retrieval_time_avg: number;
  llm_response_time_avg: number;
  vector_retrieval_time_p95: number;
  llm_response_time_p95: number;
  response_time_p95: number;
  total_indexing_cost: number;
}

function AnalyticsPanel({ onBack }: { onBack: () => void }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${settings.backendUrl}/analytics/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="w-full h-full min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center">
        <div className="text-destructive">Error: {error || "No data available"}</div>
      </div>
    );
  }

  // Map backend data to display format
  const citationRatePercent = Math.round(analyticsData.citation_rate * 100);
  const noAnswerRatePercent = Math.round(analyticsData.no_answer_rate * 100);
  const avgResponseTime = analyticsData.avg_response_time.toFixed(2);
  const monthlyCost = (analyticsData.vector_cost + analyticsData.llm_total_cost + analyticsData.total_indexing_cost).toFixed(2);

  const responseQuality = [
    { 
      label: "High Confidence (>70%)", 
      value: Math.round(analyticsData.high_confidence_rate * 100), 
      color: "bg-chart-2" 
    },
    { 
      label: "Medium Confidence (50-70%)", 
      value: Math.round(analyticsData.medium_confidence_rate * 100), 
      color: "bg-primary" 
    },
    { 
      label: "Low Confidence (<50%)", 
      value: Math.round(analyticsData.low_confidence_rate * 100), 
      color: "bg-chart-5" 
    },
    { 
      label: "No Answer (No sources found)", 
      value: noAnswerRatePercent, 
      color: "bg-muted" 
    },
  ];

  const costAnalysis = [
    { label: "LLM Queries", value: analyticsData.llm_total_cost },
    { label: "Vector Search", value: analyticsData.vector_cost },
    { label: "Document Indexing", value: analyticsData.total_indexing_cost },
  ];

  // Generate mock query volume (since we don't have daily breakdown)
  const queryVolume = Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 10);
  
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
          <span className=" text-foreground tracking-tight">History Analytics</span>
          <span className="text-sm text-muted-foreground -mt-1">Performance, quality, and cost metrics</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 flex flex-col gap-8">
        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Citation Rate"
            value={`${citationRatePercent}%`}
            change={`${analyticsData.query_volume} queries processed`}
            icon={<CheckCircle2 className="w-5 h-5 text-chart-2" />}
          />
          <StatCard
            title="Avg Response Time"
            value={`${avgResponseTime}s`}
            change={`p95: ${analyticsData.response_time_p95.toFixed(2)}s`}
            icon={<Zap className="w-5 h-5 text-chart-4" />}
          />
          <StatCard
            title="Total Cost"
            value={`$${monthlyCost}`}
            change="LLM + Vector + Indexing"
            icon={<DollarSign className="w-5 h-5 text-primary" />}
          />
          <StatCard
            title={'"No Answer" Rate'}
            value={`${noAnswerRatePercent}%`}
            change="Better than hallucinating"
            icon={<Info className="w-5 h-5 text-muted-foreground" />}
          />
        </div>

        {/* Query Volume & Response Quality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 text-lg">Query Volume</div>
            <div className="text-xs text-muted-foreground mb-2">Total queries: {analyticsData.query_volume}</div>
            <div className="flex items-end gap-1 h-24">
              {queryVolume.map((v, i) => (
                <div
                  key={i}
                  className={`w-2 rounded-t ${i === queryVolume.length - 1 ? "bg-primary" : "bg-muted"}`}
                  style={{ height: `${v * 2}px` }}
                />
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 text-lg">Response Quality Breakdown</div>
            <div className="text-xs text-muted-foreground mb-2">How confident and accurate are responses</div>
            <div className="flex flex-col gap-3">
              {responseQuality.map((q) => (
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
                value={Math.round(analyticsData.vector_retrieval_time_avg * 1000)}
                p95={Math.round(analyticsData.vector_retrieval_time_p95 * 1000)}
                colorClass="bg-chart-2"
                unit="ms"
              />
              <PerfBar
                label="LLM Generation"
                value={Math.round(analyticsData.llm_response_time_avg * 1000)}
                p95={Math.round(analyticsData.llm_response_time_p95 * 1000)}
                colorClass="bg-primary"
                unit="ms"
              />
            </div>
          </div>
          <div className="bg-card rounded-2xl shadow-sm p-6 flex flex-col gap-2 border border-border">
            <div className="font-semibold text-foreground/80 mb-2 text-lg">Cost Analysis</div>
            <div className="flex flex-col gap-3">
              {costAnalysis.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className="flex-1 text-xs text-muted-foreground">{c.label}</div>
                  <div className="w-2/3 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((c.value / parseFloat(monthlyCost)) * 100, 100)}%` }}></div>
                  </div>
                  <div className="text-xs text-muted-foreground w-12 text-right">${c.value.toFixed(4)}</div>
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
