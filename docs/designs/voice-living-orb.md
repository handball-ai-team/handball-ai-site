# Living voice UI — approved 2026-10-20

Jimmy approved the supplied navy/gold redesign and an isolated voice-staging
Worker on a stable URL for a day or two of review. Production stays untouched.

Use #0B1020 base, #141B33 surfaces, #F5C451 gold, #FFD873 glow, #AEB7D6
secondary text and #F7F9FF headings. #6C8BFF is limited to the orb rim.
Clash Display headings and Satoshi body/UI fonts are self-hosted from Fontshare.

The large volumetric orb breathes, rotates its inner aurora and orbital rings,
brightens with Start hover, and accelerates while Connecting. When Live, an
independent visual analyser reads the existing microphone/assistant streams.
It must never request another microphone stream, change call routing or stop
the call's tracks. The analyser and animation resources clean up independently.

Idle transcript is hidden. Starting a call shrinks the orb and reveals the
transcript beneath it. Copy stays warm: “Leave us a message.” and “Talk to our
AI assistant. Tell us what you need a hand with.” Gold Start, clear End,
animated Ready/Connecting dot, solid green Live. Reduced motion disables
animation/reactive scale while preserving an intentional static glow.

Reuse voice-ai-receptionist-staging at its stable workers.dev URL. Preview
configuration must claim no custom domain. Only the landing review branch's
iframe/fallback and matching permission origins point there. Match its modal
shell to the navy/gold palette. Do not merge main or deploy either production
Worker. Keep old voice staging automatic builds disabled.

Done: standalone and staging iframe render consistently at desktop/mobile,
no overflow, visible keyboard focus, readable contrast, reduced-motion static
mode, real analyser implementation checked with synthetic input where possible,
session/agent code unchanged, and production versions/domains unchanged.
Jimmy owns physical microphone/audio confirmation.
