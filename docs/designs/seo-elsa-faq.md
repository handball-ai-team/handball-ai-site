# SEO for the whole site + Elsa FAQ

Grilled with Jimmy on 18 November 2026 (voice and text). He said "Design clear".

## Problem
Searching "handballai.tech" only returns handball.ai, a European handball sports analytics site. Our pages have no canonical links, share tags or schema, so search engines and social apps can't tell who we are. The Elsa page also has no FAQ near the price.

## Scope
In:
- Canonical link, Open Graph and Twitter card tags on both pages (home and /elsa/).
- One branded share card, 1200x630, used by both pages. Navy, the green-dot "H" mark, "Handball AI" and one line about the AI receptionist. No price on the card.
- JSON-LD: Handball AI as a local business (Torquay, Victoria, serving businesses across Australia) on both pages. Elsa as a Service on /elsa/ with $99 a month and $99 setup, in AUD. FAQPage schema for the FAQ.
- sitemap.xml and robots.txt.
- Branded 404 page.
- Titles and meta descriptions say "AI receptionist" and "Australia", not just "handball". One H1 per page.
- Five FAQ questions on /elsa/, straight after pricing.
- A test that fails if the Elsa price in the page text, meta description and schema stop matching.
- Root `wrangler.jsonc` for production with the 404 setting. Staging config gets the same setting.

Out (parked): HubSpot pipeline and lead form, Elsa's nine fixes, analytics on /elsa/, trade-specific Elsa page, privacy page. A cancel FAQ (already on the pricing card).

## Design decisions
- **Share image:** one branded card for both pages (Jimmy chose this over a cropped photo or two cards).
- **Price in one place:** the site is plain HTML with no build step, and social previews don't run JavaScript. So the price stays in the HTML and `tests/seo.test.mjs` checks every copy matches. A price change is three edits, and the test catches a missed one.
- **404:** Cloudflare only serves `404.html` when `assets.not_found_handling` is `"404-page"`. Claude adds the setting to `wrangler.jsonc` (new, production) and `wrangler.staging.jsonc`. Codex tests on staging, then updates the Cloudflare dashboard deploy command for production when Jimmy says go.
- **No invented facts:** schema uses only facts already on the site: name, Torquay VIC, Australia, hello@handballai.tech, the WhatsApp number shown on the page, and the Elsa price. No street address, no ratings, no reviews.

## FAQ answers (settled with Jimmy)
1. **Does Elsa tell people she's an AI?** Yes. Before you tap to talk, the screen says Elsa is an AI receptionist.
2. **What if Elsa can't answer a question?** She won't guess or make things up. She takes the caller's name, contact details and the best time to call, then passes it to you so you can get back to them.
3. **Is the chat recorded?** Elsa doesn't record audio. After every chat, you get an email with a summary, what the caller needs, their contact details, and the time and length of the call. If you'd like a written transcript too, just ask.
4. **Can Elsa answer questions about my hours and service area?** Yes. When we set her up, we take the details from your website and anything else you want her to know. She sticks to what you've given her. She's on 24/7, so callers get answers after hours too. If she doesn't know, she takes their details for you.
5. **Can Elsa flag urgent enquiries?** Yes. If a caller says it's urgent, your email is marked URGENT so it stands out. Elsa can also give them your phone number, if you'd like her to.

## Pieces
- site/index.html, site/elsa/index.html (head tags, schema, titles, FAQ)
- site/404.html (new), site/sitemap.xml (new), site/robots.txt (new)
- site/assets/img/og-card.png, site/assets/img/logo-512.png (new)
- site/assets/css/elsa.css (FAQ styles, cache-buster)
- tests/seo.test.mjs (new)
- wrangler.jsonc (new), wrangler.staging.jsonc

## Done when
- Both pages: one H1, one canonical, full OG/Twitter set, JSON-LD parses.
- Google Rich Results Test accepts the FAQPage and business schema (Codex, on staging).
- https://staging.handballai.tech/no-such-page returns 404 with the branded page.
- /sitemap.xml and /robots.txt load.
- `node --test tests/*.test.mjs` passes, including the price check.
- Pages checked at 390 and 1440 wide with no overflow.

## Open questions / follow-ups
- Checked by Codex 18 Nov (see .ai-cowork/codex-to-claude.md): every prompt identifies Elsa as an AI, but none says how to answer "Are you a real person?", so FAQ 1 only claims what the screen shows. URGENT subjects are in the shared small-business template (not Handball's own profile); the urgent number is the configured business phone, so FAQ 5 says "your phone number, if you'd like her to". Follow-up for the voice repo: add an explicit "yes, I'm an AI" answer to her prompts.
- Facebook Page URL for schema `sameAs` once Jimmy confirms it's live.
- Jimmy: verify the domain in Google Search Console and Bing Webmaster Tools, submit the sitemap, set up a Google Business Profile for Torquay.
