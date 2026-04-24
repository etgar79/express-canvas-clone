import { useState, useEffect } from "react";
import { X, Play, Loader2, CircleAlert, CircleCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACTION1_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/action1`;
const MANAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-endpoints`;

type Endpoint = { id: string; name: string; status: string };
type GroupOption = { id: string; name: string; color?: string | null };
type EndpointMeta = { endpoint_id: string; alias?: string | null; office?: string | null; group_id?: string | null };
type BulkResult = { endpointId: string; endpointName: string; status: "queued" | "running" | "completed" | "failed" };

async function runScript(scriptName: string, endpointIds: string[], opts: { groupId?: string | null; password: string }) {
  const resp = await fetch(`${ACTION1_URL}?action=run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({
      scriptName,
      endpointIds,
      groupId: opts.groupId || null,
      userRole: "tech",
      triggeredBy: "tech-dashboard",
    }),
  });
  return resp.json();
}

export function RunOnAction1Panel({
  scriptName,
  password,
  onClose,
}: {
  scriptName: string;
  password: string;
  onClose: () => void;
}) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [groups, setGroups] = useState<GroupOption[]>([]);
  const [metaMap, setMetaMap] = useState<Map<string, EndpointMeta>>(new Map());
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"single" | "multi" | "group">("single");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [selectedSet, setSelectedSet] = useState<Set<string>>(new Set());
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [bulkRows, setBulkRows] = useState<BulkResult[]>([]);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    (async () => {
      try {
        const headers = { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` };
        const [epResp, mgResp, metaResp] = await Promise.all([
          fetch(`${ACTION1_URL}?action=endpoints&role=tech`, { headers }),
          fetch(MANAGE_URL, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ action: "list_groups", password }),
          }),
          fetch(MANAGE_URL, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json" },
            body: JSON.stringify({ action: "list_metadata", password }),
          }),
        ]);
        const epData = await epResp.json();
        const mgData = await mgResp.json();
        const metaData = await metaResp.json();
        if (epData.endpoints) {
          setEndpoints(epData.endpoints);
          if (epData.endpoints.length > 0) setSelectedEndpoint(epData.endpoints[0].id);
        }
        if (mgData.groups) setGroups(mgData.groups);
        if (metaData.metadata) {
          const m = new Map<string, EndpointMeta>();
          for (const row of metaData.metadata) m.set(row.endpoint_id, row);
          setMetaMap(m);
        }
      } catch {
        setResult({ success: false, message: "שגיאה בטעינת נתונים" });
      } finally {
        setLoading(false);
      }
    })();
  }, [password]);

  const targetIds = (() => {
    if (mode === "single") return selectedEndpoint ? [selectedEndpoint] : [];
    if (mode === "multi") return Array.from(selectedSet);
    if (mode === "group" && selectedGroupId) {
      return endpoints.filter(ep => metaMap.get(ep.id)?.group_id === selectedGroupId).map(ep => ep.id);
    }
    return [];
  })();

  const filteredEndpoints = filter
    ? endpoints.filter(ep => {
        const meta = metaMap.get(ep.id);
        return `${ep.name} ${meta?.alias || ""} ${meta?.office || ""}`.toLowerCase().includes(filter.toLowerCase());
      })
    : endpoints;

  const toggleEndpoint = (id: string) => {
    setSelectedSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const run = async () => {
    if (targetIds.length === 0) return;
    setRunning(true);
    setResult(null);
    setJobId(null);
    setBulkRows([]);
    try {
      const data = await runScript(scriptName, targetIds, {
        groupId: mode === "group" ? selectedGroupId : null,
        password,
      });
      if (data.success) {
        const count = data.targetCount || targetIds.length;
        setResult({ success: true, message: `✅ הסקריפט נשלח ל־${count} מחשבים. עוקב אחר ההרצה...` });
        if (data.jobId) setJobId(data.jobId);
        setBulkRows(targetIds.map(id => {
          const ep = endpoints.find(e => e.id === id);
          const meta = metaMap.get(id);
          return { endpointId: id, endpointName: meta?.alias || ep?.name || id, status: "queued" as const };
        }));
      } else {
        setResult({ success: false, message: `❌ ${data.error || "שגיאה בהרצה"}` });
      }
    } catch {
      setResult({ success: false, message: "❌ שגיאת תקשורת" });
    } finally {
      setRunning(false);
    }
  };

  // Poll status
  useEffect(() => {
    if (!jobId || jobId === "sent" || bulkRows.length === 0) return;
    let cancelled = false;
    const startedAt = Date.now();
    const poll = async () => {
      try {
        const resp = await fetch(
          `${ACTION1_URL}?action=status&jobId=${encodeURIComponent(jobId)}`,
          { headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } }
        );
        const data = await resp.json();
        if (cancelled) return;
        const perEp: Array<{ id: string; status: string }> = data.endpoints || [];
        if (perEp.length > 0) {
          setBulkRows(prev => prev.map(row => {
            const match = perEp.find(p => p.id === row.endpointId);
            if (!match) return row;
            const s = match.status.toLowerCase();
            let next: BulkResult["status"] = row.status;
            if (["running", "in_progress", "executing"].includes(s)) next = "running";
            else if (["completed", "success", "succeeded", "finished", "done"].includes(s)) next = "completed";
            else if (["failed", "error", "failure", "cancelled", "timeout"].includes(s)) next = "failed";
            return { ...row, status: next };
          }));
        } else {
          const overall = data.status as BulkResult["status"];
          if (overall === "completed" || overall === "failed") {
            setBulkRows(prev => prev.map(row => ({ ...row, status: overall })));
            return;
          }
          if (overall === "running") {
            setBulkRows(prev => prev.map(row => row.status === "queued" ? { ...row, status: "running" } : row));
          }
        }
        const allDone = bulkRows.every(r => r.status === "completed" || r.status === "failed");
        if (allDone) return;
        if (Date.now() - startedAt > 5 * 60 * 1000) return;
        setTimeout(poll, 4000);
      } catch {
        if (!cancelled) setTimeout(poll, 6000);
      }
    };
    setTimeout(poll, 2000);
    return () => { cancelled = true; };
  }, [jobId, bulkRows.length]);

  const statusIcon = (s: BulkResult["status"]) => {
    if (s === "completed") return <CircleCheck className="h-3.5 w-3.5 text-accent" />;
    if (s === "failed") return <CircleAlert className="h-3.5 w-3.5 text-destructive" />;
    if (s === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
    return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  };
  const statusLabel = (s: BulkResult["status"]) =>
    s === "completed" ? "הצליח" : s === "failed" ? "נכשל" : s === "running" ? "רץ" : "ממתין";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl space-y-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Play className="h-4 w-4 text-accent" /> הרצה ב-Action1
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{scriptName}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="סגור">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" /> טוען מחשבים וקבוצות...
          </div>
        ) : endpoints.length === 0 ? (
          <p className="text-sm text-destructive py-4 text-center">לא נמצאו מחשבים מחוברים</p>
        ) : (
          <div className="space-y-3">
            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border">
              {([
                { key: "single", label: "מחשב יחיד" },
                { key: "multi", label: "מספר מחשבים" },
                { key: "group", label: "קבוצה" },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setMode(opt.key)}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-lg transition-colors ${
                    mode === opt.key
                      ? "bg-accent text-accent-foreground font-bold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {mode === "single" && (
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50"
              >
                {endpoints.map((ep) => {
                  const meta = metaMap.get(ep.id);
                  const display = meta?.alias ? `${meta.alias} (${ep.name})` : ep.name;
                  return (
                    <option key={ep.id} value={ep.id}>
                      {display} — {ep.status}
                    </option>
                  );
                })}
              </select>
            )}

            {mode === "multi" && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="סנן לפי שם / כינוי / משרד..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50"
                />
                <div className="max-h-56 overflow-y-auto border border-border rounded-xl bg-background/50">
                  {filteredEndpoints.map((ep) => {
                    const meta = metaMap.get(ep.id);
                    const checked = selectedSet.has(ep.id);
                    return (
                      <label
                        key={ep.id}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent/5 cursor-pointer border-b border-border/50 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEndpoint(ep.id)}
                          className="accent-accent"
                        />
                        <span className="flex-1 truncate">
                          {meta?.alias ? `${meta.alias} (${ep.name})` : ep.name}
                          {meta?.office ? ` · ${meta.office}` : ""}
                        </span>
                        <span className="text-muted-foreground">{ep.status}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground">{selectedSet.size} נבחרו</p>
              </div>
            )}

            {mode === "group" && (
              groups.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-3">
                  לא הוגדרו קבוצות. הוסף קבוצות בלשונית "מחשבים".
                </p>
              ) : (
                <div className="space-y-1">
                  <select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50"
                  >
                    <option value="">בחר קבוצה...</option>
                    {groups.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                  {selectedGroupId && (
                    <p className="text-[11px] text-muted-foreground">
                      {targetIds.length} מחשבים בקבוצה זו
                    </p>
                  )}
                </div>
              )
            )}

            <Button
              onClick={run}
              disabled={running || targetIds.length === 0}
              className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {running ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" /> מריץ...</>
              ) : (
                <><Play className="h-4 w-4 mr-1" /> הרץ על {targetIds.length || 0} מחשבים</>
              )}
            </Button>
          </div>
        )}

        {result && (
          <p className={`text-sm ${result.success ? "text-accent" : "text-destructive"}`}>
            {result.message}
          </p>
        )}

        {bulkRows.length > 0 && (
          <div className="space-y-1 max-h-56 overflow-y-auto border border-border/50 rounded-xl bg-background/50 p-2">
            <p className="text-[11px] font-bold text-foreground/70 mb-1">התקדמות פר־מחשב:</p>
            {bulkRows.map(row => (
              <div key={row.endpointId} className="flex items-center gap-2 text-xs">
                {statusIcon(row.status)}
                <span className="flex-1 truncate">{row.endpointName}</span>
                <span className="text-muted-foreground">{statusLabel(row.status)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
