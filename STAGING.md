# Landing-page staging

- Homepage: https://staging.handballai.tech/
- Worker: `handball-ai-site-staging` (static assets from `site/`).
- Repository: `handball-ai/handball-ai-site`.
- Deploy branch: `codex/voice-staging-button`.
- Voice UI review iframe, permission origins and new-tab fallback:
  https://voice-ai-receptionist-staging.handballai-au.workers.dev/.

Cloudflare Workers Builds for this staging Worker uses the review branch as
its deployment branch, with other branch previews disabled. The dashboard's
"Production branch" label belongs to this isolated staging Worker; it does
not refer to the real site's `main` branch.

No build step is needed for the static site. Deploy command:

```sh
npx wrangler deploy --config wrangler.staging.jsonc
```

The dedicated config names only the staging Worker and staging Custom
Domain. Do not use the production landing Worker's deploy command for staging.

The staging hostname previously belonged to `voice-ai-receptionist-staging`.
It now belongs to `handball-ai-site-staging`. Automatic builds on the old
voice-staging Worker are disabled to prevent its old domain declaration
from reclaiming the hostname. The old Worker now hosts the isolated living-orb
UI review at its stable workers.dev address, from voice repo branch
`codex/living-voice-ui`. It has no custom domains and keeps its automatic
builds disabled. Its existing encrypted key is reused; no secret was copied
or changed. Production `voice.handballai.tech` keeps its existing UI/deployment.

## Production hold

Do not merge this feature into `main` or deploy it to production until Jimmy
explicitly authorizes a production merge. Further feature changes stay on
the review branch and staging. `handballai.tech` remains on the reverted
release without the voice button.
