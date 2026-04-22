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
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const body = await req.json();
    const { action, password } = body;

    // Verify tech password
    const { data: pwRow } = await supabase.from("app_settings").select("value").eq("key", "TECH_PASSWORD").single();
    const techPassword = pwRow?.value || "06536368";
    if (password !== techPassword) return json({ error: "סיסמה שגויה" }, 401);

    // --- Settings ---
    if (action === "get") {
      const { data } = await supabase.from("app_settings").select("key, value")
        .in("key", ["ACTION1_CLIENT_ID", "ACTION1_CLIENT_SECRET", "ACTION1_ORG_ID", "TECH_PASSWORD", "ONEDRIVE_FOLDER_LINK"]);
      const settings: Record<string, string> = {};
      for (const row of data || []) {
        settings[row.key] = row.key === "ACTION1_CLIENT_SECRET" ? "••••••" + (row.value?.slice(-4) || "") : row.value;
      }
      return json({ settings });
    }

    if (action === "update") {
      const { settings } = body as { settings: Record<string, string> };
      if (!settings || typeof settings !== "object") return json({ error: "נתונים חסרים" }, 400);
      const allowedKeys = ["ACTION1_CLIENT_ID", "ACTION1_CLIENT_SECRET", "ACTION1_ORG_ID", "TECH_PASSWORD", "ONEDRIVE_FOLDER_LINK"];
      for (const [key, value] of Object.entries(settings)) {
        if (!allowedKeys.includes(key)) continue;
        if (key === "ACTION1_CLIENT_SECRET" && value.startsWith("••••")) continue;
        if (!value || typeof value !== "string" || value.length > 500) continue;
        await supabase.from("app_settings").upsert({ key, value: value.trim(), updated_at: new Date().toISOString() });
      }
      return json({ success: true });
    }

    // --- Scripts CRUD ---
    if (action === "get_scripts") {
      const { data, error } = await supabase.from("scripts").select("*").order("category").order("name");
      if (error) return json({ error: error.message }, 500);
      return json({ scripts: data });
    }

    if (action === "save_script") {
      const { script } = body;
      if (!script?.name || !script?.script) return json({ error: "שם וסקריפט חובה" }, 400);
      
      const row = {
        name: script.name.trim().slice(0, 200),
        description: (script.description || "").trim().slice(0, 500),
        script: script.script.trim(),
        category: (script.category || "כללי").trim().slice(0, 50),
        is_public: script.is_public !== false,
        updated_at: new Date().toISOString(),
      };

      if (script.id) {
        const { error } = await supabase.from("scripts").update(row).eq("id", script.id);
        if (error) return json({ error: error.message }, 500);
      } else {
        const { error } = await supabase.from("scripts").insert(row);
        if (error) return json({ error: error.message }, 500);
      }
      return json({ success: true });
    }

    if (action === "delete_script") {
      const { scriptId } = body;
      if (!scriptId) return json({ error: "מזהה חסר" }, 400);
      const { error } = await supabase.from("scripts").delete().eq("id", scriptId);
      if (error) return json({ error: error.message }, 500);
      return json({ success: true });
    }

    if (action === "sync_from_sheets") {
      const SHEET_ID = "1mR7NpQPcIxwURMKTrSP4scD7eYI4vYXnt2lBkyFNWxc";
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
      const resp = await fetch(url);
      if (!resp.ok) return json({ error: "שגיאה בגישה לגיליון" }, 500);
      const csvText = await resp.text();
      const lines = csvText.split("\n").filter(l => l.trim());
      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        const name = (cols[0] || "").trim();
        const script = (cols[1] || "").trim();
        const category = (cols[2] || "כללי").trim();
        if (!name || !script) continue;
        // Upsert by name
        const { data: existing } = await supabase.from("scripts").select("id").eq("name", name).maybeSingle();
        if (existing) {
          await supabase.from("scripts").update({ script, category, updated_at: new Date().toISOString() }).eq("id", existing.id);
        } else {
          await supabase.from("scripts").insert({ name, script, category, description: "", is_public: true });
        }
        imported++;
      }
      return json({ success: true, imported });
    }

    if (action === "sync_from_onedrive") {
      const { data: linkRow } = await supabase.from("app_settings").select("value").eq("key", "ONEDRIVE_FOLDER_LINK").single();
      const folderLink = linkRow?.value?.trim();
      if (!folderLink) return json({ error: "לא הוגדר לינק OneDrive בהגדרות" }, 400);

      try {
        const result = await syncFromOneDrive(folderLink, supabase);
        return json({ success: true, ...result });
      } catch (e) {
        console.error("onedrive sync error:", e);
        return json({ error: e instanceof Error ? e.message : "שגיאה בסנכרון מ-OneDrive" }, 500);
      }
    }

    return json({ error: "פעולה לא מוכרת" }, 400);
  } catch (e) {
    console.error("settings error:", e);
    return json({ error: "שגיאה פנימית" }, 500);
  }
});

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) { result.push(current); current = ""; }
    else current += char;
  }
  result.push(current);
  return result;
}
