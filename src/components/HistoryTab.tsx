import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, History, CheckCircle2, XCircle, Clock, AlertCircle, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const MANAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-endpoints`;

type Execution = {
  id: string;
  script_name: string;
  endpoint_id: string | null;
  endpoint_name: string | null;
  endpoint_alias: string | null;
  group_name: string | null;
  job_id: string | null;
  status: string;
  user_role: string | null;
  triggered_by: string | null;
  result_summary: string | null;
  error_message: string | null;
  duration_ms: number | null;
  created_at: string;
  completed_at: string | null;
};

type ScriptStats = Record<string, { total: number; success: number; failed: number }>;

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דק'`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שע'`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    completed: { label: "הצליח", icon: CheckCircle2, className: "bg-accent/10 text-accent border-accent/30" },
    failed: { label: "נכשל", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/30" },
    queued: { label: "בתור", icon: Clock, className: "bg-muted text-muted-foreground border-border" },
    running: { label: "רץ", icon: Loader2, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" },
  }[status] || { label: status, icon: AlertCircle, className: "bg-muted text-muted-foreground border-border" };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${config.className}`}>
      <Icon className={`h-2.5 w-2.5 ${status === "running" ? "animate-spin" : ""}`} /> {config.label}
    </span>
  );
}

export function HistoryTab({ password }: { password: string }) {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [stats, setStats] = useState<ScriptStats>({});
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterScript, setFilterScript] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      const resp = await fetch(MANAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: "list_executions",
          password,
          status: filterStatus,
          scriptName: filterScript || undefined,
          limit: 200,
        }),
      });
      const data = await resp.json();
      setExecutions(data.executions || []);
      setStats(data.stats || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterStatus]);

  const scriptNames = useMemo(() => {
    const set = new Set(executions.map(e => e.script_name));
    return Array.from(set).sort();
  }, [executions]);

  const overallStats = useMemo(() => {
    const total = Object.values(stats).reduce((sum, s) => sum + s.total, 0);
    const success = Object.values(stats).reduce((sum, s) => sum + s.success, 0);
    const failed = Object.values(stats).reduce((sum, s) => sum + s.failed, 0);
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
    return { total, success, failed, successRate };
  }, [stats]);

  const topScripts = useMemo(() => {
    return Object.entries(stats)
      .map(([name, s]) => ({ name, ...s, rate: s.total > 0 ? Math.round((s.success / s.total) * 100) : 0 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [stats]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={load} disabled={loading} variant="outline" size="sm" className="rounded-xl">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          רענן
        </Button>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="completed">הצליח</option>
          <option value="failed">נכשל</option>
          <option value="queued">בתור</option>
          <option value="running">רץ</option>
        </select>
        {scriptNames.length > 0 && (
          <select
            value={filterScript}
            onChange={(e) => { setFilterScript(e.target.value); setTimeout(load, 0); }}
            className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50"
          >
            <option value="">כל הסקריפטים</option>
            {scriptNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        )}
      </div>

      {/* Overall stats (last 30 days) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="סה״כ הרצות (30 יום)" value={overallStats.total} icon={<History className="h-4 w-4" />} color="primary" />
        <StatBox label="הצלחות" value={overallStats.success} icon={<CheckCircle2 className="h-4 w-4" />} color="accent" />
        <StatBox label="כשלונות" value={overallStats.failed} icon={<XCircle className="h-4 w-4" />} color="destructive" />
        <StatBox label="אחוז הצלחה" value={`${overallStats.successRate}%`} icon={<TrendingUp className="h-4 w-4" />} color={overallStats.successRate >= 80 ? "accent" : overallStats.successRate >= 50 ? "primary" : "destructive"} />
      </div>

      {/* Top scripts by usage */}
      {topScripts.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" /> סקריפטים מובילים (30 יום)
          </h3>
          <div className="space-y-2">
            {topScripts.map(s => (
              <div key={s.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium truncate flex-1 ml-2">{s.name}</span>
                  <span className="text-muted-foreground tabular-nums shrink-0">
                    {s.success}/{s.total} ({s.rate}%)
                  </span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full transition-all ${s.rate >= 80 ? "bg-accent" : s.rate >= 50 ? "bg-yellow-500" : "bg-destructive"}`} style={{ width: `${s.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executions list */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Filter className="h-4 w-4 text-accent" /> הרצות אחרונות ({executions.length})
        </h3>
        {loading && executions.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> טוען...
          </div>
        ) : executions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">אין הרצות מתועדות עדיין</p>
          </div>
        ) : (
          <div className="space-y-1">
            {executions.map(ex => (
              <div key={ex.id} className="bg-card border border-border rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={ex.status} />
                  <span className="text-sm font-medium text-foreground">{ex.script_name}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs text-foreground/80">
                    {ex.endpoint_alias || ex.endpoint_name || ex.group_name || "—"}
                  </span>
                  {ex.user_role && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {ex.user_role === "tech" ? "טכנאי" : ex.user_role === "client" ? "לקוח" : ex.user_role}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground mr-auto">{timeAgo(ex.created_at)}</span>
                </div>
                {ex.error_message && (
                  <div className="text-xs text-destructive bg-destructive/5 px-2 py-1 rounded">
                    ⚠ {ex.error_message}
                  </div>
                )}
                {ex.duration_ms && (
                  <div className="text-[10px] text-muted-foreground">משך: {(ex.duration_ms / 1000).toFixed(1)} שניות</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, icon, color }: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: "primary" | "accent" | "destructive";
}) {
  const colorClass = color === "accent" ? "text-accent bg-accent/10" :
                     color === "destructive" ? "text-destructive bg-destructive/10" :
                     "text-primary bg-primary/10";
  return (
    <div className="bg-card border border-border rounded-xl p-3 space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>{icon}</div>
        <span className="text-[11px] text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold text-foreground tabular-nums">{value}</div>
    </div>
  );
}
