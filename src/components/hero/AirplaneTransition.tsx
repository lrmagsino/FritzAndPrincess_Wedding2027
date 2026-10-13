"use client";

import { useEffect, useRef } from "react";

const ROUTE = "M 100 490 C 315 565 300 160 545 300 S 770 410 920 105";
const FLIGHT_DURATION = 2000;

interface AirplaneTransitionProps {
  onComplete: () => void;
}

export function AirplaneTransition({ onComplete }: AirplaneTransitionProps) {
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const route = routeRef.current;
    const plane = planeRef.current;
    if (!route || !plane) return;

    const length = route.getTotalLength();

    const keyframes = Array.from({ length: 49 }, (_, index) => {
      const progress = index / 48;
      const point = route.getPointAtLength(length * progress);
      const next = route.getPointAtLength(Math.min(length, length * progress + 2));
      const previous = route.getPointAtLength(Math.max(0, length * progress - 2));
      const angle = (Math.atan2(next.y - previous.y, next.x - previous.x) * 180) / Math.PI;

      return {
        transform: `translate(${point.x}px, ${point.y}px) rotate(${angle}deg) scale(1.25)`,
        opacity: Math.min(1, progress * 5),
      };
    });

    const flight = plane.animate(keyframes, {
      duration: FLIGHT_DURATION,
      easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      fill: "forwards",
    });
    const routeReveal = route.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: FLIGHT_DURATION,
      easing: "linear",
      fill: "forwards",
    });
    flight.onfinish = onComplete;

    return () => {
      flight.onfinish = null;
      flight.cancel();
      routeReveal.cancel();
    };
  }, [onComplete]);

  return (
    <svg
      className="airplane-transition"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path ref={routeRef} d={ROUTE} fill="none" stroke="#bdbfc4" strokeWidth="1.5" />
      <g ref={planeRef} className="transition-plane" opacity="0">
        <path
          d="M22 0c0-2-2-3-4-3H4L-8-18h-5l6 15h-10l-4-6h-3l3 9-3 9h3l4-6h10l-6 15h5L4 3h14c2 0 4-1 4-3Z"
          fill="#f4ede3"
        />
        <path d="M-18 0H14" stroke="#a3304a" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}
