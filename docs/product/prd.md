# Product requirements

## Goals

Give guests a beautiful, clear invitation that tells them everything they need and lets them reply.

## Target guests

Family and friends of all ages, mostly on phones, often opening a link shared in a chat app.

## Guest experience

Open a personalized link, view a cover and a safe personalized greeting, explore the story and wedding information, send a wish or prayer, and open the RSVP form.

## Invitation requirements

Name from `?name=`, safe rendering, couple names, date, location, call to action.

## RSVP requirements

Embed the Google Form using `NEXT_PUBLIC_RSVP_EMBED_URL`, with a fallback link from `NEXT_PUBLIC_RSVP_FORM_URL`. Do not create an RSVP database or collect RSVP answers in this site.

## Wishes and prayers

Guests submit only a name and message without signing in. Messages appear publicly immediately. The public wishes wheel shows active messages newest first, loads older entries as guests scroll, and updates live when messages are submitted, edited, or deleted. Public cards show the guest name, message, and submission timestamp; a random browser-held ownership token lets the submitting browser edit or soft-delete its own message. Clearing site storage or switching devices loses that access. Only the two authenticated owner accounts can manage all messages through the protected `/owner/wishes` dashboard, including editing and restoring soft-deleted entries. Enforce token ownership and owner access through protected database functions and RLS; do not add approval states.

## Invitation details

Show a countdown to April 23, 2027 and an accessible April 2027 calendar. Display the provided wedding entourage names and roles; only unconfirmed details such as wedding times, remaining venue information, missing sponsor names, and dress specifics remain clearly marked as to be announced.

## Mobile-first

All layouts designed at 320px first, no horizontal scroll, 44px touch targets, portrait hero scene.

## Performance

Static export, self-hosted fonts, SVG instead of raster for animated parts, only transform and opacity animated, a single scroll listener, no WebGL.
