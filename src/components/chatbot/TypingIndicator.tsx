import { Bot } from "lucide-react";

// 3-dot animated typing indicator (frame-based via CSS keyframes already in index.css? fallback: inline)
export function TypingIndicator() {
  return (
    <div className="flex gap-2 animate-fade-in">
      <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-accent/15 text-accent">
        <Bot className="h-4 w-4" />
      </div>
      <div className="bg-muted/50 border border-border rounded-xl px-3 py-2.5 flex items-center gap-1">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "180ms" }} />
        <span className="typing-dot" style={{ animationDelay: "360ms" }} />
      </div>
    </div>
  );
}
