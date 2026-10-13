# Design system

## Colour

| Token            | Hex               | Use                                                       |
| ---------------- | ----------------- | --------------------------------------------------------- |
| burgundy-950     | #2B0610           | Page and hero base                                        |
| burgundy-900     | #3A0A16           | Dark sections                                             |
| burgundy-800     | #4A0E1E           | Cards on dark, hero glow                                  |
| burgundy-700     | #5E1428           | Accent text on ivory                                      |
| burgundy-accent  | #A3304A           | Small accents only (compass north point, airplane stripe) |
| silver-300 / 400 | #BDBFC4 / #A7A9AF | Line art, secondary text on dark                          |
| silver-600       | #5D5F66           | Supporting text on ivory                                  |
| ivory            | #F4EDE3           | Main text on dark, light sections                         |
| warm-white       | #FBF8F3           | Names, cards on ivory                                     |
| champagne        | #CDB89A           | Focus rings only                                          |

Rule: main text is never burgundy on a burgundy background. Measured contrast (WCAG): ivory on burgundy-900 14.6:1, silver-300 on burgundy-900 9.2:1, burgundy-900 on ivory 14.6:1, silver-600 on ivory 5.5:1.

## Typography

- **Cormorant Garamond** (500, 600, italic 500): editorial high-contrast serif for names and headings. Names are uppercase with 0.04em tracking.
- **Michroma**: small uppercase labels, wide tracking. Never for paragraphs.
- **Space Grotesk**: body, buttons, navigation, forms.

Fonts are self-hosted from `src/app/fonts` via `next/font/local`.

## Logo

Assets in `public/brand`: `princess-fritz-logo.png` (burgundy and silver, transparent, for ivory backgrounds), `princess-fritz-logo-light.png` (ivory and silver, for burgundy backgrounds), `princess-fritz-monogram-light.png` (F&P mark for the hero), `og-image.png` (social preview). All are genuinely transparent except the social preview. Use `WeddingLogo`; never place the burgundy logo on burgundy.

## Travel elements

Compass, globe, airplane, and route are SVG, silver-gray line art with ivory detail and a restrained burgundy accent. They stay subtle and never sit above text.

## Buttons

Thin 1px border, uppercase Space Grotesk, 3rem minimum height. Hover inverts colours. Focus shows a 2px champagne (dark) or burgundy (light) ring. Press scales to 0.96 with a CSS spring.

## Cards

Flat, 1px hairline border, no shadow. Hover lifts 4px with a spring.

## Wishes and forms

Forms use visible Space Grotesk labels, neutral fields, concise inline errors, and a clear submit/loading state. Wishes are flat burgundy cards with a silver-gray hairline, ivory message text, and the guest's display name. The public wishes wheel is keyboard-scrollable, updates live, and loads older active messages as guests reach the end. New submissions appear publicly immediately; authors may manage only their own messages.

## Calendar

The April 2027 calendar uses a semantic table with weekday headers. April 23 is highlighted with a burgundy circle and a small heart; other dates stay neutral.

## RSVP

RSVP embeds the couple's Google Form in an ivory card, with an external link as a fallback if the form cannot be accessed. No RSVP details are stored on this website.

## Navigation

Fixed top bar, near-opaque burgundy, monogram at left. Links show from 1280px; below that a labelled Menu button (`aria-expanded`) opens a list.

## Responsive layout

Mobile-first. Sections alternate dark and ivory. Max content width 72rem. The hero switches to a portrait scene when the viewport aspect ratio is narrower than 9:10.

## Component rules

- Decorative SVG gets `aria-hidden="true"` and `focusable="false"`.
- Animate only `transform` and `opacity`.
- Any new motion must have a reduced-motion fallback.
- Content lives in `src/lib/wedding.ts`, not inside components.
