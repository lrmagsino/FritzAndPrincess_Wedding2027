"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/wedding";
import { scrollToId } from "@/lib/scroll";
import { getSupabaseClient } from "@/lib/supabase";
import { useWishAuth } from "@/components/wishes/WishAuth";

export function WeddingNavigation() {
  const [open, setOpen] = useState(false);
  const auth = useWishAuth();
  const [ownerAccess, setOwnerAccess] = useState<{ userId: string; isOwner: boolean } | null>(null);
  const userId = auth.user?.id;
  const isOwner = Boolean(
    auth.configured &&
    !auth.loading &&
    !auth.error &&
    userId &&
    ownerAccess?.userId === userId &&
    ownerAccess.isOwner,
  );

  useEffect(() => {
    if (auth.loading || !userId || !auth.configured || auth.error) return;
    let active = true;
    void Promise.resolve().then(async () => {
      try {
        const supabase = getSupabaseClient();
        if (!supabase) return;
        const { data, error } = await supabase
          .from("wish_owners")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle();
        if (error) throw error;
        if (active) setOwnerAccess({ userId, isOwner: Boolean(data) });
      } catch (error) {
        console.error("Unable to verify navigation owner access.", error);
        if (active) setOwnerAccess({ userId, isOwner: false });
      }
    });
    return () => {
      active = false;
    };
  }, [auth.configured, auth.error, auth.loading, userId]);

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className="nav">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-h)] max-w-7xl items-center justify-between px-5"
      >
        <a
          href="#top"
          className="display text-2xl tracking-wide"
          aria-label="Fritz and Princess — back to top"
          onClick={(e) => {
            e.preventDefault();
            setOpen(false);
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
          }}
        >
          F<span className="text-silver-300 italic">&amp;</span>P
        </a>

        <ul className="hidden items-center xl:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} className="nav-link" onClick={go(link.id)}>
                {link.label}
              </a>
            </li>
          ))}
          {isOwner ? (
            <li>
              <Link href="/owner/wishes/" className="nav-link inline-flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <rect x="3" y="7" width="10" height="7" rx="1" />
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                </svg>
                Owner Control
              </Link>
            </li>
          ) : null}
        </ul>

        <button
          type="button"
          className="label flex min-h-11 items-center gap-2 border border-silver-400 px-4 xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <ul
          id="mobile-menu"
          className="mx-auto max-h-[calc(100svh-var(--nav-h))] max-w-7xl overflow-y-auto border-t border-silver-400/25 px-5 pb-4 xl:hidden"
        >
          {navLinks.map((link) => (
            <li key={link.id} className="border-b border-silver-400/15 last:border-0">
              <a
                href={`#${link.id}`}
                className="block py-3 text-sm tracking-[0.2em] uppercase"
                onClick={go(link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
          {isOwner ? (
            <li className="border-b border-silver-400/15 last:border-0">
              <Link
                href="/owner/wishes/"
                className="flex min-h-11 items-center gap-2 py-3 text-sm tracking-[0.2em] uppercase"
                onClick={() => setOpen(false)}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                >
                  <rect x="3" y="7" width="10" height="7" rx="1" />
                  <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
                </svg>
                Owner Control
              </Link>
            </li>
          ) : null}
        </ul>
      ) : null}
    </header>
  );
}
