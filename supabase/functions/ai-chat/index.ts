import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SHEET_ID = "1mR7NpQPcIxwURMKTrSP4scD7eYI4vYXnt2lBkyFNWxc";

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
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
  const response = await fetch(url);
  if (!response.ok) return [];
  const csvText = await response.text();
  const lines = csvText.split("\n").filter(line => line.trim());
  if (lines.length < 2) return [];

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
  return issues;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch issues from spreadsheet for context
    const issues = await fetchIssuesFromSheet();
    const issuesContext = issues.map((issue, i) => 
      `${i + 1}. תקלה: "${issue.description}" | קטגוריה: ${issue.category} | סקריפט תיקון:\n${issue.script}`
    ).join("\n\n");

    const systemPrompt = `אתה "הבוט של אתגר" - הבוט החכם של אקספרס IT, חברת תמיכה טכנית מקצועית ואישית.
אתה מדבר בעברית, ידידותי, מקצועי ומסביר בפשטות.

להלן רשימת התקלות והפתרונות שיש לך גישה אליהם:

${issuesContext}

הנחיות:
- כשלקוח מתאר בעיה, נסה להתאים אותה לאחת התקלות ברשימה ותן לו את הסקריפט המתאים.
- הסבר בקצרה מה הסקריפט עושה לפני שאתה נותן אותו.
- עטוף סקריפטים בבלוק קוד (\`\`\`).
- אם הבעיה לא נמצאת ברשימה, נסה לעזור עם ידע כללי או הצע ליצור קשר דרך וואטסאפ: 972545368629.
- תהיה קצר ולעניין, אל תכתוב יותר מדי.
- אם הלקוח שואל שאלה כללית על שירותי החברה, ספר שאקספרס IT מספקים תמיכה טכנית מרחוק ובמקום, תיקון מחשבים, הקמת רשתות, שרתים ועוד.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
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
