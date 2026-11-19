import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PRERENDER_ROUTES, startStaticServer } from './prerender.mjs';

test('prerender includes exactly the five requested public routes', () => {
  assert.deepEqual(PRERENDER_ROUTES, ['/ai-services', '/support', '/privacy', '/accessibility', '/it-maintenance']);
});
test('technician dashboard is never prerendered', () => {
  assert.equal(PRERENDER_ROUTES.includes('/tech-dashboard'), false);
});
test('diagnostics is never prerendered', () => {
  assert.equal(PRERENDER_ROUTES.includes('/diagnostics'), false);
});
test('every prerender route has a trailing-slash sitemap URL and maintenance has priority 0.9', async () => {
  const { readFile } = await import('node:fs/promises');
  const sitemap = await readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');
  for (const route of PRERENDER_ROUTES) {
    assert.ok(sitemap.includes(`<loc>https://1979.co.il${route}/</loc>`));
    assert.ok(llms.includes(`](${route}/)`));
  }
  const maintenance = sitemap.match(/<url>\s*<loc>https:\/\/1979.co.il\/it-maintenance\/<\/loc>([\s\S]*?)<\/url>/);
  assert.ok(maintenance);
  assert.ok(maintenance[1].includes('<priority>0.9</priority>'));
});
test('generated route directories return HTTP 200 and missing assets return 404', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'seo-server-'));
  let local;
  try {
    await writeFile(join(directory, 'index.html'), 'source-entry');
    await mkdir(join(directory, 'support'));
    await writeFile(join(directory, 'support/index.html'), 'rendered-support');
    local = await startStaticServer(directory);
    const response = await fetch(`${local.origin}/support/`);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'rendered-support');
    assert.equal((await fetch(`${local.origin}/assets/missing.js`)).status, 404);
  } finally {
    if (local) await new Promise(accept => local.server.close(accept));
    await rm(directory, { recursive: true, force: true });
  }
});