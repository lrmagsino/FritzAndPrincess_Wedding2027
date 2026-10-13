# Instructions for AI coding agents

- Build from scratch when asked; do not assume existing files or components.
- Follow the burgundy and silver-gray design system in `docs/design/design.md`. Main text is never burgundy on burgundy.
- Use SVG for animated visual elements; no raster images for anything that animates or scales, and no WebGL.
- Maintain WCAG 2.2 AA accessibility.
- Support `prefers-reduced-motion` for every animation.
- Avoid unnecessary dependencies.
- Never commit secrets.
- Do not invent wedding details; use "To be announced".
- Run all verification commands before finishing: `npm ci`, `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run build`.
- Do not add AI-agent Co-authored-by trailers to commits.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
