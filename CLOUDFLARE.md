# Cloudflare setup

The portfolio builds as a React single page app. The Cloudflare Worker runs the existing Express framework in Cloudflare's Workers runtime and serves the built frontend from the same origin. D1 stores contact form submissions.

## First time setup

1. Create a Cloudflare D1 database named `mohammad-umar-portfolio` and copy its ID into `wrangler.jsonc` in place of `REPLACE_WITH_D1_DATABASE_ID`.
2. Replace `IP_HASH_SALT` in `wrangler.jsonc` with a long random value. It is used only to hash visitor IP addresses for rate limiting.
3. Run `npm install` and then `npm run cf:migrate:local` to create the local D1 table.
4. Run `npm run cf:dev` to build the React app and start the Worker locally.
5. Before deploying, apply the schema remotely with `npm run cf:migrate:remote`, then deploy with `npm run cf:deploy`.

The contact endpoint accepts `POST /api/contact` with `name`, `email`, `topic`, and `message`. It validates input, limits each visitor to five submissions per hour, and stores messages in D1. Configure Cloudflare email notifications or an inbox workflow separately if you want new submissions forwarded; the API currently stores them securely but does not send email.

## Build settings

Cloudflare Workers uses `npm run build` for the frontend build and `wrangler.jsonc` for deployment. The SPA and Express API share one origin; `/api/*` requests go to Express, and other paths are served from the React build output.

Set `REACT_APP_API_URL` only if the API is hosted on a separate origin. For the same-origin Worker deployment, leave it unset.
