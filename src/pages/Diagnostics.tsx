import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, MessageCircle, Loader2, Home, Stethoscope, 
  Copy, CheckCircle, Bot, User, RefreshCw, Terminal, Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Issue = {
  id: number;
  description: string;
  script: string;
};

type ChatMessage = {
  role: "bot" | "user";
  content: string;
  issues?: Issue[];
  selectedIssue?: Issue;
};

export default function Diagnostics() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("fetch-issues");
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      
      const fetchedIssues = data.issues || [];
      setIssues(fetchedIssues);
      
      setMessages([
        {
          role: "bot",
          content: fetchedIssues.length > 0 
            ? `שלום! 👋 אני הבוט של אקספרס IT.\nמצאתי ${fetchedIssues.length} פתרונות מוכנים לתקלות נפוצות.\n\nבחרו תקלה מהרשימה ואתן לכם את הסקריפט לתיקון:`
            : "שלום! 👋 אין כרגע תקלות מוגדרות במערכת. נסו שוב מאוחר יותר.",
          issues: fetchedIssues,
        },
      ]);
    } catch (e: any) {
      setError(e.message || "שגיאה בטעינת נתונים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleSelectIssue = (issue: Issue) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: issue.description },
      {
        role: "bot",
        content: `מצאתי את הפתרון עבור **"${issue.description}"** 🔧\n\nהנה הסקריפט שצריך להריץ:`,
        selectedIssue: issue,
      },
    ]);
  };

  const handleCopy = (script: string, id: number) => {
    navigator.clipboard.writeText(script);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        role: "bot",
        content: `בחרו תקלה מהרשימה ואתן לכם את הסקריפט לתיקון:`,
        issues: issues,
      },
    ]);
    setSearchQuery("");
  };

  const filteredIssues = issues.filter(issue => 
    issue.description.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      
      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors text-sm">
            <ArrowRight className="h-4 w-4" />
            חזרה לאתר
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" />
            <h1 className="text-lg font-bold text-accent">איבחון תקלות חינם</h1>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Loading */}
          {loading && (
            <Card className="p-12 border border-border text-center bg-card rounded-2xl animate-fade-in">
              <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto mb-4" />
              <p className="text-foreground text-lg font-medium">טוען פתרונות...</p>
              <p className="text-foreground/40 mt-2 text-sm">מביא את רשימת התקלות העדכנית</p>
            </Card>
          )}

          {/* Error */}
          {error && (
            <Card className="p-8 border border-destructive/30 text-center bg-card rounded-2xl">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchIssues} variant="outline" className="border-border rounded-xl">
                <RefreshCw className="ml-2 h-4 w-4" />
                נסה שוב
              </Button>
            </Card>
          )}

          {/* Chat Messages */}
          {!loading && !error && (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                    msg.role === "bot" 
                      ? "bg-accent/15 text-accent" 
                      : "bg-primary/15 text-primary"
                  }`}>
                    {msg.role === "bot" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                  </div>

                  {/* Message bubble */}
                  <div className={`flex-1 max-w-[85%] ${msg.role === "user" ? "text-left" : ""}`}>
                    <Card className={`p-4 rounded-2xl ${
                      msg.role === "bot" 
                        ? "bg-card border-border" 
                        : "bg-accent/10 border-accent/20"
                    }`}>
                      <p className="text-foreground/80 text-sm whitespace-pre-line leading-relaxed">
                        {msg.content}
                      </p>

                      {/* Issue list */}
                      {msg.issues && msg.issues.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {/* Search */}
                          {msg.issues.length > 5 && (
                            <div className="relative mb-3">
                              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                              <input
                                type="text"
                                placeholder="חיפוש תקלה..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-accent/40"
                              />
                            </div>
                          )}
                          {(searchQuery ? filteredIssues : msg.issues).map((issue) => (
                            <Button
                              key={issue.id}
                              variant="outline"
                              className="w-full justify-start text-right p-3 h-auto border-border hover:border-accent/40 hover:bg-accent/5 text-foreground/70 hover:text-foreground transition-all rounded-xl text-sm"
                              onClick={() => handleSelectIssue(issue)}
                            >
                              <Stethoscope className="ml-2 h-4 w-4 text-accent shrink-0" />
                              {issue.description}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Script display */}
                      {msg.selectedIssue && (
                        <div className="mt-4">
                          <div className="bg-muted/50 border border-border rounded-xl p-4 relative group">
                            <div className="flex items-center gap-2 mb-2 text-accent text-xs font-medium">
                              <Terminal className="h-3.5 w-3.5" />
                              סקריפט תיקון
                            </div>
                            <pre className="text-foreground/80 text-xs font-mono whitespace-pre-wrap break-all leading-relaxed overflow-x-auto" dir="ltr">
                              {msg.selectedIssue.script}
                            </pre>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-3 left-3 h-8 px-3 text-xs rounded-lg bg-accent/10 hover:bg-accent/20 text-accent"
                              onClick={() => handleCopy(msg.selectedIssue!.script, msg.selectedIssue!.id)}
                            >
                              {copied === msg.selectedIssue.id ? (
                                <>
                                  <CheckCircle className="ml-1 h-3.5 w-3.5" />
                                  הועתק!
                                </>
                              ) : (
                                <>
                                  <Copy className="ml-1 h-3.5 w-3.5" />
                                  העתק
                                </>
                              )}
                            </Button>
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl text-xs border-border"
                              onClick={handleReset}
                            >
                              <ArrowRight className="ml-1 h-3.5 w-3.5" />
                              תקלה אחרת
                            </Button>
                            <Button
                              size="sm"
                              className="rounded-xl text-xs bg-accent hover:bg-accent/90 text-accent-foreground"
                              asChild
                            >
                              <a href="https://wa.me/972545368629?text=שלום, ניסיתי את הסקריפט ואשמח לעזרה נוספת" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="ml-1 h-3.5 w-3.5" />
                                צריך עזרה נוספת?
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-foreground/30 text-xs mb-3">הסקריפטים מתעדכנים באופן שוטף • הריצו כמנהל (Run as Admin)</p>
            <Link to="/" className="text-foreground/40 hover:text-accent transition-colors text-sm inline-flex items-center gap-1">
              <Home className="h-4 w-4" />
              חזרה לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
