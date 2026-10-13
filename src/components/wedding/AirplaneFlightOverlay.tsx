"use client";

import { useEffect, useRef } from "react";

interface AirplaneFlightOverlayProps {
  direction: "forward" | "reverse";
  onComplete: () => void;
}

const ROUTES = {
  forward: "M -20 300 C 180 285 240 80 470 165 S 750 350 1020 105",
  reverse: "M 1020 105 C 750 350 710 245 470 165 S 180 285 -20 300",
};

export function AirplaneFlightOverlay({ direction, onComplete }: AirplaneFlightOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGSVGElement>(null);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const route = routeRef.current;
    const plane = planeRef.current;
    if (!overlay || !route || !plane) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      overlay.hidePopover();
      completeRef.current();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = window.setTimeout(finish, 0);
      return () => window.clearTimeout(timeout);
    }

    overlay.showPopover();
    route.setAttribute("d", ROUTES[direction]);
    const length = route.getTotalLength();
    route.style.strokeDasharray = `${length}`;
    route.style.strokeDashoffset = `${length}`;
    const bounds = overlay.getBoundingClientRect();
    const keyframes = Array.from({ length: 41 }, (_, index) => {
      const progress = index / 40;
      const point = route.getPointAtLength(length * progress);
      const before = route.getPointAtLength(Math.max(0, length * progress - 2));
      const after = route.getPointAtLength(Math.min(length, length * progress + 2));
      const angle = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;

      return {
        transform: `translate(${(point.x / 1000) * bounds.width}px, ${(point.y / 420) * bounds.height}px) rotate(${angle + 22}deg)`,
        opacity: Math.min(1, progress * 6, (1 - progress) * 6),
      };
    });

    const routeAnimation = route.animate(
      [
        { strokeDashoffset: length, opacity: 0.2 },
        { strokeDashoffset: 0, opacity: 0.9 },
      ],
      { duration: 1050, easing: "ease-in-out", fill: "forwards" },
    );
    const planeAnimation = plane.animate(keyframes, {
      duration: 1050,
      easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      fill: "forwards",
    });
    const overlayAnimation = overlay.animate(
      [{ opacity: 0 }, { opacity: 1, offset: 0.12 }, { opacity: 1, offset: 0.82 }, { opacity: 0 }],
      { duration: 1250, easing: "ease-in-out", fill: "forwards" },
    );

    planeAnimation.onfinish = finish;
    return () => {
      planeAnimation.onfinish = null;
      planeAnimation.cancel();
      routeAnimation.cancel();
      overlayAnimation.cancel();
    };
  }, [direction]);

  return (
    <div ref={overlayRef} className="airplane-flight-overlay" popover="manual" aria-hidden="true">
      <svg
        className="airplane-flight-route"
        viewBox="0 0 1000 420"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path ref={routeRef} d={ROUTES[direction]} />
      </svg>
      <svg ref={planeRef} className="airplane-flight-plane" viewBox="0 0 32 32" focusable="false">
        <path d="M29 3 19 29l-5-11-11-5L29 3Z" />
        <path d="m14 18 7-7" />
      </svg>
    </div>
  );
}
