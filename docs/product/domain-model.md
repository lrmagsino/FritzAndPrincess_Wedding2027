# Domain model

- **Couple**: Fritz and Princess, display name "Fritz & Princess".
- **Guest**: a name from the invitation URL (sanitized and limited to 60 characters).
- **Invitation**: one personalized link per guest.
- **Wish**: a guest name and message, browser-token ownership, and timezone-aware creation/update timestamps.
- **Prayer**: a wish or prayer written in the message text.
- **Wedding event**: April 23, 2027; schedule details are to be announced.
- **Venue**: Antipolo, Rizal; name and address to be announced.
- **Entourage member**: role and name (to be announced).
- **Gift information**: to be announced.
- **Gallery item**: a future photo or current illustrative placeholder.

Messages are visible publicly as soon as they are submitted. The database stores `author_id`, `guest_name`, `message`, `created_at`, `updated_at`, and `deleted_at`; there are no approval states or message-type field. Guests submit only a name and message without signing in. A random browser-held ownership token, represented in the database only by its SHA-256 hash, lets the submitting browser edit or soft-delete its own message. Clearing that browser's site storage or switching devices loses the token. Designated owners use authenticated accounts and can edit or soft-delete any message. A database trigger preserves authorship and the original submission time and maintains update timestamps. Soft-deleted messages are hidden publicly; owners may restore them.

The `/owner/wishes` route is marked no-index. “Owner Control” appears at the end of navigation only for an authenticated account in the `wish_owners` table. Access is enforced by that membership table and RLS, not by the route or UI. Only Princess and Fritz should be inserted into `wish_owners`. All displayed timestamps use Philippine time.

## RSVP behaviour

RSVP opens an external Google Form. There is no RSVP table or custom RSVP system in this project.
