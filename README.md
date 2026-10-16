<img width="1536" height="1024" alt="Burgundy travel wedding monogram" src="https://github.com/user-attachments/assets/d663e587-a1d7-40a6-9145-1080c789acb7" />

# Princess and Fritz Wedding

An elegant, travel-inspired digital invitation for Fritz & Princess.

> Together today, tomorrow, and always.

The invitation celebrates their wedding on **April 23, 2027** in **Antipolo, Rizal**. Its visual identity pairs deep burgundy and silver-gray with ivory, editorial serif typography, and a compass, globe, airplane, and route to represent a lifelong journey.

## Technology

- Next.js 16 App Router, React 19, and TypeScript 5
- Tailwind CSS v4 and a hand-written CSS design system
- Self-hosted Cormorant Garamond, Michroma, and Space Grotesk
- CSS springs, the Web Animations API, SVG parallax, and Lenis smooth scrolling
- Supabase PostgreSQL for wishes and prayers, protected by Row Level Security
- Google Forms for RSVP (no RSVP database)
- Node.js 22, npm, ESLint 9, Prettier 3, and GitHub Actions

## Invitation features

- Full-screen invitation cover and airplane opening transition
- Personalized greeting from the URL's `name` query parameter, safely sanitized before display
- Journey-inspired animated hero with a globe, compass, route, and airplane
- Our Story timeline and user-controlled four-photo airplane slideshow
- Ceremony and Reception event cards with accessible detail dialogs and configurable Google Maps links
- Our Story, Entourage, Dress Code, and Timeline
- Local-time countdown and accessible April 2027 calendar highlighting April 23
- Immediate public wishes and prayers with private author tokens and a protected owner dashboard
- Embedded Google Form RSVP with an external-link fallback
- Gifts and photo gallery sections; unconfirmed details remain “To be announced”
- Responsive layouts, keyboard access, and reduced-motion support

Personalized invitation links can use this format:

```text
https://lrmagsino.github.io/FritzAndPrincess_Wedding2027/?name=Guest%20Name
```

## Develop locally

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and set the public configuration described below. Without Supabase settings, the rest of the invitation works and the wishes area explains that it is not connected.

## Environment variables

| Variable                               | Purpose                                                                |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_BASE_PATH`                | GitHub Pages project path; leave empty for local development           |
| `NEXT_PUBLIC_SITE_URL`                 | Canonical public site URL                                              |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL                                                   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable/anonymous client key                              |
| `NEXT_PUBLIC_RSVP_FORM_URL`            | External Google Forms RSVP URL; defaults to the couple's supplied form |
| `NEXT_PUBLIC_RSVP_EMBED_URL`           | Embedded Google Forms URL; defaults to the couple's supplied form      |
| `NEXT_PUBLIC_CEREMONY_MAP_URL`         | Ceremony Google Maps URL; defaults to the supplied parish link         |
| `NEXT_PUBLIC_RECEPTION_MAP_URL`        | Reception Google Maps URL; defaults to the supplied Garden Hive link   |

The publishable Supabase key is intended for browser use and is constrained by RLS. **Never add a service-role key to a `NEXT_PUBLIC_*` variable or client code.**

### Supabase wishes setup

1. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for local development and as GitHub Actions repository variables for deployment.
2. For a new project, run migrations in timestamp order from the Supabase SQL Editor:
   - [`supabase/migrations/20261013000000_create_wishes.sql`](./supabase/migrations/20261013000000_create_wishes.sql)
   - [`supabase/migrations/20261013010000_public_live_wishes.sql`](./supabase/migrations/20261013010000_public_live_wishes.sql)
   - [`supabase/migrations/20261013020000_secure_wish_ownership.sql`](./supabase/migrations/20261013020000_secure_wish_ownership.sql)
   - [`supabase/migrations/20261013030000_immediate_wishes_ownership.sql`](./supabase/migrations/20261013030000_immediate_wishes_ownership.sql)
   - [`supabase/migrations/20261013040000_name_only_wish_ownership.sql`](./supabase/migrations/20261013040000_name_only_wish_ownership.sql)
     For the existing project with the wishes table and previous security migrations already applied, run only `20261013040000_name_only_wish_ownership.sql`. If the earlier immediate-public migration is not applied, run `20261013030000_immediate_wishes_ownership.sql` first.
3. In Supabase **Authentication → URL Configuration**, allow the local callback `http://localhost:3000/**` and the deployed callback `https://lrmagsino.github.io/FritzAndPrincess_Wedding2027/**`. Set the deployed URL as the Site URL when using the published website.
4. Enable email sign-in and password authentication under **Authentication → Sign In / Providers → Email**. Configure a production SMTP provider so owners can receive sign-in links reliably.

Guests submit only a name and wish or prayer; no guest email or sign-in is required. Each new message receives a random private ownership token held in that browser and only its hash is stored in Supabase. The author can edit or soft-delete that message from the same browser. Clearing browser storage or switching devices loses that guest management access. Messages appear publicly as soon as they are submitted; public cards show the guest name, message, and submission time. Only the two authenticated accounts added to `wish_owners` can edit or soft-delete any message from `/owner/wishes`, linked as Owner Control at the end of navigation for those accounts only. Database functions and Row Level Security enforce these permissions; the publishable key is not an authorization secret. Existing messages are made public by the ownership migration, but legacy rows without a private token can only be managed by the owners or, for older authenticated posts, by their signed-in author.

After Princess and Fritz have each signed in once using their own email addresses, add only their accounts in the Supabase SQL Editor. Replace each example email with the exact email they used:

```sql
insert into public.wish_owners (user_id)
select id from auth.users where email = lower('gayapanaoprincess@gmail.com')
on conflict (user_id) do nothing;

insert into public.wish_owners (user_id)
select id from auth.users where email = lower('fritz@example.com')
on conflict (user_id) do nothing;
```

Check that each statement inserted a row. If an email does not yet exist in `auth.users`, have that person sign in first and run the statement again. Do not grant owner access based on a typed name, URL value, or client-side setting.

Owners can sign in at `/owner/wishes` with either a password or an email link. To set a password for an existing owner account, sign in with its email link once, open **Set or change password** in Owner Control, and save a password. After that, password sign-in works on other devices without requesting an email. Passwords are set only for the currently authenticated owner; the app has no public password signup.

### RSVP setup

The RSVP section embeds the couple's Google Form. If the form changes, update `NEXT_PUBLIC_RSVP_FORM_URL` and `NEXT_PUBLIC_RSVP_EMBED_URL`. RSVP responses are handled by Google Forms; this website does not collect or store RSVP data.

## Commands

```bash
npm run dev
npm run format
npm run format:check
npm run lint
npm run typecheck
npm run build
```

`npm run build` creates a static export in `out/` for GitHub Pages. The deploy workflow builds on Node.js 22. Set the public Supabase and RSVP values as GitHub Actions repository variables with the same names above; do not use secrets for values intentionally embedded in the public website.

## Project sections

Welcome · Our Story · Calendar · Countdown · Ceremony & Reception · Entourage · Timeline · Dress Code · Gifts · Wishes & Prayers · RSVP · Gallery · Footer

## Branches and commits

Use short branches such as `feat/wishes-form`, `fix/calendar-layout`, or `docs/setup`. Follow Conventional Commits, for example `feat(wishes): add live public wishes wall`. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contribution guidance.

## Documentation

Start at the [documentation index](./docs/README.md) for the design system, animations, accessibility, product requirements, and domain model.

## License

MIT License

Copyright (c) 2026 Princess and Fritz Wedding

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
