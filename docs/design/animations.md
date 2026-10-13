# Animation

All scroll motion is driven by one `requestAnimationFrame`-throttled scroll listener in `WeddingHero`. It writes a `--p` custom property (0 to 1 across 85% of the hero height) and positions the airplane.

## Parallax layers

1. **Atmosphere** (`.layer-bg`): faint rings and dust, moves 30 units down.
2. **Globe and compass** (`.layer-globe`, `.layer-compass`): globe drifts up 50 and rotates 10 degrees; compass moves up 95 and rotates 55 degrees. Different depths.
3. **Route and airplane** (`.layer-route`): moves up 16.

## Airplane path motion

The airplane is an SVG group. On each update the hero reads `getPointAtLength` on the route for position and two nearby points for the tangent angle, then sets `translate rotate scale`. Progress is 8% at rest, rising to 100% with scroll.

## Route reveal

The solid route fades in with the airplane's scroll progress while a faint dotted guide shows the complete curve from the beginning. The opening transition also fades in its SVG route as the plane travels it.

## Compass and globe

The compass rotates with scroll. The globe's six meridians sweep with a 120-second CSS `scaleX` animation, offset so it reads as slow rotation.

## Other motion

- Invitation cover: a restrained logo fade-in and breathing animation, followed by a 2-second airplane path and route reveal when the guest opens the invitation.
- Hero scroll cue: a small down arrow moves gently below the "Please scroll down" instruction. It has no essential meaning beyond the visible text and stops under reduced motion.
- Story slideshow: previous/next, pointer swipes or drags, and arrow keys trigger a restrained airplane flight over a curved route while the current photo slides away and the next photo fades in. Reduced-motion mode changes the slide immediately.
- Wedding timeline: the schedule follows a single vertical route with highlighted ceremony and reception milestones. A small airplane flies the curved SVG connector between the photo session and reception travel when that connector enters view; reduced-motion mode leaves the plane still.
- Hero text: CSS keyframe entrance (no flash before hydration).
- Sections: Web Animations API fade-up via `Reveal`, triggered by IntersectionObserver.
- Story and timeline rails: `--progress` drives `scaleY`.
- Entourage folio and ceremony/reception details: an SVG airplane follows a curved route while the list or dialog opens and closes. Entourage categories advance one at a time with a restrained horizontal fade; navigation dots mark the active category. Reduced-motion mode skips the flights and category transition.
- Buttons and cards: CSS spring from `linear()`.
- Lenis smooth scroll for anchors and wheel.

## Reduced motion

With `prefers-reduced-motion: reduce`: Lenis is not started, parallax is off, CSS animations and transitions are removed, Reveal does nothing, and the hero airplane rests at 55% along a fully drawn route. The cover skips the flight and opens with a simple immediate transition.

## Mobile

Phones use a portrait scene with the compass and globe in the top band and an arc between them, so nothing crosses the text. Only transforms are animated and no blur is used.
