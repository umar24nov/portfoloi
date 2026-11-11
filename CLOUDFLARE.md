# Put the portfolio live on Cloudflare

The app is configured as one Cloudflare Worker: React's production build is served as static assets, and Express handles `/api/*`. D1 stores contact messages; the Worker can also validate Turnstile and email new submissions using Cloudflare Email Service.

## 1. Create and connect your Cloudflare account

1. Sign in or create an account at [Cloudflare](https://dash.cloudflare.com/).
2. In a terminal, from this repository, run `npm ci`.
3. Log in to Wrangler with `npx wrangler login`.
4. Create the database with `npm run cf:db:create`. Wrangler prints a UUID. Copy it into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`.
5. Keep the configured database name `mohammad-umar-portfolio` unchanged, or update it consistently in `wrangler.jsonc`, `package.json`, and `.github/workflows/deploy-cloudflare.yml`.

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
