# Put the portfolio live on Cloudflare

The target deployment is one Cloudflare Worker: React's production build is served as static assets, and the Express-compatible Worker entry point handles `/api/*`. D1 stores contact messages and the Worker validates Turnstile. Contact-form email delivery is disabled.

## Current backend and data flow

- The browser loads the React single-page app from the Worker static asset binding (`build/`).
- The contact form sends JSON to `POST /api/contact` on the same origin. No separate public API host or database connection string is needed in the browser.
- `server/cloudflare-worker.js` is the production backend. It exposes the Express routes through the Cloudflare Workers adapter, checks form fields and the hidden honeypot, applies an IP-hash-based hourly limit, optionally verifies Turnstile, and writes accepted submissions to D1 using prepared SQL.
- D1 is a managed SQLite database. The `migrations/` SQL files define its schema; apply them with the Wrangler migration commands below. It is the source of truth for contact messages. The application intentionally sends no inbox email for contact submissions.
- The Vercel serverless function in `api/contact.js` is the contact handler for the **legacy** `mohammadumarportfoloi.online` domain. It validates fields, checks the honeypot, and forwards the payload and Turnstile token to the primary Worker. It sends no email. The Worker below is the primary backend for `mohammadumar.site`.
- The portfolio guide is an offline, profile-based question/answer feature in the frontend. It does not call an LLM or send prompts to a server.

`vercel.json` now only contains permanent redirects from the legacy `mohammadumarportfoloi.online` hostnames to `https://mohammadumar.site/`. The `/api/check-github` path is exempt so the commit digest endpoint stays reachable on Vercel, although its scheduled runs are currently paused.

### What is running before Cloudflare is configured

Cloudflare Workers is the primary production host at `https://mohammadumar.site/`: pushing to `main` deploys the React build and the Worker, and `server/cloudflare-worker.js` stores submissions in D1. Contact-form email delivery is disabled. Every other hostname (`www.mohammadumar.site`, `mohammadumarportfoloi.online`, `www.mohammadumarportfoloi.online`, and plain HTTP) redirects to the canonical HTTPS URL. The separate commit-digest email from `/api/check-github` on Vercel is currently paused: the `commit-monitor.yml` schedule is disabled, so no digest emails are sent. The visitor's browser never connects directly to D1.

## 1. Create and connect your Cloudflare account

1. Sign in or create an account at [Cloudflare](https://dash.cloudflare.com/).
2. In a terminal, from this repository, run `npm ci`.
3. Log in to Wrangler with `npx wrangler login`.
4. Create the database with `npm run cf:db:create` if the one in `wrangler.jsonc` does not exist yet. Wrangler prints a UUID; put it in `wrangler.jsonc` as `database_id`.
5. Keep the configured database name `mohammad-umar-portfolio` unchanged, or update it consistently in `wrangler.jsonc`, `package.json`, and `.github/workflows/deploy-cloudflare.yml`.

### Bootstrap the first Worker

The first Worker needs to exist before the repository's deploy token can update it. Cloudflare requires account-level Workers Admin permission to create a new Worker; subsequent deployments to an existing Worker can use Editor access. To avoid giving the GitHub token broader creation privileges, create a starter Worker once in **Workers & Pages → Create application → Create Worker**, and name it exactly `mohammad-umar-portfolio`. Then run the repository workflow again; Wrangler will publish the React build and `server/cloudflare-worker.js` over that starter. Alternatively, grant the GitHub token Workers Admin at the account scope if you want CI to create the Worker itself. [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/)

## 2. Add Worker secrets

Set the secrets for the deployed Worker (Wrangler prompts for each value):

```sh
npx wrangler secret put IP_HASH_SALT
npx wrangler secret put TURNSTILE_SECRET
```

- `IP_HASH_SALT`: a long random value used to hash IP addresses for the contact rate limit.
- `TURNSTILE_SECRET`: the secret key for the Turnstile widget. If you are not setting up Turnstile yet, skip this secret; the contact API will continue to use validation, a honeypot, and its hourly rate limit.

Contact email secrets are no longer needed. `RESEND_API_KEY`, `CONTACT_TO`, and `RESEND_FROM` on Vercel are only used by the commit digest, whose scheduled runs are currently paused.

For local development, copy `.dev.vars.example` to `.dev.vars` and fill the same values. `.dev.vars` is ignored by Git. To test without Turnstile, leave `TURNSTILE_SECRET` blank and leave the site key unset.

## 3. Contact messages are stored, not emailed

Contact-form email delivery is intentionally disabled on both hosts. Accepted submissions are stored in D1; no Cloudflare Email Service or Resend notification is sent for them. The `send_email` binding remains in `wrangler.jsonc` for compatibility but is unused.

You can inspect stored submissions with:

```sh
npx wrangler d1 execute mohammad-umar-portfolio --remote --command "SELECT created_at, name, email, topic, message FROM contact_messages ORDER BY created_at DESC"
```

## 4. Enable Turnstile (recommended)

1. In the Cloudflare dashboard, open **Turnstile** and create a widget.
2. Add the hostname you will use, such as the Worker `workers.dev` hostname and later your custom domain.
3. Add the widget's secret as the `TURNSTILE_SECRET` Worker secret above.
4. In the GitHub repository, open **Settings > Secrets and variables > Actions > Variables** and add `REACT_APP_TURNSTILE_SITE_KEY` with the widget's public site key.

The form renders the widget when the public site key is present. The Turnstile API script is loaded only when the contact section is near the viewport, and the challenge runs only when the visitor starts using the form (`execution: "execute"`, `appearance: "interaction-only"`). This prevents Cloudflare's challenge iframe from running during normal browsing. The API verifies the submitted token with Cloudflare before accepting the message. Cloudflare requires server-side token verification for Turnstile; the client widget by itself is not sufficient ([Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)).

## 5. Configure GitHub auto-deploy

The repository includes `.github/workflows/deploy-cloudflare.yml`. Each push to `main` builds React, applies outstanding D1 migrations, and deploys the Worker.

1. In the Cloudflare dashboard, copy your account ID from **Workers & Pages**.
2. Create a Cloudflare API token with permission to edit Workers and D1 in this account. Scope it to this account.
3. In GitHub, open **Settings > Secrets and variables > Actions > Secrets** and create:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN`
4. Push to `main` or run the workflow manually from the **Actions** tab.
5. Open the completed workflow run. The deployment output shows the live `workers.dev` URL.

Never commit API tokens, email credentials, Turnstile secrets, or `.dev.vars`. Cloudflare's GitHub Actions setup uses the account ID and API token as GitHub secrets ([Cloudflare CI/CD guide](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)).

## 6. Apply the database and run locally

```sh
npm ci
npm run cf:migrate:local
npm run cf:dev
```

Wrangler serves the site locally and uses a local D1 database. Contact email is disabled, so no Email Service setup is needed for local testing. Before the first production deployment, apply the initial D1 migration once:

```sh
npm run cf:migrate:remote
npm run cf:deploy
```

After GitHub secrets are configured, the workflow handles remote migrations and deploys on every push to `main`.

## 7. Custom domain

The live domain `mohammadumar.site` (and `www.mohammadumar.site`) is attached to the deployed Worker. To add another, open **Workers & Pages > your Worker > Settings > Domains & Routes** and add the hostname after its DNS points at Cloudflare. The Worker runs on every request (`run_worker_first: ["/*"]`) so it can redirect any non-canonical host or plain-HTTP request to `https://mohammadumar.site/`, then serve assets through the `ASSETS` binding.

For Turnstile, add `mohammadumar.site`, `www.mohammadumar.site`, `mohammadumarportfoloi.online`, and `www.mohammadumarportfoloi.online` as allowed hostnames on the widget, otherwise the challenge can fail depending on which hostname the visitor used.

## What the app does

- `GET /api/health` returns Worker API health.
- `POST /api/contact` validates and rate-limits submissions, verifies Turnstile when configured, and stores them in D1. It does not send contact email.
- Unmatched app routes fall back to React for single-page navigation.
- The portfolio Q&A panel is an offline, rule-based guide over the visible portfolio data; it does not call a hosted AI model.

## Environment variable checklist

| Where | Name | Required? | Purpose |
| --- | --- | --- | --- |
| GitHub Actions repository secret | `CLOUDFLARE_ACCOUNT_ID` | Yes | Selects the Cloudflare account for Wrangler. |
| GitHub Actions repository secret | `CLOUDFLARE_API_TOKEN` | Yes | Lets CI apply D1 migrations and deploy the Worker. |
| Worker secret | `IP_HASH_SALT` | Yes for contact submissions | Salt used to hash IP addresses for the rate limit. |
| Worker secret | `TURNSTILE_SECRET` | Only if enabling Turnstile | Server-side verification key. Pair it with the public site key below. |
| GitHub Actions variable | `REACT_APP_TURNSTILE_SITE_KEY` | Only if enabling Turnstile | Public key rendered by the React contact form at build time. |
| React build variable | `REACT_APP_API_URL` | No | Leave unset for this same-origin Worker API; the app defaults to `/api`. |
| Local `.dev.vars` | `IP_HASH_SALT` and optional Worker secrets | Only for local Worker development | Local-only values; copy `.dev.vars.example` and replace its placeholders. |

Contact-form email delivery is disabled on both hosts. The `send_email` binding remains in `wrangler.jsonc` for compatibility but is unused. `RESEND_API_KEY` on Vercel is still required for the commit digest if its schedule is re-enabled.

The GitHub deployment token and the Worker runtime secrets serve different purposes. The deployment token is stored in GitHub and is not available to the browser or the Worker. Runtime secrets are stored on the deployed Worker. The separate `commit-monitor.yml` workflow calls `https://www.mohammadumarportfoloi.online/api/check-github` because that endpoint exists only on the Vercel deployment; the Worker returns 404 for it. Its `schedule` trigger is currently commented out, so it only runs when triggered manually. Keep that URL pointed at whichever host serves `/api/check-github`.
