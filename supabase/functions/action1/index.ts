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

// In-memory rate limiter (per edge function instance, resets on cold start).
// Limit: 30 requests per minute per IP per action.
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitBuckets = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip")
    || req.headers.get("x-real-ip")
    || "unknown";
}

function checkRateLimit(ip: string, action: string): { allowed: boolean; retryAfter: number } {
  const key = `${action}:${ip}`;
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitBuckets.get(key) || []).filter(t => t > cutoff);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000);
    rateLimitBuckets.set(key, timestamps);
    return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
  }

  timestamps.push(now);
  rateLimitBuckets.set(key, timestamps);

  // Opportunistic cleanup to prevent unbounded growth
  if (rateLimitBuckets.size > 5000) {
    for (const [k, v] of rateLimitBuckets) {
      const filtered = v.filter(t => t > cutoff);
      if (filtered.length === 0) rateLimitBuckets.delete(k);
      else rateLimitBuckets.set(k, filtered);
    }
  }

  return { allowed: true, retryAfter: 0 };
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
    const role = url.searchParams.get("role") || "client"; // "client" | "tech"

    // Helper: fetch all endpoints from Action1
    const fetchAllEndpoints = async () => {
      const { token, orgId } = await getAction1Token();
      const resp = await fetch(
        `https://app.eu.action1.com/api/3.0/endpoints/managed/${orgId}?fields=*`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (!resp.ok) {
        const errBody = await resp.text();
        console.error("Endpoints API error:", resp.status, errBody);
        throw new Error(`שגיאה בשליפת עמדות (${resp.status})`);
      }
      const data = await resp.json();
      const items = data.items || data || [];
      return items.map((e: any) => ({
        id: e.id,
        name: e.name || e.device_name || e.hostname || e.id,
        status: e.status || "unknown",
        lanIp: e.address || "",
        lastSeen: e.last_seen || "",
        platform: e.platform || "",
      }));
    };

    // Soft-normalize: lowercase, strip spaces/dashes/underscores/dots, normalize unicode,
    // and map common Hebrew↔English lookalike characters so users can type in either language.
    const normalizeName = (raw: string): string => {
      let s = (raw || "").normalize("NFKC").toLowerCase().trim();
      // Remove whitespace, dashes, underscores, dots
      s = s.replace(/[\s\-_.]+/g, "");
      // Map visually/phonetically similar chars (Hebrew → Latin) – best-effort
      const map: Record<string, string> = {
        "א": "a", "ב": "b", "ג": "g", "ד": "d", "ה": "h", "ו": "v",
        "ז": "z", "ח": "h", "ט": "t", "י": "y", "כ": "k", "ך": "k",
        "ל": "l", "מ": "m", "ם": "m", "נ": "n", "ן": "n", "ס": "s",
        "ע": "a", "פ": "p", "ף": "p", "צ": "ts", "ץ": "ts", "ק": "k",
        "ר": "r", "ש": "sh", "ת": "t",
      };
      let out = "";
      for (const ch of s) out += map[ch] ?? ch;
      return out;
    };

    // CLIENT-SAFE: lookup endpoint by name with soft matching. Does NOT leak the endpoint list.
    if (action === "lookup") {
      const rawName = url.searchParams.get("name") || "";
      const needle = normalizeName(rawName);
      if (!needle) {
        return new Response(JSON.stringify({ error: "חסר שם מחשב" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const all = await fetchAllEndpoints();
      // 1) Exact normalized match
      let match = all.find((e: any) => normalizeName(e.name || "") === needle);
      // 2) Partial matches (either direction)
      const partial = match
        ? []
        : all.filter((e: any) => {
            const n = normalizeName(e.name || "");
            return n && (n.includes(needle) || needle.includes(n));
          });

      if (!match && partial.length === 1) {
        match = partial[0];
      }

      if (match) {
        return new Response(JSON.stringify({
          found: true,
          endpoint: { id: match.id, name: match.name, status: match.status },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Multiple partial matches → return a small list (cap at 8) for the user to pick
      if (partial.length > 1) {
        const candidates = partial.slice(0, 8).map((e: any) => ({
          id: e.id, name: e.name, status: e.status,
        }));
        return new Response(JSON.stringify({ found: false, candidates }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ found: false, candidates: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // TECH-ONLY: full endpoints listing (used by technician interface)
    if (action === "endpoints") {
      if (role !== "tech") {
        return new Response(JSON.stringify({ error: "אין הרשאה" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const endpoints = await fetchAllEndpoints();
      return new Response(JSON.stringify({ endpoints, matchedEndpoint: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Poll job status from Action1
    if (action === "status") {
      const jobId = url.searchParams.get("jobId");
      if (!jobId) {
        return new Response(JSON.stringify({ error: "חסר jobId" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { token, orgId } = await getAction1Token();
      const resp = await fetch(
        `https://app.eu.action1.com/api/3.0/automations/instances/${orgId}/${jobId}`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (!resp.ok) {
        const errBody = await resp.text();
        console.error("Status API error:", resp.status, errBody);
        return new Response(JSON.stringify({ error: `שגיאה בשליפת סטטוס (${resp.status})` }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const data = await resp.json();
      // Action1 returns status fields like: status, state, result, etc.
      // Normalize to a simple state machine: queued | running | completed | failed
      const rawStatus = String(data.status || data.state || "").toLowerCase();
      let normalized: "queued" | "running" | "completed" | "failed" = "queued";
      if (["running", "in_progress", "executing", "started"].includes(rawStatus)) {
        normalized = "running";
      } else if (["completed", "success", "succeeded", "finished", "done"].includes(rawStatus)) {
        normalized = "completed";
      } else if (["failed", "error", "failure", "cancelled", "canceled", "timeout"].includes(rawStatus)) {
        normalized = "failed";
      } else if (["queued", "pending", "scheduled", "waiting"].includes(rawStatus)) {
        normalized = "queued";
      }

      // Try to derive per-endpoint outcome if available
      const endpoints = data.endpoints || data.results || data.targets || [];
      const endpointSummary = Array.isArray(endpoints)
        ? endpoints.map((e: any) => ({
            id: e.id || e.endpoint_id || "",
            name: e.name || e.endpoint_name || "",
            status: String(e.status || e.state || e.result || "").toLowerCase(),
          }))
        : [];

      return new Response(JSON.stringify({
        jobId,
        status: normalized,
        rawStatus,
        endpoints: endpointSummary,
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
