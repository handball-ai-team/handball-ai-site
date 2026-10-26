# Elsa failure popup

Jimmy approved “Design is clear” and assigned staging implementation to Codex on 26 October 2026. Jimmy confirmed receiving the simulated failure email; the inline error text was difficult to notice.

## Problem
The call failure message is too easy to miss beneath the orb. Visitors need an obvious explanation and clear recovery actions.

## Scope and design
Use an accessible modal popup for startup, microphone and mid-call failures. Service failure title: “Elsa can’t connect right now”; interrupted-call title: “Your call with Elsa was interrupted”. Explain that visitors can retry in a few minutes or email an enquiry. Microphone errors retain their specific explanation and do not send service alerts.

Try again dismisses the popup and starts a fresh connection. Email us opens a blank email to hello@handballai.tech. Close closes the entire Elsa window and returns to the enclosing website. When opened directly, Close navigates to the matching staging/production website. Escape has the same effect as Close; clicking the backdrop does not silently dismiss the error. Move keyboard focus into the popup, contain focus while open, and use legible text/buttons on mobile and desktop.

The iframe sends a fixed close message only to a trusted parent origin. Landing accepts it only from its current Elsa iframe and its expected voice origin, then uses the existing dialog teardown/focus restoration. Preserve all existing alert logic and its shared 30-minute limit. Keep the temporary staging credit-error simulation active for Jimmy's review. Do not commit simulation source or deploy production.

## Pieces
Voice repo: app/page.tsx, app/globals.css and browser smoke checks. Landing repo: site/index.html close-message listener and email fallback wording. Separate staging deployments of both Workers are needed.

## Done when
Popup is obvious at mobile/desktop widths; title/description and controls are accessible. Retry reconnects; mailto is correct; Close/Escape unload the iframe and restore focus to the website's launcher. Untrusted origins and other windows cannot close Elsa. Direct-page Close returns to the correct website. Mid-call cleanup and alert tests still pass. Simulated staging failure remains available for Jimmy; production is untouched.

## Deferred
Physical inbox confirmation for both recipients and final production release remain human acceptance steps. No changes to credit accounting or the email cooldown.
