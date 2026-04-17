import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2, Play, Monitor, Shield, UserCheck, Copy, Check, CircleAlert, CircleCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };
type Endpoint = { id: string; name: string; status: string; lanIp?: string };

const REMEMBERED_ENDPOINT_ID_KEY = "techtherapy_remembered_endpoint_id";
const REMEMBERED_ENDPOINT_NAME_KEY = "techtherapy_remembered_endpoint_name";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const ACTION1_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/action1`;

async function streamChat({
  messages, onDelta, onDone, onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      onError(data.error || "שגיאה בשירות, נסה שוב.");
      return;
    }

    if (!resp.body) { onError("אין תגובה מהשרת"); return; }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch {
    onError("שגיאת תקשורת, בדוק את החיבור לאינטרנט.");
  }
}

// Extract script name from bot message - looks for [SCRIPT_NAME:...] tag
function extractScriptContext(content: string): string | null {
  const match = content.match(/\[SCRIPT_NAME:([^\]]+)\]/);
  if (match) return match[1].trim();
  return null;
}

// Extract code block content for copying
function extractCodeBlock(content: string): string | null {
  const match = content.match(/```[\w]*\n?([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

function hasCodeBlock(content: string): boolean {
  return content.includes("```");
}

const BOT_PASSWORD = "0545368629";
const TECH_PASSWORD = "06536368";

type UserRole = "client" | "tech";

// --- Copy Script Button ---
function CopyScriptButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  const code = extractCodeBlock(content);
  if (!code) return null;
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg px-2 py-1"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "הועתק!" : "העתק סקריפט"}
    </button>
  );
}

// --- Shared: run a script on a specific endpoint ID ---
async function runScriptOnEndpoint(scriptName: string, endpointId: string) {
  const resp = await fetch(`${ACTION1_URL}?action=run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ scriptName, endpointId }),
  });
  return resp.json();
}

// --- Job Status Indicator: polls /action1?action=status until terminal state ---
type JobState = "queued" | "running" | "completed" | "failed";
function JobStatusIndicator({ jobId }: { jobId: string }) {
  const [state, setState] = useState<JobState>("queued");
  const [error, setError] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!jobId || jobId === "sent") return;
    let cancelled = false;
    const startedAt = Date.now();
    const tick = () => setElapsedSec(Math.floor((Date.now() - startedAt) / 1000));
    const elapsedTimer = setInterval(tick, 1000);

    const poll = async () => {
      try {
        const resp = await fetch(
          `${ACTION1_URL}?action=status&jobId=${encodeURIComponent(jobId)}`,
          { headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } }
        );
        const data = await resp.json();
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          return;
        }
        const next = data.status as JobState;
        setState(next);
        if (next === "completed" || next === "failed") return;
        // Stop polling after 5 minutes safety cap
        if (Date.now() - startedAt > 5 * 60 * 1000) {
          setError("הזמן הקצוב חלף");
          return;
        }
        setTimeout(poll, 3000);
      } catch {
        if (!cancelled) {
          setError("שגיאת תקשורת בבדיקת סטטוס");
        }
      }
    };
    poll();

    return () => {
      cancelled = true;
      clearInterval(elapsedTimer);
    };
  }, [jobId]);

  if (!jobId || jobId === "sent") return null;

  const config: Record<JobState, { icon: JSX.Element; label: string; color: string; bg: string; border: string }> = {
    queued: {
      icon: <Clock className="h-3 w-3" />,
      label: "ממתין בתור",
      color: "text-muted-foreground",
      bg: "bg-muted/30",
      border: "border-border",
    },
    running: {
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      label: "פועל כעת",
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
    completed: {
      icon: <CircleCheck className="h-3 w-3" />,
      label: "הושלם בהצלחה",
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/30",
    },
    failed: {
      icon: <CircleAlert className="h-3 w-3" />,
      label: "נכשל",
      color: "text-destructive",
      bg: "bg-destructive/10",
      border: "border-destructive/20",
    },
  };

  const c = error ? config.failed : config[state];

  return (
    <div className={`flex items-center justify-between gap-2 rounded-lg border ${c.border} ${c.bg} px-2 py-1.5`}>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${c.color}`}>
        {c.icon}
        {error || c.label}
      </span>
      <span className="text-[10px] text-muted-foreground tabular-nums" dir="ltr">
        {elapsedSec}s
      </span>
    </div>
  );
}

// --- Run Script Panel (CLIENT) ---
// Privacy-safe: never shows other endpoints. Asks for the user's PC name,
// looks it up server-side, and remembers the matched ID in localStorage.
function RunScriptPanelClient({ scriptName, onClose }: { scriptName: string; onClose: () => void }) {
  const [rememberedId, setRememberedId] = useState<string | null>(null);
  const [rememberedName, setRememberedName] = useState<string | null>(null);
  const [pcNameInput, setPcNameInput] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Endpoint[]>([]);

  useEffect(() => {
    const id = localStorage.getItem(REMEMBERED_ENDPOINT_ID_KEY);
    const name = localStorage.getItem(REMEMBERED_ENDPOINT_NAME_KEY);
    if (id && name) {
      setRememberedId(id);
      setRememberedName(name);
    }
  }, []);

  const lookupAndRun = async () => {
    const name = pcNameInput.trim();
    if (!name) return;
    setLookingUp(true);
    setResult(null);
    setCandidates([]);
    try {
      const resp = await fetch(
        `${ACTION1_URL}?action=lookup&name=${encodeURIComponent(name)}`,
        { headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` } }
      );
      const data = await resp.json();
      if (data.found && data.endpoint) {
        localStorage.setItem(REMEMBERED_ENDPOINT_ID_KEY, data.endpoint.id);
        localStorage.setItem(REMEMBERED_ENDPOINT_NAME_KEY, data.endpoint.name);
        setRememberedId(data.endpoint.id);
        setRememberedName(data.endpoint.name);
        setLookingUp(false);
        await runOnRemembered(data.endpoint.id, data.endpoint.name);
        return;
      }
      // Multiple partial matches → ask the user to pick
      if (Array.isArray(data.candidates) && data.candidates.length > 1) {
        setCandidates(data.candidates);
        setResult({ success: false, message: `נמצאו ${data.candidates.length} מחשבים דומים. בחר את שלך:` });
        setLookingUp(false);
        return;
      }
      setResult({ success: false, message: `❌ לא נמצא מחשב בשם "${name}". בדוק את האיות.` });
      setLookingUp(false);
    } catch {
      setResult({ success: false, message: "❌ שגיאת תקשורת" });
      setLookingUp(false);
    }
  };

  const pickCandidate = async (c: Endpoint) => {
    localStorage.setItem(REMEMBERED_ENDPOINT_ID_KEY, c.id);
    localStorage.setItem(REMEMBERED_ENDPOINT_NAME_KEY, c.name);
    setRememberedId(c.id);
    setRememberedName(c.name);
    setCandidates([]);
    await runOnRemembered(c.id, c.name);
  };

  const runOnRemembered = async (id?: string, name?: string) => {
    const targetId = id || rememberedId;
    const targetName = name || rememberedName || "המחשב";
    if (!targetId) return;
    setRunning(true);
    setResult(null);
    setJobId(null);
    try {
      const data = await runScriptOnEndpoint(scriptName, targetId);
      if (data.success) {
        setResult({ success: true, message: `✅ הסקריפט נשלח ל${targetName}. עוקב אחר ההרצה...` });
        if (data.jobId) setJobId(data.jobId);
      } else {
        setResult({ success: false, message: `❌ ${data.error || "שגיאה בהרצה"}` });
      }
    } catch {
      setResult({ success: false, message: "❌ שגיאת תקשורת" });
    } finally {
      setRunning(false);
    }
  };

  const forgetChoice = () => {
    localStorage.removeItem(REMEMBERED_ENDPOINT_ID_KEY);
    localStorage.removeItem(REMEMBERED_ENDPOINT_NAME_KEY);
    setRememberedId(null);
    setRememberedName(null);
    setPcNameInput("");
    setResult(null);
    setCandidates([]);
    setJobId(null);
  };

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-accent flex items-center gap-1">
          <Play className="h-3 w-3" /> הרצה מרחוק
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3 w-3" />
        </button>
      </div>

      {rememberedId && rememberedName ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-lg px-2 py-1.5">
            <Monitor className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-medium text-foreground">
              המחשב שלך: <span className="text-accent font-bold">{rememberedName}</span>
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => runOnRemembered()}
            disabled={running}
            className="w-full rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7"
          >
            {running ? (
              <><Loader2 className="h-3 w-3 animate-spin mr-1" /> מריץ...</>
            ) : (
              <><Play className="h-3 w-3 mr-1" /> הרץ על {rememberedName}</>
            )}
          </Button>
          <button
            onClick={forgetChoice}
            className="text-[10px] text-muted-foreground hover:text-foreground underline"
          >
            זה לא המחשב שלי? הזן מחדש
          </button>
        </div>
      ) : candidates.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-foreground/80">
            נמצאו {candidates.length} מחשבים דומים. בחר את שלך:
          </p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {candidates.map((c) => (
              <button
                key={c.id}
                onClick={() => pickCandidate(c)}
                disabled={running}
                className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-colors text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <Monitor className="h-3 w-3 text-accent" />
                  <span className="font-medium text-foreground" dir="ltr">{c.name}</span>
                </span>
                <span className={`text-[10px] ${c.status === "online" ? "text-accent" : "text-muted-foreground"}`}>
                  {c.status === "online" ? "● מחובר" : "○ לא מחובר"}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => { setCandidates([]); setResult(null); }}
            className="text-[10px] text-muted-foreground hover:text-foreground underline"
          >
            חזרה להזנה ידנית
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-xs text-foreground/70 block">
            הזן את שם המחשב שלך (Computer Name):
          </label>
          <input
            type="text"
            value={pcNameInput}
            onChange={(e) => setPcNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !lookingUp && lookupAndRun()}
            placeholder="לדוגמה: DESKTOP-ABC123"
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50"
            dir="ltr"
            disabled={lookingUp}
          />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            💡 איך לבדוק? הקש Win+R, רשום <span className="font-mono" dir="ltr">cmd</span>, ואז <span className="font-mono" dir="ltr">hostname</span>
          </p>
          <Button
            size="sm"
            onClick={lookupAndRun}
            disabled={lookingUp || !pcNameInput.trim()}
            className="w-full rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7"
          >
            {lookingUp ? (
              <><Loader2 className="h-3 w-3 animate-spin mr-1" /> מחפש...</>
            ) : (
              <><Play className="h-3 w-3 mr-1" /> מצא והרץ</>
            )}
          </Button>
        </div>
      )}

      {result && (
        <p className={`text-xs ${result.success ? "text-accent" : "text-destructive"}`}>
          {result.message}
        </p>
      )}

      {jobId && <JobStatusIndicator jobId={jobId} />}
    </div>
  );
}

// --- Run Script Panel (TECH) ---
// Technicians can see all endpoints and choose any.
function RunScriptPanelTech({ scriptName, onClose }: { scriptName: string; onClose: () => void }) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${ACTION1_URL}?action=endpoints&role=tech`, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        });
        const data = await resp.json();
        if (data.endpoints) {
          setEndpoints(data.endpoints);
          if (data.endpoints.length > 0) setSelectedEndpoint(data.endpoints[0].id);
        }
      } catch {
        setResult({ success: false, message: "שגיאה בטעינת מחשבים" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const run = async () => {
    if (!selectedEndpoint) return;
    setRunning(true);
    setResult(null);
    setJobId(null);
    try {
      const data = await runScriptOnEndpoint(scriptName, selectedEndpoint);
      if (data.success) {
        setResult({ success: true, message: `✅ הסקריפט נשלח (Job: ${data.jobId}). עוקב אחר ההרצה...` });
        if (data.jobId) setJobId(data.jobId);
      } else {
        setResult({ success: false, message: `❌ ${data.error || "שגיאה בהרצה"}` });
      }
    } catch {
      setResult({ success: false, message: "❌ שגיאת תקשורת" });
    } finally {
      setRunning(false);
    }
  };

  const selectedName = endpoints.find(e => e.id === selectedEndpoint)?.name || "";

  return (
    <div className="bg-accent/5 border border-accent/20 rounded-xl p-3 mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-accent flex items-center gap-1">
          <Play className="h-3 w-3" /> הרצה מרחוק (טכנאי)
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-3 w-3" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" /> טוען מחשבים...
        </div>
      ) : endpoints.length === 0 ? (
        <p className="text-xs text-destructive">לא נמצאו מחשבים מחוברים</p>
      ) : (
        <div className="space-y-2">
          <label className="text-xs text-foreground/70">בחר מחשב להרצה:</label>
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:border-accent/50"
          >
            {endpoints.map((ep) => (
              <option key={ep.id} value={ep.id}>
                {ep.name} ({ep.status}) {ep.lanIp ? `- ${ep.lanIp}` : ""}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={run}
            disabled={running || !selectedEndpoint}
            className="w-full rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-7"
          >
            {running ? (
              <><Loader2 className="h-3 w-3 animate-spin mr-1" /> מריץ...</>
            ) : (
              <><Play className="h-3 w-3 mr-1" /> הרץ על {selectedName || "המחשב"}</>
            )}
          </Button>
        </div>
      )}

      {result && (
        <p className={`text-xs ${result.success ? "text-accent" : "text-destructive"}`}>
          {result.message}
        </p>
      )}

      {jobId && <JobStatusIndicator jobId={jobId} />}
    </div>
  );
}

// --- Wrapper that routes to client/tech panel ---
function RunScriptPanel({ scriptName, onClose, userRole }: { scriptName: string; onClose: () => void; userRole: UserRole }) {
  if (userRole === "tech") {
    return <RunScriptPanelTech scriptName={scriptName} onClose={onClose} />;
  }
  return <RunScriptPanelClient scriptName={scriptName} onClose={onClose} />;
}

// --- Main Chat Bot ---
export const AiChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("client");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [runScriptIndex, setRunScriptIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isUnlocked) return;
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen, isUnlocked]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === TECH_PASSWORD) {
      setUserRole("tech");
      setIsUnlocked(true);
      setPasswordError(false);
    } else if (passwordInput === BOT_PASSWORD) {
      setUserRole("client");
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    await streamChat({
      messages: newMessages,
      onDelta: (chunk) => upsertAssistant(chunk),
      onDone: () => setIsLoading(false),
      onError: (err) => {
        setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${err}` }]);
        setIsLoading(false);
      },
    });
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 bg-accent text-accent-foreground"
          aria-label="פתח צ'אט"
        >
          <Bot className="h-7 w-7" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in" dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/10">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-accent" />
              <span className="font-bold text-foreground text-sm">הבוט של אתגר</span>
              {isUnlocked && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  userRole === "tech" 
                    ? "bg-primary/15 text-primary border border-primary/20" 
                    : "bg-accent/15 text-accent border border-accent/20"
                }`}>
                  {userRole === "tech" ? (
                    <span className="flex items-center gap-0.5"><Shield className="h-2.5 w-2.5" /> טכנאי</span>
                  ) : (
                    <span className="flex items-center gap-0.5"><UserCheck className="h-2.5 w-2.5" /> לקוח</span>
                  )}
                </span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {!isUnlocked ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <form onSubmit={handlePasswordSubmit} className="w-full space-y-4 text-center">
                <Bot className="h-12 w-12 mx-auto text-accent/50" />
                <p className="text-sm text-foreground/70 font-medium">הזן סיסמה כדי לגשת לבוט</p>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                  placeholder="סיסמה..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50 text-center"
                  autoFocus
                />
                {passwordError && <p className="text-destructive text-xs">סיסמה שגויה, נסה שוב</p>}
                <Button type="submit" size="sm" className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground">
                  כניסה
                </Button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    <Bot className="h-10 w-10 mx-auto mb-3 text-accent/50" />
                    <p className="font-medium text-foreground/70">שלום! 👋</p>
                    <p className="mt-1">אני הבוט של אתגר.</p>
                    <p>ספרו לי מה התקלה ואמצא לכם פתרון!</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                        msg.role === "assistant" ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
                      }`}>
                        {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </div>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-accent/10 border border-accent/20 text-foreground"
                          : "bg-muted/50 border border-border text-foreground/85"
                      }`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none [&_pre]:bg-background [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-2 [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:text-accent [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1" dir="auto">
                            <ReactMarkdown>{msg.content.replace(/\[SCRIPT_NAME:[^\]]+\]/g, "")}</ReactMarkdown>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>
                    </div>

                    {/* Copy + Run buttons for assistant messages with code blocks */}
                    {msg.role === "assistant" && hasCodeBlock(msg.content) && !isLoading && (
                      <div className="mr-9 mt-1 flex flex-wrap gap-1">
                        <CopyScriptButton content={msg.content} />
                        {extractScriptContext(msg.content) && (
                          runScriptIndex === i ? (
                            <RunScriptPanel
                              scriptName={extractScriptContext(msg.content) || "unknown"}
                              onClose={() => setRunScriptIndex(null)}
                              userRole={userRole}
                            />
                          ) : (
                            <button
                              onClick={() => setRunScriptIndex(i)}
                              className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-lg px-2 py-1"
                            >
                              <Play className="h-3 w-3" />
                              הרץ על מחשב מרחוק
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex gap-2">
                    <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-accent/15 text-accent">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted/50 border border-border rounded-xl px-3 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-3">
                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="תאר את התקלה..."
                    disabled={isLoading}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/50 disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!input.trim() || isLoading}
                    className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
