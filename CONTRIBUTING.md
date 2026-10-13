# Contributing

## Requirements

Node.js 22 and npm.

## Install and run

```bash
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` for local configuration. To enable wishes, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, then apply the migration in `supabase/migrations/`. Never use a Supabase service-role key in the website. Set `NEXT_PUBLIC_RSVP_FORM_URL` when the Google Form is ready.

## Verify before opening a pull request

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Use `npm run format` to fix formatting.

## Branches

`feat/hero-route`, `fix/rsvp-validation`, `docs/theme`, `chore/deps`.

## Commits

Conventional Commits:

- `feat(hero): add airplane route`
- `fix(rsvp): show error for empty name`
- `docs: describe reduced-motion fallback`

## Pull requests

Small, focused, with a description of what and why. CI must pass. Keep accessibility and reduced-motion behaviour intact.

## Screenshots

Visual changes need before and after screenshots at mobile and desktop widths.

## Secrets

Never commit secrets, tokens, or private guest data. The Supabase publishable key and public project URL are intended for the client and must be restricted by the supplied RLS policies. Never expose a Supabase service-role key. Use `.env.example` for non-secret configuration only.
