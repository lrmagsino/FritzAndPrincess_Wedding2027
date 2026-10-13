"use client";

import { useSyncExternalStore } from "react";
import { guestFromSearch } from "./guest";

function subscribe(notify: () => void) {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
}

/** Reads the sanitised guest name from `?name=` (empty string when absent). */
export function useGuestName(): string {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  return guestFromSearch(search);
}
