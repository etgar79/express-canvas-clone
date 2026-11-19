import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PRERENDER_ROUTES, startStaticServer } from './prerender.mjs';

test('prerender includes exactly the four requested public routes', () => {
  assert.deepEqual(PRERENDER_ROUTES, ['/ai-services', '/support', '/privacy', '/accessibility']);
});
test('technician dashboard is never prerendered', () => {
  assert.equal(PRERENDER_ROUTES.includes('/tech-dashboard'), false);
});
test('diagnostics is never prerendered', () => {
  assert.equal(PRERENDER_ROUTES.includes('/diagnostics'), false);
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