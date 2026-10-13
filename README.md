<img width="1536" height="1024" alt="Burgundy travel wedding monogram" src="https://github.com/user-attachments/assets/d663e587-a1d7-40a6-9145-1080c789acb7" />

# Princess and Fritz Wedding

The official wedding website and digital invitation platform for the wedding of **Princess and Fritz**.

This website provides guests with a personalized and interactive experience where they can view the couple’s story, wedding details, entourage, dress code, venue information, RSVP instructions, gift details, and other important announcements.

**Theme:** Burgundy Romance  
**Tagline:** “Together today, tomorrow, and always.”

## Technology Stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 App Router, React 19, TypeScript 5 |
| Styling | Tailwind CSS v4 and a hand-written design system |
| Motion | CSS springs, Web Animations API, Lenis smooth scroll |
| Illustration | Live SVG parallax scene, no WebGL |
| Fonts | Michroma, Space Grotesk |
| Tooling | Node.js 22, npm, ESLint 9, Prettier 3 |
| CI | GitHub Actions |
| Backend | Browser-only demo with no backend or database |

## Frontend Documentation

The documentation used by the frontend team.

| File | Covers |
|---|---|
| `docs/README.md` | Index for all project documentation |
| `docs/design/design.md` | Design system, colours, typography, brand elements, and components |
| `docs/design/theme.md` | Burgundy wedding theme, colour palette, illustration rules, and layout structure |
| `docs/design/animations.md` | Motion system, spring tokens, scroll motion, and reduced-motion behaviour |
| `docs/design/accessibility.md` | Accessibility targets and testing procedures |
| `docs/design/content.md` | Writing style, capitalization, dates, error messages, and invitation copy |
| `src/app/fonts/README.md` | Brand fonts and how they are loaded |

## Product Documentation

| File | Covers |
|---|---|
| `docs/product/prd.md` | Website goals, guest personas, page requirements, and non-functional needs |
| `docs/product/information-architecture.md` | Sitemap, navigation, and guest flows |
| `docs/product/domain-model.md` | Guest information, invitation status, RSVP details, and wedding information |

## Design

The website follows a romantic, elegant, and timeless visual direction centered on a burgundy wedding theme.

- Burgundy-based colour palette
- Complementary cream, white, gold, and neutral tones
- Michroma and Space Grotesk typography
- Elegant floral and wedding-inspired visual elements
- Live SVG illustration and parallax scenes
- Smooth scrolling and gentle page transitions
- Responsive layouts for mobile, tablet, and desktop
- Accessible interactions and reduced-motion support
- Personalized invitation experience for every guest

## Product Features

- Personalized guest invitations
- Personalized guest greetings
- Couple’s love story
- Wedding countdown
- Ceremony and reception details
- Wedding entourage
- Burgundy-inspired dress code guide
- Wedding day timeline
- Venue map and directions
- RSVP instructions
- Gift and cash-gift information
- Photo gallery
- Background music controls
- Responsive and accessible design

## Website Sections

| Section | Covers |
|---|---|
| Welcome | Personalized greeting for each guest |
| Our Story | The love story and journey of Princess and Fritz |
| Wedding Details | Date, time, ceremony, and reception information |
| Entourage | Members of the wedding entourage and their roles |
| Dress Code | Recommended guest attire and burgundy wedding colours |
| Timeline | Schedule of activities during the wedding day |
| Location | Ceremony and reception venues with directions |
| Gifts | Gift suggestions and cash-gift information |
| RSVP | Instructions for confirming attendance |
| Gallery | Photos and memories of the couple |

## Personalized Invitations

Each guest may receive a personalized invitation link using the following format:

```text
https://lrmagsino.github.io/princess_fritz_wedding2027/?name=Guest%20Name
```

Example:

```text
https://lrmagsino.github.io/princess_fritz_wedding2027/?name=Jocelyn%20Gayapanao
```

The guest’s name is displayed automatically on the invitation page. Spaces in names should be replaced with `%20`.

## Design Decisions

| ADR | Decision |
|---|---|
| 0001 | The burgundy wedding theme guides the overall visual direction |
| 0002 | Browser-only demo with no backend or database |
| 0003 | Guest personalization is handled through URL parameters |
| 0004 | CSS spring transitions and Web Animations API are used for motion |
| 0005 | Michroma and Space Grotesk are used as the primary typefaces |
| 0006 | Tailwind CSS v4 is used without the default preflight |
| 0008 | Scroll-linked motion and Lenis are used without WebGL |
| 0009 | The website uses a burgundy-based wedding colour system |

## Development Workflow

### Setup

Requires Node.js 22 and npm.

```bash
git clone https://github.com/lrmagsino/princess_fritz_wedding2027.git
cd princess_fritz_wedding2027
npm ci
npm run dev
```

Open the website at:

```text
http://localhost:3000
```

No backend, database, or Docker installation is required. The website runs using browser-based demo data.

### Branch, Commit, and Pull Request

Create a branch from `staging`:

```bash
git fetch origin
git switch -c feat/description origin/staging
```

Use Conventional Commits:

```text
feat: add personalized wedding invitation
fix: correct venue information
style: update burgundy wedding colour palette
docs: update guest instructions
```

Run the same checks used by CI:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Push the branch and open a pull request against `staging`.

## Rules

- Never commit directly to `main` or `staging`.
- Never force-push or delete protected branches.
- Never commit passwords, API keys, or `.env` files.
- Do not expose private guest information unnecessarily.
- Verify all names, dates, venues, and links before deployment.
- Test the website on desktop, tablet, and mobile devices.
- Confirm that personalized invitation links work correctly.
- Do not add AI-agent `Co-authored-by` trailers to commits.
- A maintainer must review and merge pull requests.

## Backend

This project is currently a browser-only wedding invitation website.

There is no backend, database, authentication system, or external API. Guest personalization is handled through URL query parameters, while wedding content is stored in the frontend.

If RSVP data, guest management, attendance tracking, or an administrative dashboard is added in the future, the backend architecture should be documented in:

```text
backend/README.md
```

## Deployment

The website is deployed using GitHub Pages.

Before deployment, verify that:

- The production build completes successfully.
- Personalized links display the correct guest names.
- Wedding dates and venue details are accurate.
- Navigation buttons and external links work properly.
- The website is responsive on mobile devices.
- Images and fonts load correctly.
- Accessibility checks pass.
- No private information is exposed in the source code.

## License

This project is created for the wedding celebration of **Princess and Fritz**.

All rights reserved.
