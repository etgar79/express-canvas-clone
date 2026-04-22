import { useEffect, useState } from "react";
import { Loader2, BarChart3, ThumbsUp, ThumbsDown, Activity, AlertCircle, ScrollText, Check, Users, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const SETTINGS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/settings`;

type ScriptStat = { suggested: number; copied: number; run: number; explained: number; up: number; down: number };
type Miss = { id: string; question: string; user_role: string | null; resolved: boolean; created_at: string };
type AuditEntry = { id: string; action: string; resource_type: string | null; resource_name: string | null; actor: string; details: Record<string, unknown> | null; created_at: string };
type AnalyticsData = {
  stats: { totalUsageEvents: number; totalRatings: number; totalMisses: number; unresolvedMisses: number };
  scriptStats: Record<string, ScriptStat>;
  dailyActivity: Record<string, number>;
  recentMisses: Miss[];
  recentAudit: AuditEntry[];
};

const ACTION_LABELS: Record<string, string> = {
  script_create: "סקריפט נוצר",
  script_update: "סקריפט עודכן",
  script_delete: "סקריפט נמחק",
  settings_update: "הגדרות עודכנו",
  sync_from_sheets: "סנכרון מגיליון",
  sync_from_onedrive: "סנכרון מ-OneDrive",
  miss_resolved: "שאלה סומנה כטופלה",
};

function formatRelative(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "לפני רגע";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} ד'`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} ש'`;
  return `לפני ${Math.floor(diff / 86400)} ימים`;
}

export function AnalyticsTab({ password }: { password: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<7 | 30 | 90>(30);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(SETTINGS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ action: "get_analytics", password, days }),
      });
      const json = await resp.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בטעינת הנתונים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [days]);

  const resolveMiss = async (id: string) => {
    await fetch(SETTINGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify({ action: "resolve_miss", password, missId: id }),
    });
    load();
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> טוען אנליטיקה...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
        ⚠️ {error}
      </div>
    );
  }

  if (!data) return null;

  // Top scripts sorted by suggested+copied+run
  const topScripts = Object.entries(data.scriptStats)
    .map(([name, s]) => ({ name, ...s, total: s.suggested + s.copied + s.run + s.explained }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Daily activity sorted asc
  const dailyEntries = Object.entries(data.dailyActivity).sort(([a], [b]) => a.localeCompare(b));
  const maxDaily = Math.max(1, ...dailyEntries.map(([, v]) => v));

  return (
    <div className="space-y-5">
      {/* Period selector + refresh */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {([7, 30, 90] as const).map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${days === d ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {d} ימים אחרונים
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="rounded-xl">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard icon={<Activity className="h-4 w-4" />} label="פעולות בסקריפטים" value={data.stats.totalUsageEvents} color="accent" />
        <KpiCard icon={<MessageSquare className="h-4 w-4" />} label="דירוגים" value={data.stats.totalRatings} color="primary" />
        <KpiCard icon={<AlertCircle className="h-4 w-4" />} label="שאלות ללא מענה" value={data.stats.totalMisses} sub={`${data.stats.unresolvedMisses} פתוחות`} color="destructive" />
        <KpiCard icon={<Users className="h-4 w-4" />} label="ימי פעילות" value={dailyEntries.length} color="accent" />
      </div>

      {/* Daily activity chart */}
      {dailyEntries.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" /> פעילות יומית
          </h3>
          <div className="flex items-end gap-1 h-32" dir="ltr">
            {dailyEntries.map(([day, count]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1 group" title={`${day}: ${count} פעולות`}>
                <span className="text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">{count}</span>
                <div className="w-full bg-accent/70 hover:bg-accent rounded-t transition-colors" style={{ height: `${(count / maxDaily) * 100}%`, minHeight: "2px" }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-muted-foreground tabular-nums" dir="ltr">
            <span>{dailyEntries[0][0].slice(5)}</span>
            <span>{dailyEntries[dailyEntries.length - 1][0].slice(5)}</span>
          </div>
        </div>
      )}

      {/* Top scripts */}
      {topScripts.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-accent" /> סקריפטים פופולריים
          </h3>
          <div className="space-y-2">
            {topScripts.map(s => (
              <div key={s.name} className="flex items-center justify-between gap-2 py-1.5 border-b border-border last:border-0">
                <span className="text-sm text-foreground flex-1 min-w-0 truncate">{s.name}</span>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums shrink-0">
                  <span title="הוצע">💡 {s.suggested}</span>
                  <span title="הועתק">📋 {s.copied}</span>
                  <span title="הוסבר">✨ {s.explained}</span>
                  <span title="הורץ">▶️ {s.run}</span>
                  {s.up > 0 && <span className="text-accent flex items-center gap-0.5"><ThumbsUp className="h-2.5 w-2.5" /> {s.up}</span>}
                  {s.down > 0 && <span className="text-destructive flex items-center gap-0.5"><ThumbsDown className="h-2.5 w-2.5" /> {s.down}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent bot misses */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" /> שאלות שהבוט לא ידע לענות
          <span className="text-xs font-normal text-muted-foreground">(הזדמנות לסקריפט חדש!)</span>
        </h3>
        {data.recentMisses.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">🎉 הבוט ענה על הכל!</p>
        ) : (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {data.recentMisses.map(m => (
              <div key={m.id} className={`flex items-start gap-2 p-2 rounded-lg border ${m.resolved ? "bg-muted/30 border-border opacity-60" : "bg-destructive/5 border-destructive/20"}`}>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${m.resolved ? "line-through text-muted-foreground" : "text-foreground"}`}>{m.question}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {formatRelative(m.created_at)} · {m.user_role || "אנונימי"}
                  </span>
                </div>
                {!m.resolved && (
                  <button
                    onClick={() => resolveMiss(m.id)}
                    className="shrink-0 p-1 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                    title="סמן כטופלה"
                    aria-label="סמן כטופלה"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit log */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-primary" /> יומן פעולות
        </h3>
        {data.recentAudit.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">אין פעולות עדיין</p>
        ) : (
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {data.recentAudit.map(a => (
              <div key={a.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-border last:border-0 text-xs">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-medium text-foreground/80 shrink-0">{ACTION_LABELS[a.action] || a.action}</span>
                  {a.resource_name && <span className="text-muted-foreground truncate" dir="auto">{a.resource_name}</span>}
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{formatRelative(a.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: number; sub?: string; color: "accent" | "primary" | "destructive" }) {
  const colorMap = {
    accent: "text-accent bg-accent/10 border-accent/20",
    primary: "text-primary bg-primary/10 border-primary/20",
    destructive: "text-destructive bg-destructive/10 border-destructive/20",
  };
  return (
    <div className="bg-card border border-border rounded-2xl p-3">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border mb-2 ${colorMap[color]}`}>{icon}</div>
      <div className="text-2xl font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
      {sub && <div className="text-[10px] text-muted-foreground/80 mt-0.5">{sub}</div>}
    </div>
  );
}
