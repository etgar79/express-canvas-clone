import { useState, useEffect, useRef, useMemo } from "react";
import { Settings, Eye, EyeOff, Save, Loader2, Lock, ArrowRight, Shield, Plus, Pencil, Trash2, RefreshCw, Terminal, X, ChevronDown, Cloud, Search, Copy, Check, Globe, Download, Filter, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AnalyticsTab } from "@/components/AnalyticsTab";

const SETTINGS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/settings`;

type SettingsMap = Record<string, string>;
type Script = {
  id?: string;
  name: string;
  description: string;
  script: string;
  category: string;
  is_public: boolean;
};

const FIELD_LABELS: Record<string, string> = {
  ACTION1_CLIENT_ID: "Action1 Client ID",
  ACTION1_CLIENT_SECRET: "Action1 Client Secret",
  ACTION1_ORG_ID: "Action1 Organization ID",
  TECH_PASSWORD: "סיסמת טכנאי",
  ONEDRIVE_FOLDER_LINK: "לינק שיתוף תיקיית OneDrive",
};

const BUDGET_FIELDS: { key: string; label: string; hint: string }[] = [
  { key: "budget_daily_limit", label: "סף יומי (שיחות)", hint: "מעל הסף — מעבר אוטומטי למודל חסכוני" },
  { key: "budget_monthly_limit", label: "סף חודשי (שיחות)", hint: "מעל הסף — מעבר אוטומטי למודל חסכוני" },
];

async function apiCall(password: string, action: string, extra: Record<string, unknown> = {}) {
  const resp = await fetch(SETTINGS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
    body: JSON.stringify({ action, password, ...extra }),
  });
  return resp.json();
}

// Sanitize a script name into a safe filename
function toSafeFilename(name: string) {
  const cleaned = name
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "_")
    .trim()
    .slice(0, 80);
  return cleaned || "script";
}

function downloadScriptFile(s: Script) {
  const blob = new Blob([s.script], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${toSafeFilename(s.name)}.ps1`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// --- Script Editor Modal ---
function ScriptEditor({ script, onSave, onCancel }: { script: Script | null; onSave: (s: Script) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Script>(script || { name: "", description: "", script: "", category: "כללי", is_public: false });

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && form.name.trim() && form.script.trim()) {
        e.preventDefault();
        onSave(form);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [form, onCancel, onSave]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" onClick={onCancel}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">{script?.id ? "עריכת סקריפט" : "סקריפט חדש"}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground" aria-label="סגור"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground/70 block mb-1">שם</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" autoFocus />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 block mb-1">תיאור</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-foreground/70 block mb-1">קטגוריה</label>
              <input value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50" />
            </div>
            <div className="flex items-end gap-2 pb-0.5">
              <label className="flex items-center gap-2 text-xs text-foreground/70 cursor-pointer">
                <input type="checkbox" checked={form.is_public} onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))}
                  className="rounded border-border" />
                ציבורי
              </label>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/70 block mb-1">סקריפט (PowerShell)</label>
            <textarea value={form.script} onChange={e => setForm(p => ({ ...p, script: e.target.value }))} rows={10}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-accent/50" dir="ltr" />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button onClick={() => onSave(form)} disabled={!form.name.trim() || !form.script.trim()}
            className="flex-1 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
            <Save className="h-4 w-4 mr-1" /> שמור
          </Button>
          <Button variant="outline" onClick={onCancel} className="rounded-xl">ביטול</Button>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">Ctrl+Enter לשמירה • Esc לסגירה</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Dashboard ---
export default function TechDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"settings" | "scripts" | "analytics">("scripts");

  // Scripts state
  const [scripts, setScripts] = useState<Script[]>([]);
  const [scriptsLoading, setScriptsLoading] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null | "new">(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState("");
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [publicOnly, setPublicOnly] = useState(false);
  const [botUsage, setBotUsage] = useState<{ daily: number; monthly: number } | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const copyScript = async (s: Script) => {
    try {
      await navigator.clipboard.writeText(s.script);
      setCopiedId(s.id || null);
      setTimeout(() => setCopiedId(null), 1500);
    } catch { /* ignore */ }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(false);
    try {
      const data = await apiCall(password, "get");
      if (data.error) { setPasswordError(true); return; }
      setSettings(data.settings || {});
      setIsUnlocked(true);
      loadScripts();
      loadBotUsage();
    } catch {
      setPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadBotUsage = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const month = today.slice(0, 7);
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/bot_usage_counter?period_key=in.(${today},${month})&select=period_key,count`, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      const rows: { period_key: string; count: number }[] = await resp.json();
      const daily = rows.find(r => r.period_key === today)?.count || 0;
      const monthly = rows.find(r => r.period_key === month)?.count || 0;
      setBotUsage({ daily, monthly });
    } catch { /* ignore */ }
  };

  const loadScripts = async () => {
    setScriptsLoading(true);
    try {
      const data = await apiCall(password, "get_scripts");
      setScripts(data.scripts || []);
    } catch { /* ignore */ }
    finally { setScriptsLoading(false); }
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    const data = await apiCall(password, "update", { settings });
    if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  const saveScript = async (script: Script) => {
    await apiCall(password, "save_script", { script });
    setEditingScript(null);
    loadScripts();
  };

  const deleteScript = async (id: string) => {
    if (!confirm("למחוק את הסקריפט?")) return;
    await apiCall(password, "delete_script", { scriptId: id });
    loadScripts();
  };

  const togglePublic = async (s: Script) => {
    setScripts(prev => prev.map(x => x.id === s.id ? { ...x, is_public: !s.is_public } : x));
    const updated = { ...s, is_public: !s.is_public };
    const data = await apiCall(password, "save_script", { script: updated });
    if (data?.error) {
      setScripts(prev => prev.map(x => x.id === s.id ? s : x));
    }
  };

  const syncFromSheets = async () => {
    setSyncing(true);
    setSyncResult("");
    const data = await apiCall(password, "sync_from_sheets");
    if (data.success) setSyncResult(`✅ יובאו ${data.imported} סקריפטים מהגיליון`);
    else setSyncResult(`❌ ${data.error}`);
    setSyncing(false);
    loadScripts();
  };

  const syncFromOneDrive = async () => {
    if (!settings.ONEDRIVE_FOLDER_LINK) {
      setSyncResult("❌ הגדר תחילה לינק OneDrive בלשונית 'הגדרות'");
      return;
    }
    setSyncing(true);
    setSyncResult("");
    const data = await apiCall(password, "sync_from_onedrive");
    if (data.success) {
      const parts = [];
      if (data.imported) parts.push(`${data.imported} חדשים`);
      if (data.updated) parts.push(`${data.updated} עודכנו`);
      if (data.failed) parts.push(`${data.failed} נכשלו`);
      const summary = parts.length ? parts.join(", ") : (data.message || "אין שינויים");
      setSyncResult(`✅ OneDrive (${data.folder || "תיקייה"}): ${summary}`);
    } else {
      setSyncResult(`❌ ${data.error}`);
    }
    setSyncing(false);
    loadScripts();
  };

  const toggleShow = (key: string) => setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));

  // Keyboard shortcuts: Ctrl+K (search), Ctrl+N (new script)
  useEffect(() => {
    if (!isUnlocked) return;
    const handler = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (!isMod) return;
      // Skip when typing in an input/textarea (except for Ctrl+K which is universal)
      const target = e.target as HTMLElement;
      const inEditable = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveTab("scripts");
        setTimeout(() => searchRef.current?.focus(), 50);
      } else if (e.key.toLowerCase() === "n" && !inEditable && !editingScript) {
        e.preventDefault();
        setActiveTab("scripts");
        setEditingScript("new");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isUnlocked, editingScript]);

  // All categories (unique, sorted)
  const allCategories = useMemo(() => {
    const set = new Set(scripts.map(s => s.category || "כללי"));
    return Array.from(set).sort();
  }, [scripts]);

  // Counts per category for chips
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of scripts) counts[s.category || "כללי"] = (counts[s.category || "כללי"] || 0) + 1;
    return counts;
  }, [scripts]);

  // Filter & group scripts
  const q = searchQuery.trim().toLowerCase();
  const filtered = scripts.filter(s => {
    if (publicOnly && !s.is_public) return false;
    if (activeCategory !== "all" && (s.category || "כללי") !== activeCategory) return false;
    if (!q) return true;
    return (
      s.name.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.script.toLowerCase().includes(q)
    );
  });
  const grouped = filtered.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {} as Record<string, Script[]>);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-sm">
          <form onSubmit={login} className="bg-card border border-border rounded-2xl p-8 shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-xl font-bold text-foreground">דשבורד טכנאים</h1>
              <p className="text-sm text-muted-foreground">הזן סיסמת טכנאי כדי לגשת להגדרות</p>
            </div>
            <div className="space-y-2">
              <input type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                placeholder="סיסמת טכנאי..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50 text-center"
                autoFocus />
              {passwordError && <p className="text-destructive text-xs text-center">סיסמה שגויה</p>}
            </div>
            <Button type="submit" disabled={loading || !password} className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Lock className="h-4 w-4 mr-2" /> כניסה</>}
            </Button>
            <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ArrowRight className="h-3 w-3 inline mr-1" /> חזרה לאתר
            </Link>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">דשבורד טכנאים</h1>
              <p className="text-xs text-muted-foreground">ניהול סקריפטים והגדרות</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowRight className="h-4 w-4 mr-1" /> חזרה
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setActiveTab("scripts")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "scripts" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            <Terminal className="h-4 w-4 inline mr-1" /> סקריפטים
          </button>
          <button onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "analytics" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            <BarChart3 className="h-4 w-4 inline mr-1" /> אנליטיקה
          </button>
          <button onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
            <Settings className="h-4 w-4 inline mr-1" /> הגדרות
          </button>
        </div>

        {/* Scripts Tab */}
        {activeTab === "scripts" && (
          <div className="space-y-4">
            {/* Actions bar */}
            <div className="flex flex-wrap gap-2 items-center">
              <Button onClick={() => setEditingScript("new")} className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground" size="sm" title="קיצור: Ctrl+N">
                <Plus className="h-4 w-4 mr-1" /> סקריפט חדש
              </Button>
              <Button onClick={syncFromSheets} disabled={syncing} variant="outline" size="sm" className="rounded-xl">
                {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                ייבוא מגיליון
              </Button>
              <Button onClick={syncFromOneDrive} disabled={syncing} variant="outline" size="sm" className="rounded-xl">
                {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Cloud className="h-4 w-4 mr-1" />}
                סנכרן מ-OneDrive
              </Button>
              <button
                onClick={() => setPublicOnly(p => !p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1.5 ${publicOnly ? "bg-accent/10 text-accent border-accent/30" : "bg-background text-muted-foreground border-border hover:text-foreground"}`}
                title="הצג רק סקריפטים שהבוט יראה ללקוחות">
                <Globe className="h-3.5 w-3.5" /> ציבורי בלבד
              </button>
              {syncResult && <span className="text-xs self-center">{syncResult}</span>}
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="h-4 w-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי שם, תיאור, קטגוריה או תוכן... (Ctrl+K)"
                className="w-full pr-10 pl-10 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="נקה חיפוש"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category chips */}
            {allCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 items-center">
                <Filter className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${activeCategory === "all" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  הכל ({scripts.length})
                </button>
                {allCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${activeCategory === cat ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                    {cat} ({categoryCounts[cat]})
                  </button>
                ))}
              </div>
            )}

            {scriptsLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> טוען סקריפטים...
              </div>
            ) : scripts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Terminal className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>אין סקריפטים. הוסף חדש או ייבא מהגיליון.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>לא נמצאו תוצאות{searchQuery ? ` עבור "${searchQuery}"` : ""}</p>
              </div>
            ) : (
              Object.entries(grouped).map(([cat, catScripts]) => (
                <div key={cat} className="space-y-2">
                  <h3 className="text-xs font-bold text-foreground/50 uppercase tracking-wider">{cat}</h3>
                  {catScripts.map((s) => (
                    <div key={s.id} className="bg-card border border-border rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedScript(expandedScript === s.id ? null : (s.id || null))}>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Terminal className="h-4 w-4 text-accent shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">{s.name}</span>
                          {s.is_public ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePublic(s); }}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors flex items-center gap-1 shrink-0"
                              title="לחץ כדי להפוך לפרטי"
                              aria-label="שנה לפרטי">
                              <Globe className="h-2.5 w-2.5" /> ציבורי
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); togglePublic(s); }}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border hover:bg-muted/70 hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
                              title="לחץ כדי להפוך לציבורי"
                              aria-label="שנה לציבורי">
                              <Lock className="h-2.5 w-2.5" /> פרטי
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={(e) => { e.stopPropagation(); copyScript(s); }}
                            className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label="העתק סקריפט"
                            title="העתק סקריפט">
                            {copiedId === s.id ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); downloadScriptFile(s); }}
                            className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label="הורד כקובץ .ps1"
                            title="הורד כקובץ .ps1">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setEditingScript(s); }}
                            className="p-1.5 rounded-lg hover:bg-accent/10 text-muted-foreground hover:text-accent transition-colors"
                            aria-label="ערוך סקריפט">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); deleteScript(s.id!); }}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label="מחק סקריפט">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedScript === s.id ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                      {expandedScript === s.id && (
                        <div className="px-4 pb-3 space-y-2 border-t border-border pt-2">
                          {s.description && <p className="text-xs text-foreground/60">{s.description}</p>}
                          <div className="rounded-lg overflow-hidden border border-border max-h-72 overflow-y-auto" dir="ltr">
                            <SyntaxHighlighter
                              language="powershell"
                              style={vscDarkPlus}
                              customStyle={{ margin: 0, padding: "0.75rem", fontSize: "0.75rem", background: "hsl(var(--background))" }}
                              wrapLongLines
                            >
                              {s.script}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}

            {/* Keyboard shortcuts hint */}
            <p className="text-[10px] text-muted-foreground text-center pt-2">
              קיצורי מקלדת: <kbd className="px-1 py-0.5 rounded bg-muted text-foreground/70">Ctrl+K</kbd> חיפוש • <kbd className="px-1 py-0.5 rounded bg-muted text-foreground/70">Ctrl+N</kbd> סקריפט חדש • <kbd className="px-1 py-0.5 rounded bg-muted text-foreground/70">Esc</kbd> סגירה
            </p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsTab password={password} />}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" /> הגדרות Action1
            </h2>
            <div className="space-y-4">
              {Object.keys(FIELD_LABELS).map((key) => {
                const isSecret = key === "ACTION1_CLIENT_SECRET" || key === "TECH_PASSWORD";
                const show = showSecrets[key] || false;
                return (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-medium text-foreground/70">{FIELD_LABELS[key]}</label>
                    <div className="flex gap-2">
                      <input type={isSecret && !show ? "password" : "text"} value={settings[key] || ""}
                        onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                        placeholder={`הזן ${FIELD_LABELS[key]}...`}
                        className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50 font-mono" dir="ltr" />
                      {isSecret && (
                        <button type="button" onClick={() => toggleShow(key)}
                          className="px-3 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground transition-colors">
                          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button onClick={saveSettings} disabled={saving} className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                שמור שינויים
              </Button>
              {saved && <span className="text-sm text-accent font-medium">✅ נשמר בהצלחה!</span>}
            </div>
          </div>
        )}
      </div>

      {/* Script Editor Modal */}
      {editingScript && (
        <ScriptEditor
          script={editingScript === "new" ? null : editingScript}
          onSave={saveScript}
          onCancel={() => setEditingScript(null)}
        />
      )}
    </div>
  );
}
