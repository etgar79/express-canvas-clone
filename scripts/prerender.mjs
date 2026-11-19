import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer';

export const PRERENDER_ROUTES = ['/ai-services', '/support', '/privacy', '/accessibility', '/it-maintenance'];

// Serve only the built site; client-side routes initially receive its SPA entry.
export async function startStaticServer(directory) {
  const root = resolve(directory);
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8' };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (file !== root && !file.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      let content;
      let extension = extname(file);
      try {
        content = await readFile(extension ? file : resolve(file, 'index.html'));
        if (!extension) extension = '.html';
      } catch {
        if (extension) {
          response.writeHead(404).end();
          return;
        }
        content = await readFile(resolve(root, 'index.html'));
        extension = '.html';
      }
      response.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream' });
      response.end(content);
    } catch {
      response.writeHead(500).end();
    }
  });
  await new Promise((accept, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', accept);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No local server port');
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

export async function prerender({ input = 'dist', output = '.', origin: suppliedOrigin, executablePath } = {}) {
  const local = suppliedOrigin ? null : await startStaticServer(input);
  const origin = suppliedOrigin || local?.origin;
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    // Capture all routes successfully before writing any files.
    const pages = [];
    for (const route of PRERENDER_ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 1800 });
      // Prerender never needs remote APIs or a visitor session.
      await page.setRequestInterception(true);
      page.on('request', request => {
        const url = request.url();
        if (url.startsWith(`${origin}/`) || url.startsWith('data:') || url.startsWith('blob:')) void request.continue();
        else void request.abort();
      });
      const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0', timeout: 60000 });
      if (!response?.ok()) throw new Error(`Failed to load ${route}`);
      await page.waitForFunction((path) => {
        const main = document.querySelector('#root main');
        return Boolean(main?.querySelector('h1')?.textContent?.trim())
          && (main?.textContent?.trim().length || 0) > 100
          && document.querySelector('link[rel="canonical"]')?.getAttribute('href') === `https://1979.co.il${path}/`
          && Boolean(document.querySelector('meta[name="description"]')?.getAttribute('content'));
      }, { timeout: 30000 }, route);
      // Homepage-only schema must not accompany unrelated page content.
      await page.evaluate(() => {
        document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
          try {
            if (JSON.parse(script.textContent || '{}')['@type'] === 'FAQPage' && script.id !== 'it-maintenance-faq') script.remove();
          } catch { /* Keep other structured data unchanged. */ }
        });
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
        for (const [property, content] of [['og:title', title], ['og:description', description], ['og:url', canonical]]) {
          document.querySelector(`meta[property="${property}"]`)?.setAttribute('content', content);
        }
      });
      pages.push({ route, html: await page.content() });
      await page.close();
    }
    for (const { route, html } of pages) {
      const directory = resolve(output, route.slice(1));
      await mkdir(directory, { recursive: true });
      await writeFile(resolve(directory, 'index.html'), html);
      console.log(`Prerendered ${route} -> ${route.slice(1)}/index.html`);
    }
  } finally {
    await browser?.close();
    if (local) await new Promise(accept => local.server.close(accept));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  prerender().catch(error => { console.error(error); process.exitCode = 1; });
}