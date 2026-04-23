import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = "Tech Therapy Alerts <onboarding@resend.dev>";
const DEFAULT_TO = "sos@1979.co.il";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY missing — skipping email");
    return { skipped: true };
  }
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    console.error("Resend error:", resp.status, data);
    throw new Error(`Resend ${resp.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function fmtTime(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
  } catch { return iso; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = getSupabase();
    const body = await req.json().catch(() => ({}));
    const { executionId, jobId } = body;

    // Load alert settings
    const { data: settings } = await supabase
      .from("alert_settings")
      .select("*")
      .eq("alert_type", "script_failure")
      .maybeSingle();

    if (settings && settings.enabled === false) {
      return new Response(JSON.stringify({ skipped: true, reason: "alerts_disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const recipient = settings?.recipient_email || DEFAULT_TO;

    // Find the failed execution(s)
    let query = supabase
      .from("script_executions")
      .select("*")
      .eq("status", "failed")
      .eq("alert_sent", false);
    if (executionId) query = query.eq("id", executionId);
    else if (jobId) query = query.eq("job_id", jobId);
    else query = query.gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString());

    const { data: failures, error } = await query.limit(20);
    if (error) throw error;
    if (!failures || failures.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "no_pending_failures" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0;
    for (const ex of failures) {
      const subject = `❌ סקריפט נכשל: ${ex.script_name} — ${ex.endpoint_alias || ex.endpoint_name || ex.endpoint_id}`;
      const html = `
        <div style="font-family: Heebo, Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 16px; border: 1px solid #e5e7eb;">
          <h2 style="color: #dc2626; margin: 0 0 16px;">⚠️ הרצת סקריפט נכשלה</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 140px;">סקריפט:</td><td style="font-weight: 600;">${ex.script_name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">מחשב:</td><td>${ex.endpoint_alias || ex.endpoint_name || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">מזהה Action1:</td><td style="font-family: monospace; font-size: 12px;">${ex.endpoint_id || "—"}</td></tr>
            ${ex.group_name ? `<tr><td style="padding: 8px 0; color: #6b7280;">קבוצה:</td><td>${ex.group_name}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #6b7280;">הופעל ע"י:</td><td>${ex.triggered_by || "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">זמן:</td><td>${fmtTime(ex.created_at)}</td></tr>
            ${ex.error_message ? `<tr><td style="padding: 8px 0; color: #6b7280; vertical-align: top;">שגיאה:</td><td style="color: #dc2626; font-family: monospace; font-size: 12px;">${ex.error_message}</td></tr>` : ""}
          </table>
          <p style="color: #6b7280; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            התראה אוטומטית • <a href="https://1979.co.il/tech" style="color: #ea7c19;">פתח דשבורד טכנאי</a>
          </p>
        </div>
      `;

      try {
        await sendEmail(recipient, subject, html);
        await supabase.from("script_executions").update({ alert_sent: true }).eq("id", ex.id);
        sent++;
      } catch (e) {
        console.error("Failed to send alert for execution", ex.id, e);
      }
    }

    return new Response(JSON.stringify({ sent, recipient }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("alert-failure error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
