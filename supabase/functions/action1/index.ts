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
      const ip = getClientIp(req);
      const rl = checkRateLimit(ip, "lookup");
      if (!rl.allowed) {
        return new Response(
          JSON.stringify({ error: `יותר מדי בקשות. נסה שוב בעוד ${rl.retryAfter} שניות.` }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(rl.retryAfter) },
          }
        );
      }
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
      const ip = getClientIp(req);
      const rl = checkRateLimit(ip, "status");
      if (!rl.allowed) {
        return new Response(
          JSON.stringify({ error: `יותר מדי בקשות. נסה שוב בעוד ${rl.retryAfter} שניות.` }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": String(rl.retryAfter) },
          }
        );
      }
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
      console.log("Action1 status response:", JSON.stringify(data).slice(0, 2000));

      let endpointResultsPayload: any = null;
      const endpointResultsUrl =
        typeof data.endpoint_results === "string" && data.endpoint_results.trim().length > 0
          ? data.endpoint_results.trim()
          : typeof data.endpointResults === "string" && data.endpointResults.trim().length > 0
            ? data.endpointResults.trim()
            : null;

      if (endpointResultsUrl) {
        try {
          const endpointResp = await fetch(endpointResultsUrl, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          });
          if (endpointResp.ok) {
            endpointResultsPayload = await endpointResp.json();
            console.log("Action1 endpoint results response:", JSON.stringify(endpointResultsPayload).slice(0, 2000));
          } else {
            const endpointErr = await endpointResp.text();
            console.error("Action1 endpoint results error:", endpointResp.status, endpointErr);
          }
        } catch (endpointError) {
          console.error("Action1 endpoint results fetch failed:", endpointError);
        }
      }

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

      const endpointResults = endpointResultsPayload?.items
        || endpointResultsPayload?.items
        || endpointResultsPayload?.results
        || endpointResultsPayload?.endpoints
        || endpointResultsPayload?.data
        || data.endpoints
        || data.results
        || data.targets
        || [];

      const endpointSummary = Array.isArray(endpointResults)
        ? endpointResults.map((e: any) => {
            const endpointInfo = e.endpoint || e.target || e.device || {};
            const status = String(
              e.status
              || e.state
              || e.result
              || e.execution_status
              || e.outcome
              || endpointInfo.status
              || ""
            ).toLowerCase();

            const errorMessage = [
              e.description, // Action1 puts the real error here for endpoint_results items
              e.error_message,
              e.errorMessage,
              e.failure_reason,
              e.result_message,
              e.message,
              e.stderr,
              e.output,
              e.details?.message,
              e.last_error,
              e.action_name && status !== "completed" && status !== "success" ? null : null, // placeholder
              endpointInfo.error_message,
            ].find((value): value is string => typeof value === "string" && value.trim().length > 0) || null;

            return {
              id: e.id || e.endpoint_id || e.endpointId || endpointInfo.id || "",
              name: e.name || e.endpoint_name || e.endpointName || endpointInfo.name || endpointInfo.device_name || "",
              status,
              errorMessage,
              exitCode: e.exit_code ?? e.exitCode ?? e.result_code ?? null,
            };
          })
        : [];

      const failedEndpoint = endpointSummary.find((e: any) => (
        ["failed", "error", "failure", "cancelled", "canceled", "timeout"].includes(e.status)
        || (typeof e.exitCode === "number" && e.exitCode !== 0)
      ));

      if (normalized !== "failed" && failedEndpoint) {
        normalized = "failed";
      }

      // Try to extract a meaningful error from many possible fields Action1 uses
      const errorMessage = [
        data.error_message,
        data.errorMessage,
        data.message,
        data.developer_message,
        data.user_message,
        data.result_summary,
        data.error,
        data.failure_reason,
        failedEndpoint?.name && failedEndpoint?.errorMessage ? `${failedEndpoint.name}: ${failedEndpoint.errorMessage}` : null,
        failedEndpoint?.errorMessage,
        typeof failedEndpoint?.exitCode === "number" && failedEndpoint.exitCode !== 0 ? `${failedEndpoint.name || "Script"}: Exit code ${failedEndpoint.exitCode}` : null,
      ].find((value): value is string => typeof value === "string" && value.trim().length > 0) || null;

      return new Response(JSON.stringify({
        jobId,
        status: normalized,
        rawStatus,
        errorMessage,
        endpoints: endpointSummary,
        raw: data, // include full response for debugging
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "run") {
      const body = await req.json();
      const { scriptName, scriptContent: adHocScript, endpointId, endpointIds, groupId, userRole, triggeredBy } = body;
      
      // Support both single endpointId (backward compat) and multiple endpointIds
      const targetIds: string[] = endpointIds && Array.isArray(endpointIds) && endpointIds.length > 0
        ? endpointIds
        : (endpointId ? [endpointId] : []);

      // Either a saved script name OR raw script content (ad-hoc paste) is required
      const hasAdHoc = typeof adHocScript === "string" && adHocScript.trim().length > 0;
      if ((!scriptName && !hasAdHoc) || targetIds.length === 0) {
        return new Response(JSON.stringify({ error: "חסרים פרטים" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Resolve script content: ad-hoc takes precedence; otherwise look up by name
      let scriptContent: string | null = hasAdHoc ? adHocScript : null;
      if (!scriptContent && scriptName) {
        scriptContent = await getScript(scriptName);
      }
      if (!scriptContent) {
        return new Response(JSON.stringify({ error: "הסקריפט לא נמצא" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Display name for logs (ad-hoc gets a clear label)
      const logScriptName = scriptName || `ad-hoc (${adHocScript.trim().split("\n")[0].slice(0, 40)})`;

      const { token, orgId } = await getAction1Token();
      
      // Fetch endpoint names + metadata for logging
      const supabase = getSupabase();
      const allEndpoints = await fetchAllEndpoints();
      const endpointMap = new Map(allEndpoints.map((e: any) => [e.id, e]));
      
      const { data: metadataRows } = await supabase
        .from("endpoints_metadata")
        .select("endpoint_id, alias, office, client")
        .in("endpoint_id", targetIds);
      const metaMap = new Map((metadataRows || []).map(m => [m.endpoint_id, m]));
      
      let groupName: string | null = null;
      if (groupId) {
        const { data: g } = await supabase.from("endpoint_groups").select("name").eq("id", groupId).maybeSingle();
        groupName = g?.name || null;
      }

      const jobName = `BotRun_${(scriptName || "adhoc").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40)}_${Date.now()}`;
      const jobPayload = {
        name: jobName,
        retry_minutes: "60",
        endpoints: targetIds.map(id => ({ id, type: "Endpoint" })),
        actions: [
          {
            name: "Run Script",
            template_id: "run_powershell",
            // Action1's run_powershell template expects `script_text` (not script_content).
            // We send both keys for forward/back compatibility with template variants.
            params: { script_text: scriptContent, script_content: scriptContent }
          }
        ]
      };
      console.log("Action1 job payload:", JSON.stringify(jobPayload).slice(0, 500));

      const jobResp = await fetch(
        `https://app.eu.action1.com/api/3.0/automations/instances/${orgId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobPayload),
        }
      );

      if (jobResp.ok) {
        const result = await jobResp.json();
        const jobId = result.id || "sent";
        
        // Log execution(s) to script_executions table — one row per endpoint
        const executionRows = targetIds.map(epId => {
          const ep: any = endpointMap.get(epId);
          const meta: any = metaMap.get(epId);
          return {
            script_name: logScriptName,
            endpoint_id: epId,
            endpoint_name: ep?.name || epId,
            endpoint_alias: meta?.alias || null,
            group_id: groupId || null,
            group_name: groupName,
            job_id: jobId,
            status: "queued",
            user_role: userRole || "unknown",
            triggered_by: triggeredBy || (userRole === "tech" ? "tech-dashboard" : "chatbot"),
          };
        });
        await supabase.from("script_executions").insert(executionRows);
        
        return new Response(JSON.stringify({ 
          success: true, 
          jobId, 
          targetCount: targetIds.length 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const errText = await jobResp.text();
        console.error("Action1 job error:", jobResp.status, errText);
        
        // Log failed attempt
        const failRows = targetIds.map(epId => {
          const ep: any = endpointMap.get(epId);
          const meta: any = metaMap.get(epId);
          return {
            script_name: logScriptName,
            endpoint_id: epId,
            endpoint_name: ep?.name || epId,
            endpoint_alias: meta?.alias || null,
            group_id: groupId || null,
            group_name: groupName,
            status: "failed",
            user_role: userRole || "unknown",
            triggered_by: triggeredBy || "unknown",
            error_message: `Action1 API error ${jobResp.status}`,
          };
        });
        await supabase.from("script_executions").insert(failRows);
        
        return new Response(JSON.stringify({ error: "שגיאה בשליחת הסקריפט" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Update execution status (called from frontend after polling completes)
    if (action === "update_execution") {
      const { jobId, status, errorMessage, durationMs } = await req.json();
      if (!jobId || !status) {
        return new Response(JSON.stringify({ error: "חסרים פרטים" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const supabase = getSupabase();
      await supabase
        .from("script_executions")
        .update({
          status,
          error_message: errorMessage || null,
          duration_ms: durationMs || null,
          completed_at: new Date().toISOString(),
        })
        .eq("job_id", jobId)
        .eq("status", "queued");

      // Trigger failure alert if status is failed (fire-and-forget)
      if (status === "failed") {
        try {
          fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/alert-failure`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({ jobId }),
          }).catch(e => console.error("alert dispatch failed:", e));
        } catch (e) { console.error("alert dispatch error:", e); }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
