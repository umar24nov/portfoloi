# Mohammad Umar — Personal Portfolio

Personal portfolio of **Mohammad Umar**, a Computer Science undergraduate at COER University (graduating 2027) building full-stack products, polished interfaces, and practical machine-learning projects.

- **Live site:** https://mohammadumar.site/
- **GitHub:** https://github.com/umar24nov
- **LinkedIn:** https://www.linkedin.com/in/mohammadumarfarook
- **Email:** umar24nov@gmail.com

---

## What's in the repo

```
my-portfolio/
├── public/
│   ├── index.html          # SPA shell, meta tags, theme bootstrap, JSON-LD
│   ├── og-image.png        # Social share card (1200x630)
│   ├── favicon.svg
│   ├── site.webmanifest
│   └── robots.txt
├── src/
│   ├── App.jsx             # The whole site: sections, case studies, portfolio guide, contact form
│   ├── index.css           # Design system and layout (Tailwind + custom CSS)
│   ├── index.js            # React entry point
│   ├── App.test.js         # Smoke tests
│   └── reportWebVitals.js
├── api/
│   ├── contact.js          # Vercel serverless function: validation, Turnstile, Resend email
│   └── check-github.js     # GitHub activity monitor endpoint
├── server/
│   ├── cloudflare-worker.js  # Production backend (D1 + Email)
│   └── migrations/           # D1 schema
├── .github/workflows/      # CI, commit monitor, Cloudflare deploy
├── wrangler.jsonc          # Cloudflare Worker configuration
└── CLOUDFLARE.md           # Cloudflare deployment notes
```

The UI is a single-page experience defined in `src/App.jsx` and styled by `src/index.css`. There is no client-side router; sections are scrolled to via `#/section` hashes.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| UI | React 18 |
| Styling | Tailwind CSS 3 + custom CSS |
| Animation | Framer Motion, canvas |
| Contact form | Cloudflare Worker + D1 + Email (Vercel function on the legacy domain) |
| Bot protection | Cloudflare Turnstile |
| Data store | Cloudflare D1 (SQLite) |
| Hosting | Cloudflare Workers (`mohammadumar.site`); Vercel (legacy domain) |

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the dev server at http://localhost:3000 |
| `npm run build` | Production build into `build/` |
| `npm test` | Run the test suite |
| `npm run dev` | Build and run the Cloudflare Worker locally with Wrangler |
| `npm run cf:deploy` | Build and deploy the Worker and static assets to Cloudflare |
| `npm run cf:migrate:local` | Apply D1 migrations to the local database |
| `npm run cf:migrate:remote` | Apply D1 migrations to the remote database |

---

## Environment variables

### Vercel (contact form)

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | yes | Resend API key used to send notification email |
| `CONTACT_TO` | no | Destination inbox (defaults to `umar24nov@gmail.com`) |
| `RESEND_FROM` | no | Verified sender (defaults to `onboarding@resend.dev`) |
| `TURNSTILE_SECRET_KEY` | no | Enables server-side Turnstile verification |

### Build-time (React)

| Variable | Required | Purpose |
|----------|----------|---------|
| `REACT_APP_API_URL` | no | Override the API base URL (defaults to same origin) |
| `REACT_APP_TURNSTILE_SITE_KEY` | no | Renders the Turnstile widget in the contact form |

### Cloudflare Worker

See `CLOUDFLARE.md` and `.dev.vars.example`. The Worker needs `DB`, `IP_HASH_SALT`, and optionally `TURNSTILE_SECRET`, `EMAIL`, `CONTACT_TO`, `CONTACT_FROM`.

---

## Deployment

**Cloudflare Workers is the primary host** for https://mohammadumar.site/. Pushing to `main` runs CI and then deploys the Worker, its static assets, and D1 migrations. The Worker handles `/api/*`, including the D1-backed contact form.

Vercel still serves the older `mohammadumarportfoloi.online` domain from the same repository; its `api/*` functions are the equivalent for that host. The scheduled commit monitor deliberately targets the Vercel domain because `/api/check-github` is only implemented there.

CI (`.github/workflows/ci.yml`) runs the tests and a production build on every push and pull request.

---

## License

No open-source license is granted. The code is published for viewing and inspiration only; please do not copy it wholesale and present it as your own.
