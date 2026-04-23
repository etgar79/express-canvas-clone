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
    const body = await req.json();
    const { action, password } = body;

    if (!await verifyTechPassword(password)) {
      return new Response(JSON.stringify({ error: "סיסמה שגויה" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabase();

    // === Endpoints metadata ===
    if (action === "list_metadata") {
      const { data, error } = await supabase
        .from("endpoints_metadata")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ metadata: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save_metadata") {
      const { metadata } = body;
      if (!metadata?.endpoint_id || !metadata?.endpoint_name) {
        return new Response(JSON.stringify({ error: "חסר endpoint_id או endpoint_name" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase
        .from("endpoints_metadata")
        .upsert({
          endpoint_id: metadata.endpoint_id,
          endpoint_name: metadata.endpoint_name,
          alias: metadata.alias || null,
          office: metadata.office || null,
          client: metadata.client || null,
          contact_phone: metadata.contact_phone || null,
          tags: metadata.tags || [],
          notes: metadata.notes || null,
          group_id: metadata.group_id || null,
        }, { onConflict: "endpoint_id" });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_metadata") {
      const { endpointId } = body;
      const { error } = await supabase.from("endpoints_metadata").delete().eq("endpoint_id", endpointId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Groups ===
    if (action === "list_groups") {
      const { data, error } = await supabase
        .from("endpoint_groups")
        .select("*")
        .order("name");
      if (error) throw error;
      return new Response(JSON.stringify({ groups: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save_group") {
      const { group } = body;
      if (!group?.name) {
        return new Response(JSON.stringify({ error: "חסר שם קבוצה" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (group.id) {
        const { error } = await supabase
          .from("endpoint_groups")
          .update({ name: group.name, description: group.description || null, color: group.color || "#3b82f6" })
          .eq("id", group.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("endpoint_groups")
          .insert({ name: group.name, description: group.description || null, color: group.color || "#3b82f6" });
        if (error) throw error;
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_group") {
      const { groupId } = body;
      // Unassign endpoints from this group first
      await supabase.from("endpoints_metadata").update({ group_id: null }).eq("group_id", groupId);
      const { error } = await supabase.from("endpoint_groups").delete().eq("id", groupId);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Executions history ===
    if (action === "list_executions") {
      const { limit = 100, status, scriptName, endpointId } = body;
      let query = supabase
        .from("script_executions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(Math.min(limit, 500));
      if (status && status !== "all") query = query.eq("status", status);
      if (scriptName) query = query.eq("script_name", scriptName);
      if (endpointId) query = query.eq("endpoint_id", endpointId);
      const { data, error } = await query;
      if (error) throw error;

      // Stats per script (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: statsRows } = await supabase
        .from("script_executions")
        .select("script_name, status")
        .gte("created_at", thirtyDaysAgo);
      
      const stats: Record<string, { total: number; success: number; failed: number }> = {};
      for (const row of statsRows || []) {
        if (!stats[row.script_name]) stats[row.script_name] = { total: 0, success: 0, failed: 0 };
        stats[row.script_name].total++;
        if (row.status === "completed") stats[row.script_name].success++;
        if (row.status === "failed") stats[row.script_name].failed++;
      }

      return new Response(JSON.stringify({ executions: data || [], stats }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // === Alert settings ===
    if (action === "get_alert_settings") {
      const { data, error } = await supabase.from("alert_settings").select("*");
      if (error) throw error;
      return new Response(JSON.stringify({ alerts: data || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "save_alert_settings") {
      const { alerts } = body;
      for (const a of alerts || []) {
        await supabase.from("alert_settings").upsert({
          id: a.id,
          alert_type: a.alert_type,
          enabled: a.enabled,
          recipient_email: a.recipient_email || null,
          config: a.config || {},
        }, { onConflict: "alert_type" });
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "פעולה לא מוכרת" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("manage-endpoints error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
