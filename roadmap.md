# Deployment, conversions and accessibility — round 4

- [x] Stage all prerender routes from the shared allowlist and ignore maintenance output in workflow triggers.
- [x] Make general WhatsApp contact the primary hero action above three equal secondary actions.
- [x] Improve small orange text contrast without changing orange icons, buttons or backgrounds.
- [x] Respect reduced motion and replace public-button hover scaling with subtle emphasis.
- [x] Reserve mobile footer space for floating controls; run script tests and desktop/mobile homepage checks.

Constraint: no dashboard or diagnostic logic, chatbot or cloud function changes; deployment edits limited to the route staging loop and paths-ignore.

Verified: 15 script tests passed; desktop and 375px homepage checks passed with equal 44px secondary actions, no horizontal overflow, working maintenance navigation, no runtime errors, reduced-motion animations disabled and footer links clear of the WhatsApp control. Small accent text measured at least 4.86:1 in light mode and 6.59:1 in dark mode. Live GitHub Pages publication remains unverified until the updated workflow runs.