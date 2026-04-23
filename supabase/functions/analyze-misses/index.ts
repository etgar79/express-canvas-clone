import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function verifyTechPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const supabase = getSupabase();
  const { data } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "TECH_PASSWORD")
    .maybeSingle();
  const stored = data?.value || "0545368629";
  return password === stored;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, days = 14 } = await req.json();
    if (!await verifyTechPassword(password)) {
      return new Response(JSON.stringify({ error: "סיסמה שגויה" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabase();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: misses } = await supabase
      .from("bot_misses")
      .select("question, created_at, user_role")
      .gte("created_at", since)
      .eq("resolved", false)
      .order("created_at", { ascending: false })
      .limit(200);

    if (!misses || misses.length === 0) {
      return new Response(JSON.stringify({
        analysis: "אין בעיות חוזרות שלא טופלו בתקופה הזו. הבוט עונה היטב על השאלות! 🎉",
        suggestions: [],
        missCount: 0,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get existing scripts for context
    const { data: scripts } = await supabase
      .from("scripts")
      .select("name, description, category");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY חסר");
    }

    const questionsList = misses.map((m, i) => `${i + 1}. [${m.user_role || "?"}] ${m.question}`).join("\n");
    const scriptsList = (scripts || []).map(s => `- ${s.name} (${s.category}): ${s.description}`).join("\n");

    const systemPrompt = `אתה עוזר טכני שמנתח שאלות שהבוט לא הצליח לענות עליהן ב-Tech Therapy (תמיכה טכנית IT).
המטרה: לזהות דפוסים, בעיות חוזרות, ולהציע סקריפטים חדשים שכדאי להוסיף.

ענה בעברית, בפורמט JSON תקין בלבד עם המבנה הבא (ללא markdown, ללא הסברים נוספים):
{
  "summary": "סיכום קצר של הדפוסים העיקריים (2-3 שורות)",
  "patterns": [
    { "topic": "נושא הבעיה", "count": מספר, "examples": ["דוגמה 1", "דוגמה 2"] }
  ],
  "suggestions": [
    {
      "title": "שם הסקריפט המוצע",
      "description": "תיאור קצר מה הוא עושה",
      "category": "קטגוריה (למשל: רשת, ביצועים, הדפסה)",
      "priority": "high" / "medium" / "low",
      "reason": "למה זה חשוב — כמה אנשים שאלו על זה"
    }
  ]
}`;

    const userPrompt = `שאלות שהבוט לא ענה עליהן (${misses.length} שאלות מהשבועיים האחרונים):
${questionsList}

סקריפטים קיימים במערכת:
${scriptsList || "(אין סקריפטים)"}

נתח את השאלות, זהה דפוסים, והצע 2-5 סקריפטים חדשים שכדאי להוסיף לפי דחיפות.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("AI error:", aiResp.status, errText);
      throw new Error(`שגיאה ב-AI (${aiResp.status})`);
    }

    const aiData = await aiResp.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { summary: content, patterns: [], suggestions: [] };
    }

    return new Response(JSON.stringify({
      ...parsed,
      missCount: misses.length,
      analyzedDays: days,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-misses error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
