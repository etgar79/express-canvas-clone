import { useEffect, useRef, useState, type FormEvent } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Copy, EyeOff, LockKeyhole } from "lucide-react";

export default function Install() {
  const [password, setPassword] = useState("");
  const [command, setCommand] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const generation = useRef(0);
  useEffect(() => {
    document.title = "התקנת Action1 | Tech Therapy";
    return () => { generation.current += 1; };
  }, []);
  const hide = () => { generation.current += 1; setCommand(""); setPassword(""); setCopied(false); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const current = ++generation.current;
    setBusy(true); setError(""); setCommand(""); setCopied(false);
    const entered = password; setPassword("");
    try {
      const { data, error: requestError } = await supabase.functions.invoke("action1-install", { body: { password: entered } });
      if (current !== generation.current) return;
      if (requestError) {
        const status = requestError.context instanceof Response ? requestError.context.status : 0;
        setError(status === 401 ? "סיסמה שגויה" : status === 429 ? "יותר מדי ניסיונות. נסו שוב בעוד 15 דקות" : status === 503 ? "לא הוגדר" : "לא ניתן להציג את הפקודה כרגע");
      } else if (typeof data?.command === "string") setCommand(data.command);
      else setError("לא הוגדר");
    } catch { if (current === generation.current) setError("לא ניתן להציג את הפקודה כרגע"); }
    finally { if (current === generation.current) setBusy(false); }
  };
  const copy = async () => {
    const current = generation.current;
    try { await navigator.clipboard.writeText(command); if (current === generation.current) setCopied(true); }
    catch { setError("ההעתקה נכשלה. נסו שוב"); }
  };
  return <div className="min-h-screen" dir="rtl">
    <SkipLink /><Header />
    <main id="main-content" className="pt-[132px] lg:pt-[72px]">
      <section className="container px-4 py-16 max-w-3xl">
        <LockKeyhole className="h-8 w-8 text-primary mb-5" aria-hidden="true" />
        <h1 className="text-3xl md:text-4xl font-bold mb-8">התקנת Action1</h1>
        <form onSubmit={submit} className="space-y-4 max-w-md" autoComplete="off">
          <Label htmlFor="install-password">סיסמה</Label>
          <Input id="install-password" type="password" autoComplete="off" value={password} onChange={event => setPassword(event.target.value)} disabled={busy} required maxLength={4096} />
          <Button type="submit" disabled={busy || !password} className="min-h-11">{busy ? "בודק…" : "הצג פקודה"}</Button>
        </form>
        {error && <p role="alert" className="text-destructive mt-5">{error}</p>}
        {command && <div className="mt-8 space-y-4">
          <pre dir="ltr" className="font-mono overflow-x-auto whitespace-pre rounded-lg border border-border bg-muted p-4 text-foreground" tabIndex={0} aria-label="פקודת התקנה"><code>{command}</code></pre>
          <div className="flex gap-3">
            <Button onClick={copy} className="min-h-11"><Copy className="h-4 w-4 ml-2" />{copied ? "הועתק ✓" : "העתק"}</Button>
            <Button onClick={hide} variant="outline" className="min-h-11"><EyeOff className="h-4 w-4 ml-2" />הסתר</Button>
          </div>
          <p className="text-muted-foreground">הריצו ב-CMD כמנהל (Run as administrator)</p>
        </div>}
      </section>
    </main><Footer />
  </div>;
}
