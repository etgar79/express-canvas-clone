import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHEET_ID = "1mR7NpQPcIxwURMKTrSP4scD7eYI4vYXnt2lBkyFNWxc";

// ===== Cost optimization constants =====
const MAX_CONVERSATION_MESSAGES = 20; // Limit context window to save tokens
const MODEL_FAST = "google/gemini-2.5-flash-lite"; // Cheap, ~60% cheaper, for greetings/small talk
const MODEL_MAIN = "google/gemini-3-flash-preview"; // Default for technical issues

// ===== Simple in-memory cache for issues sheet (5 min TTL) =====
let issuesCache: { data: { description: string; script: string; category: string }[]; ts: number } | null = null;
const ISSUES_TTL_MS = 5 * 60 * 1000;

// ===== Common reply cache (greetings only — never cache real diagnoses) =====
const COMMON_REPLIES: Record<string, string> = {
  "שלום": "שלום! 👋 אני אתגר, כאן לעזור עם כל בעיה במחשב. ספר לי בקצרה מה קורה ואני אנסה לעזור.",
  "היי": "היי! 😊 אני אתגר. תאר לי את התקלה ואמצא לך פתרון מהיר.",
  "הי": "הי! 😊 אני אתגר. תאר לי את התקלה ואמצא לך פתרון מהיר.",
  "שלום לך": "שלום! 👋 איך אני יכול לעזור היום?",
  "מה שלומך": "תודה ששאלת! 😊 אני מוכן לעבודה. ספר לי מה קורה אצלך עם המחשב.",
  "תודה": "בכיף! 🙏 אם תצטרך עוד משהו — אני כאן.",
  "תודה רבה": "בכיף! 🙏 שיהיה לך יום מצוין. אם משהו נתקע שוב — חזור אליי.",
  "ביי": "ביי! 👋 שיהיה לך יום מצוין.",
  "להתראות": "להתראות! 👋 אם תצטרך עזרה — תמיד כאן.",
};

function normalizeForCache(text: string): string {
  return text.trim().toLowerCase().replace(/[!?.,]/g, "").replace(/\s+/g, " ");
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function fetchIssuesFromSheet(): Promise<{ description: string; script: string; category: string }[]> {
  // Use cache if fresh
  if (issuesCache && Date.now() - issuesCache.ts < ISSUES_TTL_MS) {
    return issuesCache.data;
  }
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
  const response = await fetch(url);
  if (!response.ok) return issuesCache?.data ?? [];
  const csvText = await response.text();
  const lines = csvText.split("\n").filter(line => line.trim());
  if (lines.length < 2) return issuesCache?.data ?? [];

  const issues = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const description = (cols[0] || "").trim();
    const script = (cols[1] || "").trim();
    const category = (cols[2] || "כללי").trim();
    if (description) {
      issues.push({ description, script, category });
    }
  }
  issuesCache = { data: issues, ts: Date.now() };
  return issues;
}

// ===== Intent classification (heuristic, NO extra AI call to save credits) =====
type Intent = "greeting" | "smalltalk" | "technical" | "company_info" | "contact";

function classifyIntent(text: string): Intent {
  const t = text.trim().toLowerCase();
  if (t.length < 2) return "smalltalk";

  // Greetings & small talk patterns
  const greetingPatterns = /^(שלום|היי|הי|הלו|בוקר טוב|ערב טוב|מה שלומך|מה קורה|מה נשמע|תודה|ביי|להתראות|סבבה|אוקיי|אוקי|אהלן)/;
  if (greetingPatterns.test(t) && t.length < 25) return "greeting";

  // Contact/company info
  if (/(טלפון|וואטסאפ|ווצאפ|whatsapp|מייל|כתובת|שעות|איך ליצור קשר|לדבר עם|בנאדם|אדם)/.test(t)) return "contact";
  if (/(מי אתם|על החברה|מה אתם עושים|איזה שירותים|מה השירותים|מחיר|כמה עולה)/.test(t)) return "company_info";

  // Technical issue keywords (Hebrew + English)
  const techKeywords = /(מחשב|לפטופ|רשת|wifi|אינטרנט|מדפסת|הדפס|מסך|תקוע|איטי|אטי|נדלק|כבה|שגיאה|error|בעיה|לא עובד|התקנ|עדכון|וירוס|אנטי|חלונות|windows|אופיס|office|דרייבר|driver|מקלדת|עכבר|אאוטלוק|outlook|דיסק|כונן|זיכרון|usb|חיבור|התחברות|סיסמה|חשבון|לוגין|נעול)/;
  if (techKeywords.test(t)) return "technical";

  return "technical"; // Default to technical (safer — uses main model)
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "אין הודעות בבקשה" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastUserMsg = [...messages].reverse().find((m: { role: string; content: string }) => m.role === "user");
    const lastUserText = lastUserMsg?.content?.trim() ?? "";

    // ===== 1. Cache hit for very common greetings (zero AI cost) =====
    const cacheKey = normalizeForCache(lastUserText);
    if (messages.length === 1 && COMMON_REPLIES[cacheKey]) {
      const cached = COMMON_REPLIES[cacheKey];
      // Return as a fake SSE stream so client can treat it identically
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const chunk = { choices: [{ delta: { content: cached } }] };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // ===== 2. Truncate conversation to last N messages (saves tokens) =====
    const trimmedMessages = messages.length > MAX_CONVERSATION_MESSAGES
      ? messages.slice(-MAX_CONVERSATION_MESSAGES)
      : messages;

    // ===== 3. Intent-based model & context selection =====
    const intent = classifyIntent(lastUserText);
    const useFastModel = intent === "greeting" || intent === "smalltalk" || intent === "contact" || intent === "company_info";
    const needsIssuesContext = intent === "technical";

    let issuesContext = "";
    if (needsIssuesContext) {
      const issues = await fetchIssuesFromSheet();
      issuesContext = "\n\nרשימת התקלות והפתרונות:\n" + issues.map((issue, i) =>
        `${i + 1}. תקלה: "${issue.description}" | קטגוריה: ${issue.category} | סקריפט תיקון:\n${issue.script}`
      ).join("\n\n");
    }

    // ===== 4. Warm, human system prompt =====
    const systemPrompt = `אתה "אתגר" — הבוט החם והאנושי של טק תרפי מחשבים. אתה מומחה תמיכה טכנית, אבל לפני הכל — אתה בנאדם.

הסגנון שלך:
🤝 חם ואמפתי — מתחיל לפעמים ב"וואו, מבין אותך, זה מעצבן" או "אל דאגה, נטפל בזה ביחד"
😊 משתמש באמוג'ים בצורה מדודה (1-2 בהודעה, לא יותר)
✨ מסביר בפשטות — אף פעם לא מתנשא, גם לא בעגה טכנית מסובכת
⚡ קצר וזורם — 2-4 שורות + סקריפט. אף אחד לא רוצה לקרוא מאמר
🎯 פרואקטיבי — ברגע שמבין את הבעיה, מציע פתרון. לא מבזבז זמן בשאלות אבחון מיותרות

מידע על החברה (כשמישהו שואל):
- טק תרפי מחשבים — תמיכה טכנית מקצועית ואישית
- שירותים: ייעוץ AI ואוטומציה, תמיכה מרחוק ובמקום, תיקון מחשבים, רשתות, התקנות
- וואטסאפ ישיר: 972545368629
${issuesContext}

הנחיות עבודה (חשוב!):
- כשמתאים סקריפט מהרשימה: עטוף ב-\`\`\`powershell ... \`\`\`, והוסף בסוף תגית מוסתרת [SCRIPT_NAME:שם התקלה המדויק מהרשימה]
- אם אין התאמה ברשימה: הוסף [NO_MATCH] בסוף, והפנה לוואטסאפ 972545368629
- לפני סקריפט — שורה אחת חמה שמסבירה מה הוא עושה (לא טכנית!)
- שאלות פתיחה / נימוסים: ענה בקצרה וחם, בלי להציע סקריפט סתם`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: useFastModel ? MODEL_FAST : MODEL_MAIN,
        messages: [
          { role: "system", content: systemPrompt },
          ...trimmedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסה שוב בעוד רגע." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "נגמרו הקרדיטים, פנה למנהל." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "שגיאה בשירות AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה לא ידועה" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
