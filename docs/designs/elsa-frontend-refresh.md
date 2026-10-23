# Elsa frontend refresh

Approved by Jimmy, 23 October 2026 (grill-me with Claude, then revised after local review).
Staging first; production only with Jimmy's explicit go-ahead (Sunday 25 October target).

## Outcome
A larger redesign (green accents, Bricolage/Inter fonts, "Want a hand?" heading,
thin full-screen landing popup) was built locally and reviewed. Jimmy preferred
the current staging look, including the landing "Leave us a message" mini window.
That redesign is dropped. Only small copy changes go ahead.

## Scope (Elsa repo `voice-ai-receptionist` only)
1. Heading stays "Leave us a message." (changed in round 2, item 8).
2. Subtitle: "Jump on a quick call with Elsa, our AI receptionist. Tell her about
   the job and Jimmy or Mark will call you back."
3. Footer: replace "Powered by the OpenAI Realtime API over WebRTC." with
   "Elsa is an AI. We keep your details for Jimmy and Mark, not a recording of the call."
4. Details card: remove the raw JSON code block shown after capture. Rest of card unchanged.
5. Subtitle max width 390px → 440px so the longer line wraps cleanly.

Everything else stays as on staging.

### Round 2 (23 Oct, after staging review): remove the repeated "Leave us a message"
The landing button keeps "Leave us a message". Inside the popup:
6. Landing popup heading: **"Got a minute? Talk to Elsa"** (`site/index.html`, `#voice-title`).
7. Landing popup help line: "Mic on, talk like you would on the phone. Close this
   window any time to hang up." (`#voice-help`).
8. Elsa heading: **"G'day. What's the job?"** with "job?" in gold (`app/page.tsx` h1).
9. Elsa status pill wording: Elsa's free / Ringing Elsa… / On the call / Call ended /
   Couldn't connect (was Ready / Connecting... / Live / Call ended / Error).
Not touched: call logic, audio, Elsa's voice/model/script, enquiry/email backend.

## Done when
- Copy changes visible locally and on staging; no JSON block after capture.
- A confirmed call and an early exit still send the enquiry email on staging.

## Open questions
- During local review (dev mode) one call went silent after the caller spoke
  ("speech detections during Elsa's replies: 0", playback finished normally, no
  error). Staging worked in Jimmy's test. Session config is identical locally and
  on staging. Cause not established: dev mode, chance, or local-only setup.
  Watch for it in staging testing.
- Footer privacy line must change if call recording is ever added.
- Possible later copy tweak: transcript label "Handball AI" vs "Elsa" (not changed).
