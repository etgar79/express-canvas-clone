import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1mR7NpQPcIxwURMKTrSP4scD7eYI4vYXnt2lBkyFNWxc";

let cachedToken: { token: string; expiresAt: number } | null = null;

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

async function getAction1Config(): Promise<{ clientId: string; clientSecret: string; orgId: string }> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("app_settings")
    .select("key, value")
    .in("key", ["ACTION1_CLIENT_ID", "ACTION1_CLIENT_SECRET", "ACTION1_ORG_ID"]);

  const config: Record<string, string> = {};
  for (const row of data || []) {
    config[row.key] = row.value;
  }

  // Fallback to env vars if DB is empty
  const clientId = config.ACTION1_CLIENT_ID || Deno.env.get("ACTION1_CLIENT_ID") || "";
  const clientSecret = config.ACTION1_CLIENT_SECRET || Deno.env.get("ACTION1_CLIENT_SECRET") || "";
  const orgId = config.ACTION1_ORG_ID || Deno.env.get("ACTION1_ORG_ID") || "";

  if (!clientId || !clientSecret || !orgId) {
    throw new Error("Action1 credentials not configured");
  }

  return { clientId, clientSecret, orgId };
}

async function getAction1Token(): Promise<{ token: string; orgId: string }> {
  const config = await getAction1Config();

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return { token: cachedToken.token, orgId: config.orgId };
  }

  const resp = await fetch("https://app.eu.action1.com/api/3.0/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(config.clientId)}&client_secret=${encodeURIComponent(config.clientSecret)}`,
  });

  const data = await resp.json();
  if (!data.access_token) {
    console.error("Action1 auth failed:", resp.status, JSON.stringify(data));
    throw new Error("Failed to authenticate with Action1");
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return { token: cachedToken.token, orgId: config.orgId };
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

async function getScript(scriptName: string): Promise<string | null> {
  // Try DB first
  const supabase = getSupabase();
  const { data } = await supabase.from("scripts").select("script").eq("name", scriptName).maybeSingle();
  if (data?.script) return data.script;

  // Fallback to Google Sheets
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const csvText = await response.text();
  const lines = csvText.split("\n").filter(line => line.trim());
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const description = (cols[0] || "").trim();
    const script = (cols[1] || "").trim();
    if (description === scriptName && script) return script;
  }
  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "endpoints") {
      // Get client IP from headers
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
        || req.headers.get("x-real-ip") || "";
      console.log("Client IP:", clientIp);

      const { token, orgId } = await getAction1Token();
      const resp = await fetch(
        `https://app.eu.action1.com/api/3.0/endpoints/managed/${orgId}?fields=*`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );

      if (!resp.ok) {
        const errBody = await resp.text();
        console.error("Endpoints API error:", resp.status, errBody);
        return new Response(JSON.stringify({ error: `שגיאה בשליפת עמדות (${resp.status})` }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await resp.json();
      const items = data.items || data || [];
      const endpoints = items.map((e: any) => ({
        id: e.id,
        name: e.name || e.hostname || e.id,
        status: e.status || "unknown",
        externalAddress: e.external_address || e.address || "",
      }));

      // Try to auto-match by IP
      let matchedEndpoint = null;
      if (clientIp) {
        matchedEndpoint = endpoints.find((ep: any) => ep.externalAddress === clientIp);
      }

      return new Response(JSON.stringify({ 
        endpoints, 
        clientIp,
        matchedEndpoint: matchedEndpoint || null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "run") {
      const { scriptName, endpointId } = await req.json();
      if (!scriptName || !endpointId) {
        return new Response(JSON.stringify({ error: "חסרים פרטים" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const scriptContent = await getScript(scriptName);
      if (!scriptContent) {
        return new Response(JSON.stringify({ error: "הסקריפט לא נמצא" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { token, orgId } = await getAction1Token();
      const jobResp = await fetch(
        `https://app.eu.action1.com/api/3.0/automations/instances/${orgId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `BotRun_${scriptName}_${Date.now()}`,
            retry_minutes: "60",
            endpoints: [
              { id: endpointId, type: "Endpoint" }
            ],
            actions: [
              {
                name: "Run Script",
                template_id: "run_powershell",
                params: {
                  script_content: scriptContent,
                }
              }
            ]
          }),
        }
      );

      if (jobResp.ok) {
        const result = await jobResp.json();
        return new Response(JSON.stringify({ success: true, jobId: result.id || "sent" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const errText = await jobResp.text();
        console.error("Action1 job error:", jobResp.status, errText);
        return new Response(JSON.stringify({ error: "שגיאה בשליחת הסקריפט" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "פעולה לא מוכרת" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("action1 error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "שגיאה" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
