# Content, conversions and light design — round 3

- [x] Update business-focused hero, first-person copy and contextual WhatsApp messages.
- [x] Add IT maintenance page, navigation, schema and discovery links.
- [x] Clean homepage section backgrounds and verify mobile controls and anchors.
- [x] Normalize prerender canonicals and run all script tests plus desktop/mobile browser checks.
- [ ] Publish the new IT maintenance static directory automatically: blocked by the explicit prohibition on deployment workflow edits; its existing staging list omits this directory.

Constraint: do not edit deployment workflow, diagnostic/dashboard logic, chatbot or cloud functions. The unchanged deployment workflow does not stage the new IT maintenance directory; live static publication of that directory requires a later authorized workflow change.

Verified: all 13 script tests passed; homepage, maintenance and AI pages checked at 1280px and 375px with no horizontal overflow or visible buttons shorter than 44px. Cross-page About anchors land below the header. All five prerendered HTML files have trailing-slash canonical and og:url; only maintenance retains its own FAQPage and Service schemas. Homepage FAQ JSON-LD exactly matches visible answers.