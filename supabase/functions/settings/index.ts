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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = getSupabase();

  try {
    const body = await req.json();
    const { action, password } = body;

    // Verify tech password
    const { data: pwRow } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "TECH_PASSWORD")
      .single();

    const techPassword = pwRow?.value || "06536368";
    if (password !== techPassword) {
      return new Response(JSON.stringify({ error: "סיסמה שגויה" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get") {
      const { data } = await supabase
        .from("app_settings")
        .select("key, value")
        .in("key", ["ACTION1_CLIENT_ID", "ACTION1_CLIENT_SECRET", "ACTION1_ORG_ID", "TECH_PASSWORD"]);

      const settings: Record<string, string> = {};
      for (const row of data || []) {
        settings[row.key] = row.key === "ACTION1_CLIENT_SECRET"
          ? "••••••" + (row.value?.slice(-4) || "")
          : row.value;
      }

      return new Response(JSON.stringify({ settings }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { settings } = body as { settings: Record<string, string> };
      if (!settings || typeof settings !== "object") {
        return new Response(JSON.stringify({ error: "נתונים חסרים" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const allowedKeys = ["ACTION1_CLIENT_ID", "ACTION1_CLIENT_SECRET", "ACTION1_ORG_ID", "TECH_PASSWORD"];

      for (const [key, value] of Object.entries(settings)) {
        if (!allowedKeys.includes(key)) continue;
        if (key === "ACTION1_CLIENT_SECRET" && value.startsWith("••••")) continue; // Skip masked value
        if (!value || typeof value !== "string" || value.length > 500) continue;

        await supabase
          .from("app_settings")
          .upsert({ key, value: value.trim(), updated_at: new Date().toISOString() });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "פעולה לא מוכרת" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("settings error:", e);
    return new Response(JSON.stringify({ error: "שגיאה פנימית" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
