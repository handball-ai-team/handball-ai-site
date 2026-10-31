# PostHog analytics

Approved 31 October 2026. Jimmy explicitly asked Codex to implement, overriding the usual Claude Code-only role for this feature.

## Problem
Facebook views and clicks do not explain what visitors do after reaching Handball AI. Website enquiries and Facebook messages are equally valuable.

## Scope and design
- One US PostHog project for the landing and Elsa public homepages. Distinguish landing/voice and production/staging on every event.
- Explicit events for pageviews, scroll milestones, WhatsApp/email clicks, Elsa opening, call connection, call ending/failure and confirmed enquiry saved. A click does not establish a message was sent; a saved enquiry does not establish email delivery.
- Session replay on both public homepages with public text visible, inputs masked and transcript, lead, media and embedded-frame regions blocked. No audio, transcript, contact values, network bodies, console logs or private transcript reader tracking.
- No general click/form autocapture or person identification. Only fixed event names and enumerated properties. Remove URL queries/fragments and unknown attribution values.
- Each Facebook post uses a labelled link. Pass the four approved campaign labels to Elsa. Separate domains have separate anonymous session identities; group reports by campaign, do not claim a joined person-level funnel.
- Facebook messages/reactions stay in Facebook reporting. No Facebook account integration or post publishing is included.
- Strictly free: verify no payment method or set $0 billing limits for analytics and replay in PostHog before release. Client code cannot enforce an account-wide monthly allowance.

## Pieces
Landing `site/index.html`, shared analytics script in `site/assets/js/analytics.js`; Elsa `app/page.tsx`, identical script in `public/handball-analytics.js`; this design and setup guide.

## Done when
- Syntax, typecheck and targeted lint pass; analytics failure does not break enquiries.
- On isolated staging, labelled test visits and contact/call/enquiry events arrive under staging, with no private values in outgoing payloads or replay. Reader paths never load analytics.
- Real masked replay is reviewed. Account free-only settings verified.
- Production deploy only after Jimmy separately approves. Preserve current email/transcript fixes; local checkouts must be reconciled with current source before deployment.

## Open checks
Billing verified in the authenticated UI on 31 October: free plan, 1M analytics billing limit and 5K web replay free allocation; no upgrade enabled. Replay enabled during onboarding; general autocapture, heatmaps and web vitals disabled. Actual SDK ingestion and staged browser/network privacy checks remain release gates. No production release is implied by implementation approval.
