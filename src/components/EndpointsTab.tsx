import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Save, X, Pencil, Trash2, Plus, Tag, Building2, RefreshCw, Users, Phone, FileText, Activity, Terminal, Play, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MANAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-endpoints`;
const ACTION1_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/action1`;

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
  endpoint_name: string;
  alias?: string | null;
  office?: string | null;
  client?: string | null;
  contact_phone?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  group_id?: string | null;
};

type Group = {
  id?: string;
  name: string;
  description?: string | null;
  color?: string | null;
};

async function manageCall(password: string, action: string, extra: Record<string, unknown> = {}) {
  const resp = await fetch(MANAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ action, password, ...extra }),
  });
  return resp.json();
}

export function EndpointsTab({ password }: { password: string }) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [metadata, setMetadata] = useState<Map<string, Metadata>>(new Map());
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterOffice, setFilterOffice] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [editing, setEditing] = useState<{ ep: Endpoint; meta: Metadata } | null>(null);
  const [showGroups, setShowGroups] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | "new" | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Fetch endpoints from Action1
      const epResp = await fetch(`${ACTION1_URL}?action=endpoints&role=tech`, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      const epData = await epResp.json();
      setEndpoints(epData.endpoints || []);

      const [metaData, groupsData] = await Promise.all([
        manageCall(password, "list_metadata"),
        manageCall(password, "list_groups"),
      ]);

      const metaMap = new Map<string, Metadata>();
      for (const m of metaData.metadata || []) {
        metaMap.set(m.endpoint_id, m);
      }
      setMetadata(metaMap);
      setGroups(groupsData.groups || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const offices = useMemo(() => {
    const set = new Set<string>();
    metadata.forEach(m => { if (m.office) set.add(m.office); });
    return Array.from(set).sort();
  }, [metadata]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return endpoints.filter(ep => {
      const meta = metadata.get(ep.id);
      if (filterOffice !== "all" && meta?.office !== filterOffice) return false;
      if (filterGroup !== "all" && meta?.group_id !== filterGroup) return false;
      if (!q) return true;
      return (
        ep.name.toLowerCase().includes(q) ||
        meta?.alias?.toLowerCase().includes(q) ||
        meta?.office?.toLowerCase().includes(q) ||
        meta?.client?.toLowerCase().includes(q) ||
        meta?.tags?.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [endpoints, metadata, search, filterOffice, filterGroup]);

  const saveMeta = async (meta: Metadata) => {
    await manageCall(password, "save_metadata", { metadata: meta });
    setEditing(null);
    loadAll();
  };

  const deleteMeta = async (endpointId: string) => {
    if (!confirm("למחוק את כל המטא-דאטה של המחשב הזה?")) return;
    await manageCall(password, "delete_metadata", { endpointId });
    loadAll();
  };

  const saveGroup = async (group: Group) => {
    await manageCall(password, "save_group", { group });
    setEditingGroup(null);
    loadAll();
  };

  const deleteGroup = async (groupId: string) => {
    if (!confirm("למחוק את הקבוצה? המחשבים יישארו אבל לא ישוייכו לקבוצה.")) return;
    await manageCall(password, "delete_group", { groupId });
    loadAll();
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={loadAll} disabled={loading} variant="outline" size="sm" className="rounded-xl">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
          רענן מ-Action1
        </Button>
        <Button onClick={() => setShowGroups(s => !s)} variant="outline" size="sm" className="rounded-xl">
          <Users className="h-4 w-4 mr-1" /> ניהול קבוצות ({groups.length})
        </Button>
        <span className="text-xs text-muted-foreground mr-auto">
          {filtered.length} מתוך {endpoints.length} מחשבים
        </span>
      </div>

      {/* Groups manager */}
      {showGroups && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">קבוצות</h3>
            <Button onClick={() => setEditingGroup("new")} size="sm" className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="h-3.5 w-3.5 mr-1" /> קבוצה חדשה
            </Button>
          </div>
          {groups.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">אין קבוצות עדיין</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {groups.map(g => (
                <div key={g.id} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.color || "#3b82f6" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{g.name}</div>
                    {g.description && <div className="text-[10px] text-muted-foreground truncate">{g.description}</div>}
                  </div>
                  <button onClick={() => setEditingGroup(g)} className="p-1 rounded hover:bg-accent/10 text-muted-foreground hover:text-accent">
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button onClick={() => deleteGroup(g.id!)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search & filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, כינוי, משרד, לקוח, תגית..."
            className="w-full pr-10 pl-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {offices.length > 0 && (
            <select
              value={filterOffice}
              onChange={(e) => setFilterOffice(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50"
            >
              <option value="all">כל המשרדים</option>
              {offices.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {groups.length > 0 && (
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50"
            >
              <option value="all">כל הקבוצות</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Endpoints list */}
      {loading && endpoints.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> טוען מ-Action1...
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(ep => {
            const meta = metadata.get(ep.id);
            const group = meta?.group_id ? groups.find(g => g.id === meta.group_id) : null;
            const isOnline = ep.status?.toLowerCase().includes("online") || ep.status?.toLowerCase().includes("connect");
            return (
              <div key={ep.id} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? "bg-accent" : "bg-muted-foreground/40"}`} title={ep.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground truncate">
                      {meta?.alias || ep.name}
                    </span>
                    {meta?.alias && (
                      <span className="text-[10px] text-muted-foreground font-mono" dir="ltr">({ep.name})</span>
                    )}
                    {group && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                        backgroundColor: `${group.color}20`,
                        color: group.color || undefined,
                        border: `1px solid ${group.color}40`,
                      }}>
                        {group.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground flex-wrap">
                    {meta?.office && <span className="flex items-center gap-1"><Building2 className="h-2.5 w-2.5" /> {meta.office}</span>}
                    {meta?.client && <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5" /> {meta.client}</span>}
                    {meta?.contact_phone && <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" /> {meta.contact_phone}</span>}
                    {meta?.tags && meta.tags.length > 0 && (
                      <span className="flex items-center gap-1"><Tag className="h-2.5 w-2.5" /> {meta.tags.join(", ")}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditing({ ep, meta: meta || { endpoint_id: ep.id, endpoint_name: ep.name, tags: [] } })}
                  className="p-2 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                  aria-label="ערוך"
                  title="ערוך מטא-דאטה"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                {meta && (
                  <button
                    onClick={() => deleteMeta(ep.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="מחק מטא-דאטה"
                    title="מחק מטא-דאטה"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">אין מחשבים שמתאימים לחיפוש</p>
            </div>
          )}
        </div>
      )}

      {/* Metadata editor modal */}
      {editing && (
        <MetadataEditor
          ep={editing.ep}
          meta={editing.meta}
          groups={groups}
          onSave={saveMeta}
          onCancel={() => setEditing(null)}
        />
      )}

      {/* Group editor modal */}
      {editingGroup && (
        <GroupEditor
          group={editingGroup === "new" ? { name: "", color: "#3b82f6" } : editingGroup}
          onSave={saveGroup}
          onCancel={() => setEditingGroup(null)}
        />
      )}
    </div>
  );
}

function MetadataEditor({ ep, meta, groups, onSave, onCancel }: {
  ep: Endpoint;
  meta: Metadata;
  groups: Group[];
  onSave: (m: Metadata) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Metadata>({
    ...meta,
    endpoint_id: ep.id,
    endpoint_name: ep.name,
    tags: meta.tags || [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) {
      setForm(p => ({ ...p, tags: [...(p.tags || []), t] }));
      setTagInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" onClick={onCancel}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">עריכת מחשב</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground" aria-label="סגור"><X className="h-5 w-5" /></button>
        </div>
        <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded" dir="ltr">{ep.name}</div>

        <div className="space-y-3">
          <Field label="כינוי בעברית">
            <input value={form.alias || ""} onChange={e => setForm(p => ({ ...p, alias: e.target.value }))}
              placeholder="למשל: מחשב של דנה"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" autoFocus />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="משרד">
              <input value={form.office || ""} onChange={e => setForm(p => ({ ...p, office: e.target.value }))}
                placeholder="תל אביב"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" />
            </Field>
            <Field label="לקוח">
              <input value={form.client || ""} onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                placeholder="חברת ABC"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" />
            </Field>
          </div>
          <Field label="טלפון איש קשר">
            <input value={form.contact_phone || ""} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))}
              placeholder="050-1234567"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" dir="ltr" />
          </Field>
          <Field label="קבוצה">
            <select value={form.group_id || ""} onChange={e => setForm(p => ({ ...p, group_id: e.target.value || null }))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50">
              <option value="">— ללא קבוצה —</option>
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </Field>
          <Field label="תגיות">
            <div className="flex gap-1 flex-wrap mb-2">
              {form.tags?.map(t => (
                <span key={t} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  {t}
                  <button type="button" onClick={() => setForm(p => ({ ...p, tags: p.tags?.filter(x => x !== t) }))}>
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="הוסף תגית ולחץ Enter"
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50" />
              <Button type="button" onClick={addTag} variant="outline" size="sm" className="rounded-xl">הוסף</Button>
            </div>
          </Field>
          <Field label="הערות">
            <textarea value={form.notes || ""} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              rows={3}
              placeholder="הערות פנימיות (לא נחשפות ללקוח)"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" />
          </Field>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button onClick={() => onSave(form)} className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="h-4 w-4 mr-1" /> שמור
          </Button>
          <Button variant="outline" onClick={onCancel} className="rounded-xl">ביטול</Button>
        </div>
      </div>
    </div>
  );
}

function GroupEditor({ group, onSave, onCancel }: {
  group: Group;
  onSave: (g: Group) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Group>(group);
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" onClick={onCancel}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">{form.id ? "עריכת קבוצה" : "קבוצה חדשה"}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <Field label="שם הקבוצה">
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="למשל: משרד תל אביב"
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" autoFocus />
        </Field>
        <Field label="תיאור">
          <input value={form.description || ""} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" />
        </Field>
        <Field label="צבע">
          <div className="flex gap-2 flex-wrap">
            {colors.map(c => (
              <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? "ring-2 ring-offset-2 ring-foreground/30 scale-110" : ""}`}
                style={{ backgroundColor: c }}
                aria-label={`צבע ${c}`} />
            ))}
          </div>
        </Field>
        <div className="flex gap-2 pt-2">
          <Button onClick={() => onSave(form)} disabled={!form.name.trim()}
            className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="h-4 w-4 mr-1" /> שמור
          </Button>
          <Button variant="outline" onClick={onCancel} className="rounded-xl">ביטול</Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-foreground/70 block">{label}</label>
      {children}
    </div>
  );
}
