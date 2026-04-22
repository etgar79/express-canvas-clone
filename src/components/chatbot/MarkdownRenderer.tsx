import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

// Renders assistant markdown with: tables, lists, syntax highlighting, copy-button on code blocks
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div
      className="prose prose-sm max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_table]:my-2 [&_table]:text-xs [&_th]:bg-muted/40 [&_th]:px-2 [&_th]:py-1 [&_td]:px-2 [&_td]:py-1 [&_blockquote]:border-r-2 [&_blockquote]:border-accent/40 [&_blockquote]:pr-2 [&_blockquote]:text-foreground/70 [&_a]:text-accent [&_a]:underline [&_strong]:text-foreground [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm"
      dir="auto"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");

            if (!inline && (match || codeText.includes("\n"))) {
              return <CodeBlock language={match?.[1] || "powershell"} code={codeText} />;
            }
            return (
              <code
                className="bg-background/60 text-accent px-1 py-0.5 rounded text-[0.85em] border border-border"
                dir="ltr"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative group my-2 rounded-lg overflow-hidden border border-border" dir="ltr">
      <div className="flex items-center justify-between px-2 py-1 bg-background/80 border-b border-border">
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-mono">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-accent transition-colors px-1.5 py-0.5 rounded"
          aria-label="העתק קוד"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "הועתק" : "העתק"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "0.5rem 0.75rem",
          fontSize: "0.7rem",
          background: "hsl(var(--background))",
          borderRadius: 0,
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
