# Elsa product page (/elsa/)

Agreed with Jimmy by voice, 17 Nov 2026.

## Goal
One page that explains Elsa as Handball AI's first product, shows the price, and gets visitors to try her or ask for a free demo. The homepage stays as the overview and links here.

## Facts confirmed by Jimmy (only these go on the page)
- Elsa is a voice receptionist on the business's website. Visitors talk to her by voice. Online 24/7.
- Each Elsa is set up for that business (a scaffolder's Elsa knows scaffolding jobs and asks the right questions).
- Structured enquiry capture: name, contact, date or timing, what they need, location. Fields can be changed per business.
- Summary email to the owner after every chat.
- Price: $99 setup, $99 a month, AUD. No GST line (not registered yet). No ABN shown.
- No lock-in contract, cancel anytime.
- Free demo first: we set Elsa up for their business so they can hear her before they pay.
- Ready in a couple of days.
- Phone line connection is available as an extra, priced on request (phone service costs).
- The live demo is Handball AI's own Elsa. There are no per-trade demos yet.

Note: CLAUDE.md says "no prices". Jimmy decided to show Elsa's price on this page.

## Sections
1. Hero: what Elsa is, Talk to Elsa button, example enquiry summary card (labelled as an example).
2. How it works: four steps from tap to call-back.
3. Who she's for: twelve cards (tradies, clinics/dentists/vets, cafes and restaurants, gyms and PTs, real estate and property managers, accounting and law, removalists, cleaning, pest control, solar and electrical, locksmiths, landscaping and fencing). Each has one line on how Elsa helps and three things she'd ask. Idea from a competitor's industry grid (servicemagnet.ai), rewritten in our words. No booking, routing or triage claims: Elsa takes details and emails a summary. One live demo for all.
4. Pricing: one plan card plus the phone line add-on.
5. Free demo call to action: email, WhatsApp Mark, Talk to Elsa.

## Build notes
- Static file `site/elsa/index.html`, served at `/elsa/`. Shared `styles.css` plus page-only `assets/css/elsa.css`.
- Same header, mobile menu, sticky Talk to Elsa bar, voice dialog and footer as the homepage.
- Homepage links to it from the nav, mobile menu and footer.
- analytics.js only runs on `/` today, so this page is not tracked yet. Follow-up.
- SEO tags, sitemap and 404 come in the separate SEO job.

## Open
- The homepage headline says "Missed a call?" while Elsa is website voice chat for now. Jimmy to decide whether to reword.
- Swap the trade examples once real client results exist. No made-up case studies.

## Design review (Apple design skill, 17 Nov 2026)
Applied all seven suggestions: phone business picker (one card at a time, all 12 show on desktop and without JavaScript); "What you get" section removed (same list is in the pricing card); yellow kept for the two main buttons only (Talk to Elsa, Get a free demo); line icons instead of emoji; "Get a free demo" used everywhere; darker green ticks (4.6:1); "..." chip reads "and more" to screen readers. Phone page height went from about 11,000px to 5,600px.

## Motion and depth (Fable review, 17 Nov 2026)
- Hero signature: gold Elsa orb (popup gold #F5C451, CSS only: gradient sphere, inner light, two rings orbiting in 3D) with "G'day, I'm Elsa." and a status line. The example summary card's answers fill in one at a time once it's on screen ("Taking an enquiry…" then "Summary sent to your inbox."). On desktop with a mouse the card leans slightly toward the pointer.
- Reassurance row under the hero buttons: Free demo first · No lock-in · Ready in a couple of days.
- Sections rise in on scroll; the four steps arrive one after another with a line drawing across them on desktop.
- Business cards: hover lift on desktop; on phones the picked card slides in and its chips pop.
- Pricing card: hover lift and one light sweep when it first appears.
- Final demo section is dark navy, bookending the hero. Its Talk to Elsa button is yellow.
- Skipped: moving hero background (competes with the orb, costs battery).
- No libraries. Reduced motion: no ep-motion class, so everything is still and complete.

## Homepage "What we do" section (17 Nov 2026)
Right after the homepage hero: two cards. Elsa (product, navy, gold orb, $99 a month + $99 setup, "See how Elsa works" to /elsa/, "Talk to Elsa" via #elsa) and Automations (service, white, "See where automation helps" to #services, "Start with a free 15-min chat"). Jimmy approved showing the Elsa price on the homepage too, overriding the CLAUDE.md "no prices" rule for Elsa.
