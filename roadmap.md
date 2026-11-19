# Technical SEO round 2

- [x] Add public-route prerendering and GitHub Pages deployment integration without replacing the source entry.
- [x] Add homepage crawler content, structured data, page metadata and dashboard noindex.
- [x] Add AI crawler rules and llms.txt.
- [x] Verify generated pages and exclusion rules; document deployment checks.

Verification: eight automated tests pass; Puppeteer captured all four running public pages into temporary HTML files; browser checks confirmed page metadata, homepage content without JavaScript and dashboard-only noindex. GitHub Actions against production dist and the live site's HTTP status must be checked after deployment.

After deployment: confirm four `Prerendered` messages in the action log and four route-directory index.html files in the repository. Request each public URL with redirects followed and verify final HTTP 200, then inspect raw page source for its H1, description and canonical. Verify /llms.txt and /robots.txt publicly.