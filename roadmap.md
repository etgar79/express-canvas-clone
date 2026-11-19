# Polish and quality assurance — round 5

- [x] Normalize spelling, phone, cities, dashes and plural visitor copy; synchronize FAQ schema.
- [x] Replace flipping service cards with static cards and service links; correct header active states and footer tap areas.
- [x] Remove unsafe diagnostics sitemap entry and normalize public internal URLs.
- [x] Preserve cached assets during deployment; run all tests and desktop/mobile checks.

Constraint: no dashboard, diagnostic logic, chatbot or cloud function edits; deployment change limited to asset copying.

Live GitHub Pages publication must be verified after the workflow runs.

Verified: 18 script tests passed; homepage, maintenance, AI and support checked at 1280px and 375px without console errors or overflow, each with one H1. Footer links are at least 24px high. Six static service cards have six headings and four working detail links. Privacy, accessibility and 404 each have one H1. Maintenance FAQ schema matches expanded answers after replacing a stale prerendered schema. No asset cleanup by mtime was added, since Git does not preserve reliable file ages.