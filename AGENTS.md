# Architecture rules

- GitHub Pages serves built assets and prerendered public-route directories from the repository root; never overwrite the Vite source index.html, so local development remains available.
- Prerender only the explicit public-page allowlist, with a temporary local static server and Puppeteer; protected and diagnostic tools must never be executed during prerendering.
- Route-level robots metadata lives beside the router, not inside the technician dashboard, to keep indexing controls independent of its application logic.
- Public WhatsApp links use the shared context-aware URL helper, so encoded messages remain consistent across contact actions.
- The maintenance page reuses the homepage FAQ data and scopes its Service and FAQPage scripts to its own lifecycle, so answers stay consistent and schema never leaks to other routes.
- Router hash scrolling waits for rendered anchor targets, so homepage section links work after navigation from internal pages.