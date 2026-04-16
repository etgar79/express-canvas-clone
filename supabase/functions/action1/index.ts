import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHEET_ID = "1mR7NpQPcIxwURMKTrSP4scD7eYI4vYXnt2lBkyFNWxc";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAction1Token(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = Deno.env.get("ACTION1_CLIENT_ID");
  const clientSecret = Deno.env.get("ACTION1_CLIENT_SECRET");
  const orgId = Deno.env.get("ACTION1_ORG_ID");

  if (!clientId || !clientSecret || !orgId) {
    throw new Error("Action1 credentials not configured");
  }

  const resp = await fetch("https://app.eu.action1.com/api/3.0/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`,
  });

  const data = await resp.json();
  console.log("Action1 auth response status:", resp.status, "keys:", Object.keys(data));
  if (!data.access_token) {
    console.error("Action1 auth failed:", JSON.stringify(data));
    throw new Error("Failed to authenticate with Action1");
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return cachedToken.token;
}

function getOrgId(): string {
  return Deno.env.get("ACTION1_ORG_ID") || "";
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

async function getScriptFromSheet(scriptName: string): Promise<string | null> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
  const response = await fetch(url);
  if (!response.ok) return null;
  const csvText = await response.text();
  const lines = csvText.split("\n").filter(line => line.trim());

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const description = (cols[0] || "").trim();
    const script = (cols[1] || "").trim();
    if (description === scriptName && script) {
      return script;
    }
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
      const token = await getAction1Token();
      const orgId = getOrgId();
      const resp = await fetch(
        `https://app.eu.action1.com/api/3.0/organizations/${orgId}/endpoints?$top=100`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );

      if (!resp.ok) {
        return new Response(JSON.stringify({ error: "שגיאה בשליפת עמדות" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await resp.json();
      const items = data.items || data || [];
      const endpoints = items.map((e: any) => ({
        id: e.id,
        name: e.name || e.hostname || e.id,
        status: e.status || "unknown",
      }));

      return new Response(JSON.stringify({ endpoints }), {
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

      const scriptContent = await getScriptFromSheet(scriptName);
      if (!scriptContent) {
        return new Response(JSON.stringify({ error: "הסקריפט לא נמצא" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const token = await getAction1Token();
      const orgId = getOrgId();
      const jobResp = await fetch(
        `https://app.eu.action1.com/api/3.0/organizations/${orgId}/jobs`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `BotRun_${Date.now()}`,
            type: "PowerShell",
            script: scriptContent,
            targets: [endpointId],
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
