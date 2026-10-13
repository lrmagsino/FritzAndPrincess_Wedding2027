"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  onReveal?: () => void;
}

/** Fades content up with the Web Animations API when it scrolls into view. */
export function Reveal({ children, delay = 0, className, onReveal }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const animation = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (
      !el ||
      typeof el.animate !== "function" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const anim = el.animate(
      [
        { opacity: 0, transform: "translate3d(0, 22px, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      { duration: 900, delay, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)", fill: "both" },
    );
    anim.pause();
    animation.current = anim;
    return () => anim.cancel();
  }, [delay]);

  useEffect(() => {
    const el = ref.current;
    const anim = animation.current;
    if (!el || !anim || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          anim.play();
          onReveal?.();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onReveal]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
