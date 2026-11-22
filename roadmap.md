# Password-protected Action1 installation

## AI services section polish

- [x] Add featured CRM card and balance the remaining five services.
- [x] Update AI service listing and verify prerendered HTML, all script tests and 1280px/375px browser layouts (21 passed, 2 existing database tests skipped; no browser console errors; one H1 and CRM H3 present).

- [x] Add private attempt storage and atomic concurrency-safe limiter.
- [x] Add secret-backed installation function, page and discreet support/footer links.
- [x] Verify security rules, database limiter and page behavior.
- [ ] Configure owner-supplied installation secrets: waiting for the owner in Project Settings → Secrets.

Only installation-related files change; existing tools remain untouched.

The draft's database changes reach the app on acceptance; draft attempt records do not.

Verified: 22 script tests and 3 Edge Function tests passed, including 20 concurrent attempts, fixed lock duration, reset on success and denied public permissions. Function deployed; missing secrets return 503 without command, untrusted origin returns 403. Support-to-install navigation, noindex, password attributes and 375px layout checked; browser submission displays missing configuration. Real command reveal/copy requires owner-supplied secrets; production gateway IP forwarding remains unverified.