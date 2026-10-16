"use client";

import { useEffect, useRef } from "react";
import { clamp, useReducedMotion } from "@/lib/motion";

const JOURNEY_SECTION_IDS = [
  "welcome",
  "countdown",
  "calendar",
  "story",
  "entourage",
  "details",
  "reminders",
  "wishes",
  "gallery",
  "rsvp",
] as const;

const JOURNEY_STAGES: Record<(typeof JOURNEY_SECTION_IDS)[number], string> = {
  welcome: "BOARDING",
  countdown: "COUNTDOWN",
  calendar: "DEPARTURE",
  story: "SHARED JOURNEY",
  entourage: "TRAVELING TOGETHER",
  details: "DESTINATION",
  reminders: "TRAVEL NOTES",
  wishes: "BLESSINGS",
  gallery: "MEMORIES",
  rsvp: "ARRIVAL",
};

const ROUTE = "M 6 2 C 12 8 3 15 7 23 S 12 38 5 49 S 11 64 6 75 S 12 90 7 98";
const MOBILE_ROUTE = "M 94 12 C 88 17 96 23 92 29 S 88 42 95 50 S 89 64 94 73 S 88 85 92 90";

export function JourneyAtmosphere() {
  const scene = useRef<HTMLDivElement>(null);
  const route = useRef<SVGPathElement>(null);
  const plane = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const layer = scene.current;
    const path = route.current;
    const guide = layer?.querySelector<SVGPathElement>(".journey-route-guide");
    const aircraft = plane.current;
    const main = document.getElementById("main");
    const hero = document.getElementById("top");
    if (!layer || !path || !guide || !aircraft || !main || !hero) return;

    layer.dataset.reducedMotion = String(reducedMotion);
    const pausedAnimations = new Set<Animation>();
    const markers = new Map<string, SVGCircleElement>();
    layer.querySelectorAll<SVGCircleElement>(".journey-route-marker").forEach((marker) => {
      const sectionId = marker.dataset.section;
      if (sectionId) markers.set(sectionId, marker);
    });
    let activeRoute = "";
    let frame = 0;

    const update = () => {
      frame = 0;
      if (document.hidden) return;

      const routeData = window.matchMedia("(max-width: 767px)").matches ? MOBILE_ROUTE : ROUTE;
      if (activeRoute !== routeData) {
        activeRoute = routeData;
        path.setAttribute("d", routeData);
        guide.setAttribute("d", routeData);
      }

      const scrollY = window.scrollY;
      const heroBottom = hero.getBoundingClientRect().bottom + scrollY;
      const mainBottom = main.getBoundingClientRect().bottom + scrollY;
      const start = heroBottom;
      const journeyLength = Math.max(1, mainBottom - start);
      const pathLength = path.getTotalLength();
      const viewportCenter = window.innerHeight * 0.5;
      const progress = clamp((scrollY + viewportCenter - start) / journeyLength);
      const active = scrollY + window.innerHeight * 0.35 > heroBottom;
      layer.dataset.active = String(active);
      layer.style.setProperty("--journey-drift", `${Math.sin(progress * Math.PI) * 12}px`);

      const sections = JOURNEY_SECTION_IDS.flatMap((id) => {
        const section = main.querySelector<HTMLElement>(`section#${id}`);
        return section ? [{ id, section }] : [];
      });
      let currentStage = "BOARDING";
      let nearestDistance = Number.POSITIVE_INFINITY;
      let currentTone = "light";
      sections.forEach(({ id, section }) => {
        const bounds = section.getBoundingClientRect();
        const sectionProgress = clamp(
          (bounds.top + scrollY + bounds.height * 0.5 - start) / journeyLength,
        );
        const marker = markers.get(id);
        if (marker) {
          const markerPoint = path.getPointAtLength(pathLength * sectionProgress);
          marker.setAttribute("cx", String(markerPoint.x));
          marker.setAttribute("cy", String(markerPoint.y));
        }

        const distance =
          viewportCenter < bounds.top
            ? bounds.top - viewportCenter
            : viewportCenter > bounds.bottom
              ? viewportCenter - bounds.bottom
              : 0;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          currentStage = JOURNEY_STAGES[id];
          currentTone = section.classList.contains("tone-light") ? "light" : "dark";
        }
      });
      layer.dataset.stage = currentStage;
      layer.dataset.tone = currentTone;

      if (reducedMotion) return;

      const point = path.getPointAtLength(pathLength * progress);
      const before = path.getPointAtLength(Math.max(0, pathLength * progress - 0.2));
      const after = path.getPointAtLength(Math.min(pathLength, pathLength * progress + 0.2));
      const bounds = path.ownerSVGElement?.getBoundingClientRect();
      const angle = bounds
        ? (Math.atan2(
            ((after.y - before.y) * bounds.height) / 100,
            ((after.x - before.x) * bounds.width) / 100,
          ) *
            180) /
          Math.PI
        : 0;
      aircraft.style.setProperty("--plane-x", `${point.x}%`);
      aircraft.style.setProperty("--plane-y", `${point.y}%`);
      aircraft.style.setProperty("--plane-angle", `${angle}deg`);
    };

    const scheduleUpdate = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(update);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        document.documentElement.dataset.pageHidden = "true";
        document.getAnimations().forEach((animation) => {
          if (animation.playState !== "running") return;
          pausedAnimations.add(animation);
          animation.pause();
        });
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        return;
      }

      delete document.documentElement.dataset.pageHidden;
      pausedAnimations.forEach((animation) => {
        if (animation.playState === "paused") animation.play();
      });
      pausedAnimations.clear();
      scheduleUpdate();
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (frame) cancelAnimationFrame(frame);
      if (document.documentElement.dataset.pageHidden === "true") {
        delete document.documentElement.dataset.pageHidden;
        pausedAnimations.forEach((animation) => {
          if (animation.playState === "paused") animation.play();
        });
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={scene}
      className="journey-atmosphere"
      aria-hidden="true"
      data-active="false"
      data-tone="light"
    >
      <span className="journey-atmosphere-globe" />
      <svg className="journey-atmosphere-route" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="journey-route-guide" d={ROUTE} />
        <path ref={route} className="journey-route-glow" d={ROUTE} />
        {JOURNEY_SECTION_IDS.map((sectionId) => (
          <circle
            key={sectionId}
            className="journey-route-marker"
            data-section={sectionId}
            cx="7"
            cy="2"
            r="0.65"
          />
        ))}
      </svg>
      <span ref={plane} className="journey-atmosphere-plane">
        <svg viewBox="0 0 32 32" focusable="false">
          <path d="M29 3 19 29l-5-11-11-5L29 3Z" />
          <path d="m14 18 7-7" />
        </svg>
      </span>
    </div>
  );
}
