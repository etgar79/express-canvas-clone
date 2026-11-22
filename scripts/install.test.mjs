import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { PRERENDER_ROUTES } from './prerender.mjs';
async function scan(path) {
 for (const entry of await readdir(path, { withFileTypes: true })) {
  const file = `${path}/${entry.name}`;
  if (entry.isDirectory()) await scan(file);
  else {
   const content = await readFile(file);
   assert.equal(content.toString().includes(['action1.com', 'agent'].join('/')), false, `Installer URL in ${file}`);
  }
 }
}
test('installer command is never embedded in source or public assets', async () => { await scan('src'); await scan('public'); });
test('installation is excluded from prerender and discovery files', async () => {
 assert.equal(PRERENDER_ROUTES.includes('/install'), false);
 for (const file of ['public/sitemap.xml','public/llms.txt']) assert.equal((await readFile(file,'utf8')).includes('/install'),false);
});
