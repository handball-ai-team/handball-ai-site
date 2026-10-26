# Production release runbook — Elsa email + landing voice button

Prepared by Claude, 26 October 2026. **Nothing here is deployed yet.** Every step
below needs Jimmy's explicit go-ahead. Codex commits, pushes and deploys.

## Rollback targets (read live from the Cloudflare dashboard, 26 Oct)

| Worker | Active version | Notes |
| --- | --- | --- |
| `voice-ai-receptionist` (voice.handballai.tech) | `fdc2584d` | 100% traffic. Secret: `OPENAI_API_KEY` only. No bindings, no cron. |
| `handball-ai-site` (handballai.tech, www) | `7aa2f79b` | The revert release, no voice button. |

Both Workers have Git builds on `main`, but the dashboard still shows the old
repo owners (`handball-ai/...`). A push to `main` may auto-deploy, or may not
trigger. Check the Deployments tab after every push; never assume.

Rollback = Deployments → the version above → Rollback. This changes code only.
It never deletes D1 rows. Do not delete `elsa-enquiries-production`.

## New infrastructure (already created, unbound, no traffic)

- D1 `elsa-enquiries-production`, ID `91f93663-ca24-4bf3-ac88-9e11941f92de`,
  region OC (Melbourne). `migrations/0001_enquiries.sql` applied; 4 objects
  verified (`enquiries`, `enquiry_limits`, two indexes). Empty.
- Staging D1 `elsa-enquiries-staging` untouched (2 accepted, 4 empty, 0 failed).

## Voice repo changes (working tree on `codex/living-voice-ui`, uncommitted)

- `lib/enquiries.ts`, `lib/enquiry-http.ts`, `worker.ts`: new `ELSA_CHANNEL`.
  Only the exact value `production` gives subject `[Elsa] …` and Resend key
  `elsa-production/<id>`. Anything else stays `[Elsa staging] …` and
  `elsa-staging/<id>`, so staging behaviour is unchanged.
- `cloudflare.config.ts`: production now uses `./worker.ts`, minute schedule,
  `RESEND_API_KEY` secret, production D1 ID and `ELSA_CHANNEL=production`.
  Staging only gains `ELSA_CHANNEL=staging`.
- `tests/enquiries.test.mjs`: two new tests (channel parsing, subject,
  idempotency, scheduler path).

## Landing repo change (working tree on `codex/voice-staging-button`, uncommitted)

- `site/index.html`: voice origin chosen from the page's hostname.
  `handballai.tech` / `www` → `https://voice.handballai.tech`; anything else
  (staging, localhost) → the isolated staging Worker. iframe `src`, `allow`
  and the new-tab fallback all use the same origin.

## Validation done

- 26/26 enquiry tests, `tsc --noEmit`, targeted ESLint: pass.
- Config evaluated for both modes (see the chat for the full output).
- Landing hostname switch simulated for 4 hosts: correct.
- Landing merge simulated in a scratch clone (see step 6).

**Not done** (Mac-native binaries / network): `npm run build:vinext` for both
modes, and inspecting the built `worker.config.json`. Codex runs these.

## Release order

1. `git fetch` in both repos. Confirm no new remote commits on either `main`
   or review branch since 23 Oct.
2. Commit the voice changes on `codex/living-voice-ui`. Rebuild + redeploy
   **staging** with `--mode voice-preview`. Check the built config: staging
   name, no domains, workersDev true, staging D1 ID, `ELSA_CHANNEL=staging`.
   Make one staging call; subject must still read `[Elsa staging]`.
3. Jimmy: in the dashboard add secret `RESEND_API_KEY` to the **production**
   `voice-ai-receptionist` Worker (same Resend key as staging, or a new
   production key). This creates a new version with unchanged code.
4. Voice production build: `npm run build:vinext` (no mode). Inspect
   `.cloudflare/output/v0/workers/default/worker.config.json`: name
   `voice-ai-receptionist`, domain `voice.handballai.tech`, entrypoint
   wrapper, schedule `* * * * *`, D1 `91f93663-…`, `ELSA_CHANNEL=production`,
   both secrets declared as secrets. Then `npx cf deploy --prebuilt`.
   Fast-forward `main` to the review head (it is a clean ancestor). If the Git
   build also fires, confirm it produced the same config.
5. Verify voice production: standalone page loads, a real confirmed call and
   an early exit; both Zoho inboxes get `[Elsa] …` once each; production D1
   shows `accepted`; staging D1 unchanged.
6. Landing: commit the `index.html` change on `codex/voice-staging-button`,
   let staging rebuild, confirm the modal still opens staging Elsa. Then:
   ```sh
   git checkout -b release/2026-10-26 codex/voice-staging-button
   git merge -s ours --no-edit main   # discards only the 82d9fdb revert
   git diff codex/voice-staging-button   # must be empty
   git checkout main && git merge --ff-only release/2026-10-26
   ```
   **Do not** plain-merge the review branch into `main`: it conflicts in
   `index.html` and silently drops 138 lines of voice CSS (simulated).
7. Push `main`. Deploy with the existing production command if the Git build
   doesn't fire. Verify on handballai.tech and www: modal opens
   voice.handballai.tech, mic prompt works, Close hangs up, mobile layout.
8. Record released commits and Worker versions here.

## If something breaks

- Voice: roll back to `fdc2584d`. Calls work again without email. Queued
  rows stay in D1 and send once the fixed version is back (within 10 days).
- Landing: roll back to `7aa2f79b`.
- Never delete either D1 database or run cleanup SQL during rollback.
