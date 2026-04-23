import { useState } from "react";
import { Loader2, Sparkles, Lightbulb, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-misses`;

type Suggestion = {
  title: string;
  description: string;
  category: string;
  priority: "high" | "medium" | "low";
  reason: string;
};

type Pattern = {
  topic: string;
  count: number;
  examples: string[];
};

type Analysis = {
  summary?: string;
  patterns?: Pattern[];
  suggestions?: Suggestion[];
  missCount?: number;
  analyzedDays?: number;
  analysis?: string; // For empty state
};

export function MissAnalyzer({ password }: { password: string }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(14);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ password, days }),
      });
      const json = await resp.json();
      if (json.error) {
        setError(json.error);
      } else {
        setData(json);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p: string) => p === "high" ? "bg-destructive/10 text-destructive border-destructive/30" :
                                       p === "medium" ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/30" :
                                       "bg-muted text-muted-foreground border-border";
  const priorityLabel = (p: string) => p === "high" ? "דחוף" : p === "medium" ? "בינוני" : "נמוך";

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" /> חיזוי בעיות חוזרות (AI)
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="px-2 py-1 rounded-lg border border-border bg-background text-foreground text-xs"
            disabled={loading}
          >
            <option value={7}>7 ימים</option>
            <option value={14}>14 יום</option>
            <option value={30}>30 יום</option>
          </select>
          <Button onClick={analyze} disabled={loading} size="sm" className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
            נתח
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        ה-AI ינתח את השאלות שהבוט לא ענה עליהן בתקופה שבחרת, ויציע סקריפטים חדשים שכדאי להוסיף לפי הדפוסים שזוהו.
      </p>

      {error && (
        <div className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="space-y-3 pt-2">
          {data.analysis && !data.suggestions?.length && (
            <p className="text-sm text-foreground bg-accent/5 border border-accent/20 rounded-lg p-3">{data.analysis}</p>
          )}

          {data.summary && (
            <div className="text-sm text-foreground bg-background border border-border rounded-lg p-3">
              <div className="text-[10px] text-muted-foreground mb-1">סיכום (ניתוח של {data.missCount} שאלות מ-{data.analyzedDays} ימים)</div>
              {data.summary}
            </div>
          )}

          {data.patterns && data.patterns.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground/70">📊 דפוסים שזוהו</div>
              {data.patterns.map((p, i) => (
                <div key={i} className="bg-background border border-border rounded-lg p-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{p.topic}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{p.count} פעמים</span>
                  </div>
                  {p.examples?.length > 0 && (
                    <ul className="text-muted-foreground space-y-0.5 mt-1">
                      {p.examples.slice(0, 3).map((ex, j) => (
                        <li key={j} className="truncate">• {ex}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {data.suggestions && data.suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-foreground/70 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" /> סקריפטים מוצעים להוספה
              </div>
              {data.suggestions.map((s, i) => (
                <div key={i} className="bg-background border border-border rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColor(s.priority)}`}>
                      {priorityLabel(s.priority)}
                    </span>
                    <span className="text-sm font-bold text-foreground">{s.title}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded mr-auto">{s.category}</span>
                  </div>
                  <p className="text-xs text-foreground/80">{s.description}</p>
                  <p className="text-[10px] text-muted-foreground italic">💡 {s.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!data && !loading && !error && (
        <p className="text-xs text-muted-foreground text-center py-4">לחץ "נתח" כדי לקבל המלצות מבוססות AI</p>
      )}
    </div>
  );
}
