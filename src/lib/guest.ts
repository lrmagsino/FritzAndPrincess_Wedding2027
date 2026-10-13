const MAX_NAME_LENGTH = 60;

/**
 * Turns the raw `name` query parameter into a safe, display-only guest name.
 * React escapes text on render; this additionally strips anything that is not
 * a letter, mark, number, space or common name punctuation, and limits length.
 */
export function sanitizeGuestName(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M}\p{N}\s.'’&,-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_NAME_LENGTH)
    .trim();
}

export function guestFromSearch(search: string): string {
  try {
    return sanitizeGuestName(new URLSearchParams(search).get("name"));
  } catch {
    return "";
  }
}
