# Accessibility (WCAG 2.2 AA)

## Targets

Perceivable, operable, understandable, robust at AA. Not dependent on animation: every fact is in the DOM text.

## Keyboard

Skip link, native buttons and links, menu button with `aria-expanded`, native `<dialog>` cover and lightbox that trap focus. The cover cannot be dismissed by Escape because opening it is an explicit invitation action. Opening the cover returns focus to the hero at the top of the page; navigation links move focus to their target section.

## Colour contrast

See [design.md](design.md). All text pairs measured at 5.5:1 or higher.

## Alternative text

The logo has descriptive alt text. Gallery buttons carry the full image description in their accessible name; their artwork is hidden from assistive technology.

## Focus styles

2px champagne ring on dark, burgundy on light, 3px offset. Never removed.

## Reduced motion

Honoured in CSS and JavaScript. See [animations.md](animations.md).

## Accessible SVGs

Decorative SVGs use `aria-hidden="true"` and `focusable="false"`. Colour swatches are `role="img"` with names.

## Forms

Visible labels, `aria-invalid`, `aria-describedby` for errors, live success/error status, disabled/loading submit state, and 44px minimum targets. The wishes textarea indicates its character limit. The countdown does not announce every second.

## Calendar

The April 2027 calendar is a semantic table with a caption, weekday column headers, and a textual accessible label for the highlighted wedding date.

## Mobile testing checklist

- 320, 375, 390, 414, 768 px widths with no horizontal scroll
- 200% text zoom
- Screen reader pass (VoiceOver, TalkBack)
- Reduced-motion setting enabled
