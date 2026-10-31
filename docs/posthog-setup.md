# Handball AI analytics

Staging check on 31 October: live pageviews received from both hosts; landing contact clicks and pageleaves received; Facebook campaign values verified in event properties and Elsa URLs. A landing replay visibly masks text. Evidence: `docs/reviews/posthog-staging-events.png` and `docs/reviews/posthog-staging-replay.png`. A real Elsa call/enquiry and its sensitive-content replay check are still pending human acceptance. Production is unchanged.

Project: https://us.posthog.com/project/700473 . US ingestion. The `phc_` project token in browser code is a public ingestion token, not an account API credential.

## Keep it free
In organization billing, keep paid usage disabled/no payment method. If billing is enabled, set **$0 limits separately for analytics and session replay** and verify the saved values. Do not enable paid add-ons. PostHog stops ingesting beyond billing limits; dropped activity cannot later be recovered. See https://posthog.com/docs/billing/limits-alerts . This requires authenticated account verification; the script does not configure billing.

Enable session replay in the project's replay settings. The client masks inputs and private text, shows public website text, and excludes transcript/lead/media/iframe regions regardless. Private reader paths do not initialize the SDK. Review real payloads and replay on staging before release.

Billing checked in the authenticated UI on 31 October 2026: free plan, 1M analytics cap and 5K web replay allocation. No upgrade or card entry was performed. Onboarding completed with replay enabled and autocapture/heatmaps/web vitals disabled.

## Links for Facebook
Use a different `utm_content` slug for each post; never put visitor details in campaign labels. Example:

https://handballai.tech/?utm_source=facebook&utm_medium=organic_social&utm_campaign=business_admin&utm_content=post_001

Allowed labels: lowercase letters, digits, underscore and hyphen, beginning with a letter, maximum 80 characters. Supported keys are `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`. Links on old posts without labels may lack post-level attribution. Blocked tracking creates gaps.

## Reports
Filter `environment = production` for business results. Group `$pageview` by `utm_content` and `site`; compare `contact_clicked` (channel), `elsa_opened`, `elsa_call_started`, `elsa_enquiry_saved`. `elsa_call_started` is a connected voice data channel, not proof the visitor spoke. Saved enquiry events follow a confirmed successful capture; email delivery remains separate. Counts are browser events, not unique leads. Facebook messages are counted separately in Facebook.

Anonymous identities are separate across hosts. Campaign comparison works across both sites; do not treat this as a stitched visitor funnel. Attribution is captured for the current page, not a persistent multi-visit attribution model.

## Release
Local checkouts predate some recorded production fixes. Rebase/cherry-pick this isolated feature onto the verified current source before staging. Preserve voice-staging automatic-builds disabled. Validate both public pages and the live enquiry flow. Do not deploy an older checkout over a newer release.

Rollback removes the script references/event hooks and restores the previously deployed versions. Existing enquiry and transcript data must be retained.
