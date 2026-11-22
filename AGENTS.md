# Architecture rules

- GitHub Pages serves built assets and prerendered public-route directories from the repository root; never overwrite the Vite source index.html, so local development remains available.
- Prerender only the explicit public-page allowlist, with a temporary local static server and Puppeteer; protected and diagnostic tools must never be executed during prerendering.
- Route-level robots metadata lives beside the router, not inside the technician dashboard, to keep indexing controls independent of its application logic.
- Public WhatsApp links use the shared context-aware URL helper, so encoded messages remain consistent across contact actions.
- The maintenance page reuses the homepage FAQ data and scopes its Service and FAQPage scripts to its own lifecycle, so answers stay consistent and schema never leaks to other routes.
- Router hash scrolling waits for rendered anchor targets, so homepage section links work after navigation from internal pages.
- Deployment stages generated directories from PRERENDER_ROUTES; mirror them in static paths-ignore to prevent omitted pages and generated-output rebuilds.
- Public small orange text uses accent-text, while decorative icons and backgrounds retain accent; this preserves branding with readable light-theme text.
- Deployment overlays current assets without deleting older chunks; cached entry scripts must retain their dependencies and Git timestamps cannot support safe age cleanup.
- Service cards render a single static heading and optional service-page link; hidden duplicate content and flip-only interactions are avoided.
- Installation commands are retrieved only after server-side secret validation, never persisted in browser storage; a service-only advisory-locked database function serializes per-IP attempt decisions.