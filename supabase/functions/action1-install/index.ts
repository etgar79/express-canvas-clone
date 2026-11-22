import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { isIP } from 'node:net';
import { allowedOrigin, hashIp, passwordMatches } from './security.ts';

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const allowed = allowedOrigin(origin);
  const headers = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': allowed ? origin : 'https://1979.co.il',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store, private',
    'Pragma': 'no-cache',
    'Vary': 'Origin',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  };
  const reply = (status: number, body: Record<string, string>) => new Response(JSON.stringify(body), { status, headers });
  if (!allowed) return reply(403, { error: 'הגישה נדחתה' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply(405, { error: 'הגישה נדחתה' });
  const expected = Deno.env.get('ACTION1_INSTALL_PASSWORD');
  const command = Deno.env.get('ACTION1_INSTALL_COMMAND');
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!expected || !command || !url || !key) return reply(503, { error: 'לא הוגדר' });
  try {
    // The gateway must append the real peer address. Never use the client-controlled first entry.
    const ip = (req.headers.get('x-forwarded-for') || '').split(',').at(-1)?.trim();
    if (!ip || !isIP(ip)) return reply(503, { error: 'לא הוגדר' });
    const raw = await req.text();
    if (raw.length > 8192) return reply(400, { error: 'בקשה לא תקינה' });
    let body;
    try { body = JSON.parse(raw); } catch { return reply(400, { error: 'בקשה לא תקינה' }); }
    if (!body || typeof body.password !== 'string' || body.password.length > 4096 || Object.keys(body).some(k => k !== 'password')) return reply(400, { error: 'בקשה לא תקינה' });
    const success = passwordMatches(body.password, expected);
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    // Password serves as a private salt with domain-separated HMAC; neither IP nor salt is persisted.
    const { data, error } = await db.rpc('record_action1_install_attempt', { p_ip_hash: hashIp(ip, expected), p_success: success });
    if (error) return reply(503, { error: 'לא הוגדר' });
    if (data === 429) return reply(429, { error: 'יותר מדי ניסיונות. נסו שוב בעוד 15 דקות' });
    if (data !== 200 || !success) return reply(401, { error: 'סיסמה שגויה' });
    return reply(200, { command });
  } catch { return reply(503, { error: 'לא הוגדר' }); }
});
