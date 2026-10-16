"use client";

import { useEffect, useRef } from "react";
import { clamp, useMediaQuery, useReducedMotion } from "@/lib/motion";
import { useGuestName } from "@/lib/use-guest-name";
import { couple } from "@/lib/wedding";
import { scrollToId } from "@/lib/scroll";
import { AnimatedGlobe } from "./AnimatedGlobe";
import { AnimatedCompass } from "./AnimatedCompass";
import { TravelRoute } from "./TravelRoute";
import { FlyingAirplane } from "./FlyingAirplane";
import { HeartPin } from "./HeartPin";

const START_PROGRESS = 0.08;
const REDUCED_PROGRESS = 0.55;

const scenes = {
  landscape: {
    viewBox: "0 0 1200 800",
    globe: { cx: 930, cy: 290, r: 170 },
    compass: { cx: 250, cy: 570, r: 125 },
    route: "M255 575C330 770 790 780 905 580S1010 380 935 295",
    start: { x: 255, y: 575 },
    plane: 1.5,
  },
  portrait: {
    viewBox: "0 0 450 900",
    globe: { cx: 335, cy: 170, r: 95 },
    compass: { cx: 98, cy: 175, r: 50 },
    route: "M110 150C170 40 290 30 330 150",
    start: { x: 110, y: 150 },
    plane: 1.1,
  },
};

export function WeddingHero() {
  const heroRef = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  const portrait = useMediaQuery("(max-aspect-ratio: 9/10)");
  const guest = useGuestName();
  const scene = portrait ? scenes.portrait : scenes.landscape;

  useEffect(() => {
    const hero = heroRef.current;
    const route = routeRef.current;
    const plane = planeRef.current;
    if (!hero || !route || !plane) return;
    const total = route.getTotalLength();

    const place = (progress: number, routeOpacity = progress) => {
      const at = total * progress;
      const pt = route.getPointAtLength(at);
      const ahead = route.getPointAtLength(Math.min(total, at + 2));
      const behind = route.getPointAtLength(Math.max(0, at - 2));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      route.style.opacity = routeOpacity.toFixed(3);
      plane.setAttribute(
        "transform",
        `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${angle.toFixed(2)}) scale(${scene.plane})`,
      );
    };

    const setParallax = (progress: number) => {
      hero.style.setProperty("--layer-bg-y", `${progress * 30}px`);
      hero.style.setProperty("--layer-globe-x", `${progress * -14}px`);
      hero.style.setProperty("--layer-globe-y", `${progress * -50}px`);
      hero.style.setProperty("--layer-globe-rotation", `${progress * 10}deg`);
      hero.style.setProperty("--layer-compass-y", `${progress * -95}px`);
      hero.style.setProperty("--layer-compass-rotation", `${progress * 55}deg`);
      hero.style.setProperty("--layer-route-y", `${progress * -16}px`);
    };

    if (reduced) {
      setParallax(0);
      place(REDUCED_PROGRESS, 1);
      return;
    }

    const fade = plane.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 1800,
      delay: 700,
      easing: "ease-out",
      fill: "backwards",
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const raw = clamp(window.scrollY / (hero.offsetHeight * 0.85));
      setParallax(raw);
      place(START_PROGRESS + (1 - START_PROGRESS) * raw, raw);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      fade.cancel();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced, scene]);

  return (
    <section ref={heroRef} id="top" tabIndex={-1} className="hero" aria-labelledby="hero-title">
      <svg
        className="hero-scene"
        viewBox={scene.viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        {/* Layer 1: atmosphere */}
        <g className="layer-bg" fill="none" stroke="#bdbfc4">
          <circle cx="600" cy="400" r="330" strokeWidth="0.6" opacity="0.1" />
          <circle cx="600" cy="400" r="470" strokeWidth="0.6" opacity="0.07" />
          <circle cx="600" cy="400" r="610" strokeWidth="0.6" opacity="0.05" />
          {[
            [120, 120],
            [310, 70],
            [520, 160],
            [700, 60],
            [1090, 110],
            [1130, 470],
            [90, 380],
            [980, 700],
            [430, 740],
          ].map(([x, y]) => (
            <circle
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              r="1.2"
              fill="#bdbfc4"
              stroke="none"
              opacity="0.4"
            />
          ))}
        </g>
        {/* Layer 2: globe and compass at different depths */}
        <AnimatedGlobe {...scene.globe} />
        <AnimatedCompass {...scene.compass} />
        {/* Layer 3: route and airplane */}
        <g className="layer-route">
          <TravelRoute ref={routeRef} d={scene.route} />
          <FlyingAirplane ref={planeRef} x={scene.start.x} y={scene.start.y} scale={scene.plane} />
        </g>
      </svg>

      <div className="hero-content">
        <p className="hero-monogram enter" aria-hidden="true">
          F<span>&amp;</span>P
        </p>
        <h1
          id="hero-title"
          className="display hero-title enter"
          style={{ "--d": "450ms" } as React.CSSProperties}
        >
          Fritz <span className="amp">&amp;</span> Princess
        </h1>
        <p className="label wedding-label enter" style={{ "--d": "700ms" } as React.CSSProperties}>
          <span>Wedding</span>
        </p>
        <HeartPin className="enter mt-3 h-6 w-44 text-silver-300" />
        <p
          className="enter mt-3 text-base tracking-[0.18em] text-silver-200 uppercase"
          style={{ "--d": "900ms" } as React.CSSProperties}
        >
          {couple.date} · {couple.location}
        </p>
        <p
          className="enter mt-3 min-h-8 text-lg text-silver-200"
          style={{ "--d": "1000ms" } as React.CSSProperties}
        >
          {guest ? (
            <>
              An invitation for{" "}
              <span className="display text-xl text-warm-white italic">{guest}</span>
            </>
          ) : null}
        </p>
        <nav className="hero-quick-links enter" aria-label="Wedding quick links">
          {[
            { id: "countdown", label: "Countdown" },
            { id: "calendar", label: "Wedding Calendar" },
            { id: "rsvp", label: "RSVP" },
          ].map((link) => (
            <a
              key={link.id}
              className="hero-quick-link"
              href={`#${link.id}`}
              onClick={(event) => {
                event.preventDefault();
                scrollToId(link.id);
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="scroll-prompt enter mt-5">
          <span className="label">Please scroll down</span>
          <svg
            className="scroll-prompt-arrow"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 3v16m-7-7 7 7 7-7" />
          </svg>
        </p>
      </div>
    </section>
  );
}
