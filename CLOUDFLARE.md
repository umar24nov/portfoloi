# Put the portfolio live on Cloudflare

The target deployment is one Cloudflare Worker: React's production build is served as static assets, and the Express-compatible Worker entry point handles `/api/*`. D1 stores contact messages; the Worker can also validate Turnstile and email new submissions using Cloudflare Email Service.

## Current backend and data flow

- The browser loads the React single-page app from the Worker static asset binding (`build/`).
- The contact form sends JSON to `POST /api/contact` on the same origin. No separate public API host or database connection string is needed in the browser.
- `server/cloudflare-worker.js` is the production backend. It exposes the Express routes through the Cloudflare Workers adapter, checks form fields and the hidden honeypot, applies an IP-hash-based hourly limit, optionally verifies Turnstile, and writes accepted submissions to D1 using prepared SQL.
- D1 is a managed SQLite database. The `migrations/` SQL files define its schema; apply them with the Wrangler migration commands below. Email is a notification side effect through the `EMAIL` binding, not the source of truth. A message can be stored even when email delivery is unavailable.
- The older `server/server.js`, Mongoose models, and controllers are a separate legacy Node/Mongo implementation. The Cloudflare Worker does not import or use that backend; `npm run legacy:server` is only for working on that old server. The active local workflow is `npm run cf:dev`.
- The portfolio's “Ask Umar AI” is an offline, profile-based question/answer guide in the frontend. It does not call an LLM or send prompts to a server.

The old `vercel.json` deployment configuration has been removed from the Cloudflare migration. Also disconnect or disable any Vercel Git integration in the Vercel dashboard if it remains connected; removing the file in Git cannot change account-level integrations.

### What is running before Cloudflare is configured

The GitHub commit currently reports a successful Vercel deployment, so the Vercel Git integration is still active. In that deployment, `api/contact.js` is a Vercel serverless function that sends the submitted message through Resend; it does not write to a database. The separate `server/server.js` plus Mongoose models describe an older MongoDB backend and are not automatically part of the current Vercel or Cloudflare deployment. After Cloudflare is configured, the Worker replaces that contact endpoint with D1-backed storage and optional Cloudflare Email Service notifications. The visitor's browser never connects directly to D1 or MongoDB.

## 1. Create and connect your Cloudflare account

1. Sign in or create an account at [Cloudflare](https://dash.cloudflare.com/).
2. In a terminal, from this repository, run `npm ci`.
3. Log in to Wrangler with `npx wrangler login`.
4. Create the database with `npm run cf:db:create`. Wrangler prints a UUID. Copy it into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`.
5. Keep the configured database name `mohammad-umar-portfolio` unchanged, or update it consistently in `wrangler.jsonc`, `package.json`, and `.github/workflows/deploy-cloudflare.yml`.

### Bootstrap the first Worker

The first Worker needs to exist before the repository's deploy token can update it. Cloudflare requires account-level Workers Admin permission to create a new Worker; subsequent deployments to an existing Worker can use Editor access. To avoid giving the GitHub token broader creation privileges, create a starter Worker once in **Workers & Pages → Create application → Create Worker**, and name it exactly `mohammad-umar-portfolio`. Then run the repository workflow again; Wrangler will publish the React build and `server/cloudflare-worker.js` over that starter. Alternatively, grant the GitHub token Workers Admin at the account scope if you want CI to create the Worker itself. [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/)

## 2. Add Worker secrets

Set the secrets for the deployed Worker (Wrangler prompts for each value):

```sh
npx wrangler secret put IP_HASH_SALT
npx wrangler secret put CONTACT_TO
npx wrangler secret put CONTACT_FROM
npx wrangler secret put TURNSTILE_SECRET
```

- `IP_HASH_SALT`: a long random value used to hash IP addresses for the contact rate limit.
- `CONTACT_TO`: your inbox address. It must be a verified destination in your Cloudflare Email Service account.
- `CONTACT_FROM`: an address on a sender domain onboarded in Cloudflare Email Service.
- `TURNSTILE_SECRET`: the secret key for the Turnstile widget. If you are not setting up Turnstile yet, skip this secret; the contact API will continue to use validation, a honeypot, and its hourly rate limit.

For local development, copy `.dev.vars.example` to `.dev.vars` and fill the same values. `.dev.vars` is ignored by Git. To test without Turnstile, leave `TURNSTILE_SECRET` blank and leave the site key unset.

## 3. Enable contact email delivery

Cloudflare Email Sending needs a domain using Cloudflare DNS. In the Cloudflare dashboard, open **Compute > Email Service > Email Sending**, onboard your domain, and publish/verify the suggested SPF, DKIM, and DMARC records. Add and verify the destination inbox for `CONTACT_TO`. The Worker already has the `EMAIL` send binding configured. Cloudflare documents the sender-domain and destination requirements in its [Email Service setup guide](https://developers.cloudflare.com/email-service/get-started/send-emails/).

If you do not have a domain yet, the contact form still stores submissions in D1, but email notifications cannot be sent. You can inspect submissions with:

```sh
npx wrangler d1 execute mohammad-umar-portfolio --remote --command "SELECT created_at, name, email, topic, message FROM contact_messages ORDER BY created_at DESC"
```

## 4. Enable Turnstile (recommended)

1. In the Cloudflare dashboard, open **Turnstile** and create a widget.
2. Add the hostname you will use, such as the Worker `workers.dev` hostname and later your custom domain.
3. Add the widget's secret as the `TURNSTILE_SECRET` Worker secret above.
4. In the GitHub repository, open **Settings > Secrets and variables > Actions > Variables** and add `REACT_APP_TURNSTILE_SITE_KEY` with the widget's public site key.

The form renders the widget when the public site key is present. The API verifies the submitted token with Cloudflare before accepting the message. Cloudflare requires server-side token verification for Turnstile; the client widget by itself is not sufficient ([Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)).

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

Wrangler serves the site locally and uses a local D1 database. The `EMAIL` binding is configured as remote so email tests require an authenticated Cloudflare account and the Email Service sender/domain setup. Before the first production deployment, apply the initial D1 migration once:

```sh
npm run cf:migrate:remote
npm run cf:deploy
```

After GitHub secrets are configured, the workflow handles remote migrations and deploys on every push to `main`.

## 7. Optional custom domain

The `workers.dev` URL works without a custom domain. To use your own domain, add it to Cloudflare DNS, then open the deployed Worker in **Workers & Pages > your Worker > Settings > Domains & Routes** and add the custom domain.

## What the app does

- `GET /api/health` returns Worker API health.
- `POST /api/contact` validates and rate-limits submissions, stores them in D1, verifies Turnstile when configured, and sends an inbox notification when Email Service secrets are configured.
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
| Worker secrets | `CONTACT_TO`, `CONTACT_FROM` | Only if enabling email notifications | Verified recipient and sender for Cloudflare Email Service. Both are needed for sending. |
| React build variable | `REACT_APP_API_URL` | No | Leave unset for this same-origin Worker API; the app defaults to `/api`. |
| Local `.dev.vars` | `IP_HASH_SALT` and optional Worker secrets | Only for local Worker development | Local-only values; copy `.dev.vars.example` and replace its placeholders. |

The GitHub deployment token and the Worker runtime secrets serve different purposes. The deployment token is stored in GitHub and is not available to the browser or the Worker. Runtime secrets are stored on the deployed Worker. This repository's older Firebase, MongoDB, Resend, and Vercel API files are legacy code and are not required by the Cloudflare Worker. The separate `commit-monitor.yml` workflow still calls the former portfolio domain and has not been migrated to this Worker.
