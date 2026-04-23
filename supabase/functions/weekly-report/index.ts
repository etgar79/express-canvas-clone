import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "Tech Therapy Reports <onboarding@resend.dev>";
const DEFAULT_TO = "sos@1979.co.il";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return { skipped: true };
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(`Resend ${resp.status}: ${JSON.stringify(data)}`);
  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();

    // Recipient from settings (fallback to default)
    const { data: settings } = await supabase
      .from("alert_settings")
      .select("*")
      .eq("alert_type", "weekly_report")
      .maybeSingle();
    if (settings && settings.enabled === false) {
      return new Response(JSON.stringify({ skipped: true, reason: "report_disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const recipient = settings?.recipient_email || DEFAULT_TO;

    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

    // Pull data in parallel
    const [execRes, missesRes, usageRes, ratingsRes] = await Promise.all([
      supabase.from("script_executions").select("script_name, status, endpoint_alias, endpoint_name, triggered_by, error_message, created_at").gte("created_at", weekAgo),
      supabase.from("bot_misses").select("question, created_at").gte("created_at", weekAgo),
      supabase.from("script_usage").select("script_name, event_type, created_at").gte("created_at", weekAgo),
      supabase.from("script_ratings").select("rating, script_name").gte("created_at", weekAgo),
    ]);

    const executions = execRes.data || [];
    const misses = missesRes.data || [];
    const usage = usageRes.data || [];
    const ratings = ratingsRes.data || [];

    const total = executions.length;
    const success = executions.filter(e => e.status === "completed").length;
    const failed = executions.filter(e => e.status === "failed").length;
    const queued = executions.filter(e => e.status === "queued" || e.status === "running").length;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    // Top scripts by run count
    const scriptCounts: Record<string, { total: number; success: number; failed: number }> = {};
    for (const e of executions) {
      const k = e.script_name;
      if (!scriptCounts[k]) scriptCounts[k] = { total: 0, success: 0, failed: 0 };
      scriptCounts[k].total++;
      if (e.status === "completed") scriptCounts[k].success++;
      if (e.status === "failed") scriptCounts[k].failed++;
    }
    const topScripts = Object.entries(scriptCounts).sort((a, b) => b[1].total - a[1].total).slice(0, 5);

    // Recent failures
    const recentFailures = executions.filter(e => e.status === "failed").slice(-5).reverse();

    // Bot stats
    const botSuggested = usage.filter(u => u.event_type === "suggested").length;
    const botCopied = usage.filter(u => u.event_type === "copied").length;
    const botRun = usage.filter(u => u.event_type === "run").length;
    const avgRating = ratings.length > 0
      ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
      : "—";

    const fmtDate = (iso: string) => {
      try { return new Date(iso).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); }
      catch { return iso; }
    };

    const html = `
      <div style="font-family: Heebo, Arial, sans-serif; direction: rtl; max-width: 640px; margin: 0 auto; background: #fff; padding: 28px; border-radius: 16px; border: 1px solid #e5e7eb;">
        <h1 style="color: #1f2937; margin: 0 0 8px; font-size: 22px;">📊 דוח שבועי — Tech Therapy</h1>
        <p style="color: #6b7280; margin: 0 0 24px; font-size: 13px;">סיכום פעילות מהשבוע האחרון (${fmtDate(weekAgo)} עד עכשיו)</p>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="background: #f9fafb; border-radius: 12px; padding: 14px;">
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px;">סה"כ הרצות</div>
            <div style="font-size: 24px; font-weight: 700; color: #1f2937;">${total}</div>
          </div>
          <div style="background: #f0fdf4; border-radius: 12px; padding: 14px;">
            <div style="font-size: 11px; color: #16a34a; margin-bottom: 4px;">אחוז הצלחה</div>
            <div style="font-size: 24px; font-weight: 700; color: #16a34a;">${successRate}%</div>
          </div>
          <div style="background: #fef2f2; border-radius: 12px; padding: 14px;">
            <div style="font-size: 11px; color: #dc2626; margin-bottom: 4px;">כשלונות</div>
            <div style="font-size: 24px; font-weight: 700; color: #dc2626;">${failed}</div>
          </div>
          <div style="background: #fef3c7; border-radius: 12px; padding: 14px;">
            <div style="font-size: 11px; color: #b45309; margin-bottom: 4px;">בתור / רץ</div>
            <div style="font-size: 24px; font-weight: 700; color: #b45309;">${queued}</div>
          </div>
        </div>

        <h2 style="font-size: 16px; color: #1f2937; margin: 24px 0 12px;">🏆 סקריפטים מובילים</h2>
        ${topScripts.length === 0 ? `<p style="color: #9ca3af; font-size: 13px;">אין הרצות השבוע</p>` : `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background: #f9fafb;"><th style="text-align: right; padding: 8px; color: #6b7280; font-weight: 500;">סקריפט</th><th style="text-align: center; padding: 8px; color: #6b7280; font-weight: 500;">סה"כ</th><th style="text-align: center; padding: 8px; color: #16a34a; font-weight: 500;">✓</th><th style="text-align: center; padding: 8px; color: #dc2626; font-weight: 500;">✗</th></tr>
          </thead>
          <tbody>
            ${topScripts.map(([name, s]) => `<tr style="border-bottom: 1px solid #f3f4f6;"><td style="padding: 8px;">${name}</td><td style="text-align: center; padding: 8px;">${s.total}</td><td style="text-align: center; padding: 8px; color: #16a34a;">${s.success}</td><td style="text-align: center; padding: 8px; color: #dc2626;">${s.failed}</td></tr>`).join("")}
          </tbody>
        </table>`}

        ${recentFailures.length > 0 ? `
        <h2 style="font-size: 16px; color: #1f2937; margin: 24px 0 12px;">❌ כשלונות אחרונים</h2>
        <ul style="padding: 0; list-style: none; margin: 0;">
          ${recentFailures.map(f => `<li style="padding: 10px; background: #fef2f2; border-radius: 8px; margin-bottom: 6px; font-size: 13px;"><strong>${f.script_name}</strong> על <em>${f.endpoint_alias || f.endpoint_name || "—"}</em><br/><span style="color: #6b7280; font-size: 11px;">${fmtDate(f.created_at)}${f.error_message ? ` • ${f.error_message}` : ""}</span></li>`).join("")}
        </ul>` : ""}

        <h2 style="font-size: 16px; color: #1f2937; margin: 24px 0 12px;">🤖 פעילות בוט AI</h2>
        <div style="background: #f9fafb; border-radius: 12px; padding: 14px; font-size: 13px; color: #374151;">
          הבוט הציע <strong>${botSuggested}</strong> סקריפטים, <strong>${botCopied}</strong> הועתקו, <strong>${botRun}</strong> הורצו.
          <br/>דירוג ממוצע: <strong>${avgRating}</strong> ${ratings.length > 0 ? `(${ratings.length} דירוגים)` : ""}.
          <br/>נשאלו <strong>${misses.length}</strong> שאלות שהבוט לא ידע לענות עליהן.
        </div>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 28px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
          דוח אוטומטי • <a href="https://1979.co.il/tech" style="color: #ea7c19;">פתח דשבורד מלא</a>
        </p>
      </div>
    `;

    await sendEmail(recipient, `📊 דוח שבועי — ${total} הרצות, ${successRate}% הצלחה`, html);

    return new Response(JSON.stringify({ sent: true, recipient, total, successRate }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("weekly-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
