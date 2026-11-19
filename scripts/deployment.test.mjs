import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PRERENDER_ROUTES } from './prerender.mjs';

test('deployment stages every generated route including IT maintenance', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const loop = workflow.match(/          for directory in ([\s\S]*?)          done/);
  assert.ok(loop, 'deployment staging loop exists');
  const directory = await mkdtemp(join(tmpdir(), 'route-staging-'));
  try {
    for (const route of PRERENDER_ROUTES) {
      await mkdir(join(directory, route.slice(1)));
      await writeFile(join(directory, route.slice(1), 'index.html'), 'generated');
    }
    await mkdir(join(directory, 'scripts'));
    // Importing the allowlist must never invoke prerendering.
    await writeFile(join(directory, 'scripts/prerender.mjs'), `export const PRERENDER_ROUTES = ${JSON.stringify(PRERENDER_ROUTES)};`);
    const staged = execFileSync('bash', ['-c', `git() { printf '%s\\n' "$3"; };\nfor directory in ${loop[1]}done`], { cwd: directory, encoding: 'utf8' }).trim().split('\n');
    assert.deepEqual(staged, PRERENDER_ROUTES.map(route => route.slice(1)));
    assert.ok(staged.includes('it-maintenance'));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('generated IT maintenance output cannot retrigger deployment', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const ignored = workflow.split('paths-ignore:')[1]?.split('workflow_dispatch:')[0];
  assert.ok(ignored?.includes("'it-maintenance/**'"));
});

test('deployment keeps cached chunks while updating current assets', async () => {
  const workflow = await readFile(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  const copy = workflow.match(/run: \|\n([\s\S]*?)# SPA fallback/);
  assert.ok(copy);
  const directory = await mkdtemp(join(tmpdir(), 'asset-retention-'));
  try {
    await mkdir(join(directory, 'assets'));
    await mkdir(join(directory, 'dist/assets'), { recursive: true });
    await writeFile(join(directory, 'assets/old-chunk.js'), 'cached');
    await writeFile(join(directory, 'assets/index.js'), 'old entry');
    await writeFile(join(directory, 'dist/assets/index.js'), 'current entry');
    await writeFile(join(directory, 'dist/assets/new-chunk.js'), 'current chunk');
    execFileSync('bash', ['-c', copy[1]], { cwd: directory });
    assert.equal(await readFile(join(directory, 'assets/old-chunk.js'), 'utf8'), 'cached');
    assert.equal(await readFile(join(directory, 'assets/index.js'), 'utf8'), 'current entry');
    assert.equal(await readFile(join(directory, 'assets/new-chunk.js'), 'utf8'), 'current chunk');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});