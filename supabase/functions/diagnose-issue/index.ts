import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { category, answers } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `אתה טכנאי IT מומחה עם 15+ שנות ניסיון באבחון תקלות מחשבים, רשתות, אבטחת סייבר ומצלמות אבטחה.

תפקידך: לאבחן תקלות טכניות על סמך תשובות הלקוח ולתת אבחנה ברורה ומקצועית.

כללים:
1. תן אבחנה קצרה וברורה (2-3 משפטים מקסימום)
2. ציין את הסיבה הסבירה ביותר לבעיה
3. תן טיפ אחד שהלקוח יכול לנסות בעצמו
4. סיים תמיד עם המלצה לפנות לטכנאי מקצועי אם הבעיה נמשכת

ענה בעברית. היה ידידותי ומקצועי.`;

    const userMessage = `קטגוריה: ${category}\n\nתשובות הלקוח:\n${answers.map((a: { question: string; answer: string }, i: number) => `${i + 1}. ${a.question}: ${a.answer}`).join('\n')}`;

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
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "יותר מדי בקשות, נסה שוב בעוד דקה" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "שירות לא זמין כרגע" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "שגיאה בשירות AI" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const diagnosis = data.choices?.[0]?.message?.content || "לא הצלחתי לאבחן. נסה שוב.";

    return new Response(JSON.stringify({ diagnosis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("diagnose error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה לא ידועה" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
