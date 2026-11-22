import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
const enabled = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.PGHOST);
async function request(path, method, body) {
 const response = await fetch(`http://127.0.0.1:8001/rest/v1/${path}`, { method, headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY || '', Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
 if (!response.ok) throw new Error(`Limiter test request failed: ${response.status}`);
 const text = await response.text(); return text ? JSON.parse(text) : null;
}
const attempt = (hash, success) => request('rpc/record_action1_install_attempt', 'POST', { p_ip_hash: hash, p_success: success });
const cleanup = hash => request(`action1_install_attempts?ip_hash=eq.${hash}`, 'DELETE');
test('five parallel failures allowed; lock survives rolling-window expiration', { skip: !enabled }, async () => {
 const hash = randomBytes(32).toString('hex');
 try {
  const results = await Promise.all(Array.from({ length: 20 }, () => attempt(hash, false)));
  assert.equal(results.filter(x => x === 401).length, 5);
  assert.equal(results.filter(x => x === 429).length, 15);
  assert.equal(await attempt(hash, true), 429);
  await request(`action1_install_attempts?ip_hash=eq.${hash}&result=eq.failure`, 'PATCH', { attempted_at: new Date(Date.now() - 16*60*1000).toISOString() });
  assert.equal(await attempt(hash, false), 429);
  await request(`action1_install_attempts?ip_hash=eq.${hash}&blocked_until=not.is.null`, 'PATCH', { blocked_until: new Date(Date.now()-1000).toISOString() });
  assert.equal(await attempt(hash, true), 200);
 } finally { await cleanup(hash); }
});
test('successful attempt resets the failure counter', { skip: !enabled }, async () => {
 const hash = randomBytes(32).toString('hex');
 try {
  for(let i=0;i<4;i++) assert.equal(await attempt(hash, false), 401);
  assert.equal(await attempt(hash, true), 200);
  for(let i=0;i<5;i++) assert.equal(await attempt(hash, false), 401);
  assert.equal(await attempt(hash, false), 429);
 } finally { await cleanup(hash); }
});
