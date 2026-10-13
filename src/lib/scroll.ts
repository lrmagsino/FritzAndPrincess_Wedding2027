import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

const NAV_OFFSET = 72;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) {
    instance.scrollTo(el, { offset: id === "welcome" ? 0 : -NAV_OFFSET, duration: 1.5 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  el.focus({ preventScroll: true });
  history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
}
