"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { asset } from "@/lib/assets";
import { storyPhotos } from "@/lib/wedding";
import { useReducedMotion } from "@/lib/motion";

type Direction = -1 | 1;

export function StorySlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const compassNeedleRef = useRef<SVGGElement>(null);
  const animationsRef = useRef<Animation[]>([]);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const photo = storyPhotos[activeIndex];
  const slideNumber = String(activeIndex + 1).padStart(2, "0");
  const totalSlides = String(storyPhotos.length).padStart(2, "0");

  const showPhoto = useCallback(
    (nextDirection: Direction, targetIndex?: number) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);

      const nextIndex =
        targetIndex ?? (activeIndex + nextDirection + storyPhotos.length) % storyPhotos.length;
      const stage = stageRef.current;
      const route = routeRef.current;
      const plane = planeRef.current;
      const compassNeedle = compassNeedleRef.current;

      if (
        reducedMotion ||
        !stage ||
        !route ||
        !plane ||
        typeof stage.animate !== "function" ||
        typeof route.animate !== "function" ||
        typeof plane.animate !== "function"
      ) {
        setActiveIndex(nextIndex);
        busyRef.current = false;
        setBusy(false);
        return;
      }

      const sign = nextDirection;
      const directionName = sign > 0 ? "next" : "previous";
      route.setAttribute(
        "d",
        directionName === "next"
          ? "M 36 150 C 235 15 765 15 964 150"
          : "M 964 150 C 765 15 235 15 36 150",
      );

      const bounds = stage.getBoundingClientRect();
      const pathLength = route.getTotalLength();
      const keyframes = Array.from({ length: 33 }, (_, index) => {
        const progress = index / 32;
        const point = route.getPointAtLength(pathLength * progress);
        const before = route.getPointAtLength(Math.max(0, pathLength * progress - 2));
        const after = route.getPointAtLength(Math.min(pathLength, pathLength * progress + 2));
        const angle = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
        const x = (point.x / 1000) * bounds.width - 12;
        const y = (point.y / 180) * bounds.height - 12;
        return {
          transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`,
          opacity: progress < 0.08 || progress > 0.92 ? 0 : 1,
        };
      });

      const outgoing = stage.animate(
        [
          { opacity: 1, transform: "translateX(0)" },
          { opacity: 0, transform: `translateX(${-sign * 5}%)` },
        ],
        { duration: 280, easing: "ease-in", fill: "forwards" },
      );
      const routeAnimation = route.animate([{ opacity: 0 }, { opacity: 0.72 }, { opacity: 0 }], {
        duration: 980,
        easing: "ease-in-out",
      });
      const flight = plane.animate(keyframes, {
        duration: 980,
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "forwards",
      });
      const compassAnimation = compassNeedle?.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: `rotate(${sign * 24}deg)` },
          { transform: "rotate(0deg)" },
        ],
        { duration: 720, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      );
      animationsRef.current.push(outgoing, routeAnimation, flight);
      if (compassAnimation) animationsRef.current.push(compassAnimation);

      outgoing.onfinish = () => {
        outgoing.cancel();
        setActiveIndex(nextIndex);
        requestAnimationFrame(() => {
          animationsRef.current.push(
            stage.animate(
              [
                { opacity: 0, transform: `translateX(${sign * 5}%)` },
                { opacity: 1, transform: "translateX(0)" },
              ],
              { duration: 560, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
            ),
          );
        });
      };

      flight.onfinish = () => {
        animationsRef.current.forEach((animation) => animation.cancel());
        animationsRef.current = [];
        busyRef.current = false;
        setBusy(false);
      };
    },
    [activeIndex, reducedMotion],
  );

  useEffect(
    () => () => {
      busyRef.current = false;
      animationsRef.current.forEach((animation) => animation.cancel());
    },
    [],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(-1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    showPhoto(deltaX < 0 ? 1 : -1);
  };

  return (
    <div className="story-slideshow-wrap">
      <div className="story-slideshow-heading">
        <p className="label eyebrow">Our memories</p>
        <h3 className="display story-slideshow-title">A journey in photographs</h3>
        <svg
          className="story-slideshow-compass"
          viewBox="0 0 36 36"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="18" cy="18" r="14" />
          <path d="M18 1v4m0 26v4M1 18h4m26 0h4" />
          <g ref={compassNeedleRef}>
            <path d="m18 7 4 11-4 11-4-11Z" />
            <path className="story-compass-north" d="m18 7 4 11h-4Z" />
          </g>
        </svg>
      </div>

      <div
        className="story-slideshow"
        role="group"
        aria-roledescription="carousel"
        aria-label="Photographs from Fritz and Princess's story"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div
          ref={stageRef}
          className="story-slide-stage"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            pointerStart.current = null;
          }}
        >
          <Image
            key={photo.src}
            src={asset(photo.src)}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 768px) calc(100vw - 2.5rem), 72rem"
            draggable={false}
            className="story-slide-image"
          />
          <svg
            className="story-flight-route"
            viewBox="0 0 1000 180"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path ref={routeRef} d="M 36 150 C 235 15 765 15 964 150" />
          </svg>
          <div className="story-flight-plane" ref={planeRef} aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M29 3 19 29l-5-11-11-5L29 3Z" />
              <path d="m14 18 7-7" />
            </svg>
          </div>
        </div>

        <div className="story-slide-caption" aria-live="polite" aria-atomic="true">
          <p className="display">{photo.caption}</p>
          <span className="label">
            {slideNumber} / {totalSlides}
          </span>
        </div>

        <div className="story-slide-controls">
          <button
            type="button"
            className="story-slide-arrow"
            aria-label="Previous photo"
            onClick={() => showPhoto(-1)}
            disabled={busy}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m15 5-7 7 7 7" />
            </svg>
            <span>Previous</span>
          </button>

          <div className="story-slide-dots" role="group" aria-label="Choose a photo">
            {storyPhotos.map((item, index) => (
              <button
                key={item.src}
                type="button"
                className="story-slide-dot"
                aria-label={`Show photo ${index + 1} of ${storyPhotos.length}: ${item.caption}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => showPhoto(index > activeIndex ? 1 : -1, index)}
                disabled={busy || index === activeIndex}
              />
            ))}
          </div>

          <button
            type="button"
            className="story-slide-arrow"
            aria-label="Next photo"
            onClick={() => showPhoto(1)}
            disabled={busy}
          >
            <span>Next</span>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <p className="story-slide-help">
          Swipe or drag the photo, use the buttons, or focus this slideshow and press the arrow
          keys.
        </p>
      </div>
    </div>
  );
}
