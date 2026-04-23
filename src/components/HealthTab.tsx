import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, Activity, Wifi, WifiOff, Clock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACTION1_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/action1`;
const MANAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-endpoints`;

type Endpoint = {
  id: string;
  name: string;
  status: string;
  lanIp?: string;
  lastSeen?: string;
  platform?: string;
};

type Metadata = {
  endpoint_id: string;
  alias?: string | null;
  office?: string | null;
};

function timeAgo(iso?: string): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "—";
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דק'`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שע'`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

function isOnline(status: string): boolean {
  const s = (status || "").toLowerCase();
  return s.includes("online") || s.includes("connect") || s === "active";
}

function isStale(lastSeen?: string): boolean {
  if (!lastSeen) return false;
  const ms = Date.now() - new Date(lastSeen).getTime();
  return ms > 24 * 60 * 60 * 1000; // 24h
}

export function HealthTab({ password }: { password: string }) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [metadata, setMetadata] = useState<Map<string, Metadata>>(new Map());
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [epResp, metaResp] = await Promise.all([
        fetch(`${ACTION1_URL}?action=endpoints&role=tech`, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        }),
        fetch(MANAGE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ action: "list_metadata", password }),
        }),
      ]);
      const epData = await epResp.json();
      const metaData = await metaResp.json();
      setEndpoints(epData.endpoints || []);
      const map = new Map<string, Metadata>();
      for (const m of metaData.metadata || []) map.set(m.endpoint_id, m);
      setMetadata(map);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [autoRefresh]);

  const stats = useMemo(() => {
    const total = endpoints.length;
    const online = endpoints.filter(e => isOnline(e.status)).length;
    const offline = total - online;
    const stale = endpoints.filter(e => isStale(e.lastSeen)).length;
    return { total, online, offline, stale };
  }, [endpoints]);

  const byOffice = useMemo(() => {
    const groups: Record<string, { online: number; offline: number; total: number }> = {};
    for (const ep of endpoints) {
      const office = metadata.get(ep.id)?.office || "ללא שיוך";
      if (!groups[office]) groups[office] = { online: 0, offline: 0, total: 0 };
      groups[office].total++;
      if (isOnline(ep.status)) groups[office].online++;
      else groups[office].offline++;
    }
    return Object.entries(groups).sort((a, b) => b[1].total - a[1].total);
  }, [endpoints, metadata]);

  const offlineList = endpoints.filter(e => !isOnline(e.status));
  const staleList = endpoints.filter(e => isStale(e.lastSeen));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={load} disabled={loading} variant="outline" size="sm" className="rounded-xl">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          רענן
        </Button>
        <button
          onClick={() => setAutoRefresh(a => !a)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${autoRefresh ? "bg-accent/10 text-accent border-accent/30" : "bg-background text-muted-foreground border-border hover:text-foreground"}`}
        >
          רענון אוטומטי כל 30 שניות {autoRefresh ? "✓" : ""}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiBox icon={<Activity className="h-4 w-4" />} label="סך הכל" value={stats.total} color="primary" />
        <KpiBox icon={<Wifi className="h-4 w-4" />} label="אונליין" value={stats.online} color="accent" />
        <KpiBox icon={<WifiOff className="h-4 w-4" />} label="אופליין" value={stats.offline} color="muted" />
        <KpiBox icon={<Clock className="h-4 w-4" />} label="לא דיווחו 24 שע'" value={stats.stale} color={stats.stale > 0 ? "destructive" : "muted"} />
      </div>

      {/* By office */}
      {byOffice.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent" /> סטטוס לפי משרד
          </h3>
          <div className="space-y-2">
            {byOffice.map(([office, s]) => {
              const pct = s.total > 0 ? Math.round((s.online / s.total) * 100) : 0;
              return (
                <div key={office} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">{office}</span>
                    <span className="text-muted-foreground">
                      {s.online}/{s.total} אונליין ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full transition-all ${pct === 100 ? "bg-accent" : pct >= 50 ? "bg-yellow-500" : "bg-destructive"}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Offline endpoints */}
      {offlineList.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-muted-foreground" /> מחשבים אופליין ({offlineList.length})
          </h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {offlineList.map(ep => {
              const meta = metadata.get(ep.id);
              return (
                <div key={ep.id} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border text-xs">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/40 shrink-0" />
                  <span className="text-foreground font-medium truncate flex-1">{meta?.alias || ep.name}</span>
                  {meta?.office && <span className="text-muted-foreground">{meta.office}</span>}
                  <span className="text-muted-foreground shrink-0">{timeAgo(ep.lastSeen)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stale endpoints */}
      {staleList.length > 0 && (
        <div className="bg-card border border-destructive/30 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-bold text-destructive flex items-center gap-2">
            <Clock className="h-4 w-4" /> לא דיווחו מעל 24 שעות ({staleList.length})
          </h3>
          <p className="text-xs text-muted-foreground">מחשבים אלה לא יצרו קשר עם Action1 — ייתכן שכבויים, מחוץ לרשת, או שיש בעיה בסוכן.</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {staleList.map(ep => {
              const meta = metadata.get(ep.id);
              return (
                <div key={ep.id} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border text-xs">
                  <span className="text-foreground font-medium truncate flex-1">{meta?.alias || ep.name}</span>
                  {meta?.contact_phone && <span className="text-muted-foreground" dir="ltr">{meta.contact_phone}</span>}
                  <span className="text-destructive shrink-0">{timeAgo(ep.lastSeen)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {endpoints.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          <Activity className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">אין מחשבים. ודא שה-Action1 מוגדר נכון בלשונית "הגדרות".</p>
        </div>
      )}
    </div>
  );
}

function KpiBox({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "primary" | "accent" | "destructive" | "muted";
}) {
  const colorClass = color === "accent" ? "text-accent bg-accent/10" :
                     color === "destructive" ? "text-destructive bg-destructive/10" :
                     color === "muted" ? "text-muted-foreground bg-muted" :
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
