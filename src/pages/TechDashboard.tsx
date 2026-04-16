import { useState } from "react";
import { Settings, Eye, EyeOff, Save, Loader2, Lock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const SETTINGS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/settings`;

type SettingsMap = Record<string, string>;

const FIELD_LABELS: Record<string, string> = {
  ACTION1_CLIENT_ID: "Action1 Client ID",
  ACTION1_CLIENT_SECRET: "Action1 Client Secret",
  ACTION1_ORG_ID: "Action1 Organization ID",
  TECH_PASSWORD: "סיסמת טכנאי",
};

export default function TechDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(false);
    try {
      const resp = await fetch(SETTINGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: "get", password }),
      });
      if (!resp.ok) {
        setPasswordError(true);
        return;
      }
      const data = await resp.json();
      setSettings(data.settings || {});
      setIsUnlocked(true);
    } catch {
      setPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const resp = await fetch(SETTINGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: "update", password, settings }),
      });
      if (resp.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert("שגיאה בשמירה");
    } finally {
      setSaving(false);
    }
  };

  const toggleShow = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(false); }}
                placeholder="סיסמת טכנאי..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50 text-center"
                autoFocus
              />
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">דשבורד טכנאים</h1>
              <p className="text-xs text-muted-foreground">ניהול הגדרות Action1 והמערכת</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" size="sm" className="rounded-xl">
              <ArrowRight className="h-4 w-4 mr-1" /> חזרה
            </Button>
          </Link>
        </div>

        {/* Settings card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            הגדרות Action1
          </h2>

          <div className="space-y-4">
            {Object.keys(FIELD_LABELS).map((key) => {
              const isSecret = key === "ACTION1_CLIENT_SECRET" || key === "TECH_PASSWORD";
              const show = showSecrets[key] || false;

              return (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium text-foreground/70">{FIELD_LABELS[key]}</label>
                  <div className="flex gap-2">
                    <input
                      type={isSecret && !show ? "password" : "text"}
                      value={settings[key] || ""}
                      onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={`הזן ${FIELD_LABELS[key]}...`}
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50 font-mono"
                      dir="ltr"
                    />
                    {isSecret && (
                      <button
                        type="button"
                        onClick={() => toggleShow(key)}
                        className="px-3 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save} disabled={saving} className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              שמור שינויים
            </Button>
            {saved && <span className="text-sm text-green-600 font-medium">✅ נשמר בהצלחה!</span>}
          </div>
        </div>

        {/* Info */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 text-xs text-foreground/60 space-y-1">
          <p>💡 ההגדרות נשמרות במסד הנתונים ומשמשות את הבוט להרצת סקריפטים מרחוק.</p>
          <p>🔒 סיסמת הטכנאי משמשת לגישה לדשבורד זה. שנה אותה מעת לעת.</p>
        </div>
      </div>
    </div>
  );
}
