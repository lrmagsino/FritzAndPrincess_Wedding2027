const TOKEN_PREFIX = "wedding-wish-owner:";

export function createWishOwnershipToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function saveWishOwnershipToken(wishId: string, token: string): void {
  localStorage.setItem(`${TOKEN_PREFIX}${wishId}`, token);
}

export function getWishOwnershipToken(wishId: string): string | null {
  return localStorage.getItem(`${TOKEN_PREFIX}${wishId}`);
}

export function removeWishOwnershipToken(wishId: string): void {
  localStorage.removeItem(`${TOKEN_PREFIX}${wishId}`);
}
