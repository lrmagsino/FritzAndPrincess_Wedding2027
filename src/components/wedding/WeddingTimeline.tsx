"use client";

import { useCallback, useEffect, useRef } from "react";
import { Fragment } from "react";
import { timeline } from "@/lib/wedding";
import { useReducedMotion, useScrollLinkedProgress } from "@/lib/motion";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

function TimelineIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    arrival: (
      <>
        <path d="M24 43s14-13.2 14-25a14 14 0 1 0-28 0c0 11.8 14 25 14 25Z" />
        <circle cx="24" cy="18" r="4" />
      </>
    ),
    ceremony: (
      <>
        <path d="M8 40h32M12 40V20l12-8 12 8v20M20 40V27h8v13M24 6v8m-4-4h8" />
      </>
    ),
    photo: (
      <>
        <path d="M7 15h8l3-5h12l3 5h8v25H7z" />
        <circle cx="24" cy="27" r="7" />
      </>
    ),
    travel: (
      <>
        <path d="m5 26 16-4 7-15c1-2 4-1 4 1l-3 13 11 5c2 1 1 4-1 4l-12-2-6 11c-1 2-4 1-4-1l2-12-13 4c-2 1-3-3-1-4Z" />
      </>
    ),
    cocktail: (
      <>
        <path d="M10 10h28L24 27 10 10Zm14 17v12m-8 0h16M16 8l2 4m10-5 2 5" />
      </>
    ),
    reception: (
      <>
        <path d="M18 8v18a8 8 0 0 0 16 0V8M10 8v8a8 8 0 0 0 8 8m16-8a8 8 0 0 0 8-8M22 42h8" />
      </>
    ),
    dinner: (
      <>
        <path d="M12 8v13m-4-13v8a4 4 0 0 0 8 0V8m-4 13v21m22-34v34m0-34c-6 5-8 13-8 21h8" />
      </>
    ),
    toasts: (
      <>
        <path d="M16 7v16a8 8 0 0 0 16 0V7m-8 24v11m-8 0h16M12 11h24" />
        <path d="m18 10 4 4m8-4-4 4" />
      </>
    ),
    dance: (
      <>
        <path d="M24 42 8 27a10 10 0 0 1 15-13l1 2 1-2a10 10 0 0 1 15 13L24 42Z" />
        <path d="M24 16v15m0 0 8-4V12m-8 19 8-4m-8 4v3" />
      </>
    ),
    "dance-floor": (
      <>
        <path d="M28 8v23a6 6 0 1 1-4-5.7V14l16-4v17a6 6 0 1 1-4-5.7V6l-8 2Z" />
      </>
    ),
    thanks: (
      <>
        <path d="M24 42 8 27a10 10 0 0 1 15-13l1 2 1-2a10 10 0 0 1 15 13L24 42Z" />
        <path d="M18 25h12m-6-6v12" />
      </>
    ),
    farewell: (
      <>
        <path d="M35 31a15 15 0 1 1-17-20 12 12 0 0 0 17 20Z" />
        <path d="m34 8 1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4Zm-16 18a6 6 0 0 0 9 5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {paths[name] ?? paths.arrival}
    </svg>
  );
}

function TimelineFlight() {
  const routeRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const frameRef = useRef<number | null>(null);
  const started = useRef(false);
  const reducedMotion = useReducedMotion();

  const startFlight = useCallback(() => {
    const route = routeRef.current;
    const path = pathRef.current;
    const plane = planeRef.current;
    if (
      !route ||
      !path ||
      !plane ||
      started.current ||
      reducedMotion ||
      typeof path.getPointAtLength !== "function"
    )
      return;

    started.current = true;
    const length = path.getTotalLength();
    const duration = 3200;
    let startTime: number | undefined;
    const fly = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = progress * progress * (3 - 2 * progress);
      const distance = length * eased;
      const point = path.getPointAtLength(distance);
      const previousPoint = path.getPointAtLength(Math.max(distance - 0.5, 0));
      const nextPoint = path.getPointAtLength(Math.min(distance + 0.5, length));
      const tangentStart = progress < 1 ? point : previousPoint;
      const tangentEnd = progress < 1 ? nextPoint : point;
      const angle =
        (Math.atan2(tangentEnd.y - tangentStart.y, tangentEnd.x - tangentStart.x) * 180) / Math.PI;
      plane.setAttribute("transform", `translate(${point.x} ${point.y}) rotate(${angle})`);
      if (progress < 1) frameRef.current = requestAnimationFrame(fly);
    };
    frameRef.current = requestAnimationFrame(fly);
  }, [reducedMotion]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return (
    <li className="timeline-flight" aria-hidden="true">
      <Reveal delay={0} className="timeline-flight-reveal" onReveal={startFlight}>
        <span className="timeline-flight-icon">
          <svg ref={routeRef} viewBox="0 0 48 36" focusable="false">
            <path ref={pathRef} className="timeline-flight-route" d="M2 29C12 4 27 34 46 7" />
            <g
              ref={planeRef}
              className="timeline-flight-plane"
              transform="translate(23 18) rotate(-35)"
            >
              <path d="m-5-2 10 2-10 2 2-2z" />
            </g>
          </svg>
        </span>
      </Reveal>
    </li>
  );
}

export function WeddingTimeline({ embedded = false }: { embedded?: boolean }) {
  const railRef = useRef<HTMLOListElement>(null);
  useScrollLinkedProgress(railRef);
  const TimelineTitle = embedded ? "h4" : "h3";

  const timelineItems = (
    <ol ref={railRef} className="rail wedding-timeline">
      {timeline.map((item, index) => (
        <Fragment key={item.title}>
          <li className={`timeline-item${item.highlight ? " timeline-item-highlight" : ""}`}>
            <time className="label timeline-time" dateTime={item.dateTime}>
              {item.time}
            </time>
            <span className="timeline-marker" aria-hidden="true">
              <TimelineIcon name={item.icon} />
            </span>
            <Reveal delay={Math.min(index * 40, 360)} className="timeline-item-content">
              <TimelineTitle className="display timeline-title">{item.title}</TimelineTitle>
            </Reveal>
          </li>
          {index === 2 ? <TimelineFlight key="ceremony-to-reception-flight" /> : null}
        </Fragment>
      ))}
    </ol>
  );

  if (embedded) {
    return (
      <div
        id="timeline"
        className="timeline-embedded"
        tabIndex={-1}
        role="region"
        aria-labelledby="timeline-title"
      >
        <h3 id="timeline-title" className="display timeline-embedded-title">
          The day, in order
        </h3>
        <p className="muted timeline-embedded-intro">
          A day filled with love, laughter, memories, and celebrations. Here is how we will journey
          through our wedding day together.
        </p>
        {timelineItems}
      </div>
    );
  }

  return (
    <Section
      id="timeline"
      tone="light"
      eyebrow="Timeline"
      title="The day, in order"
      intro="A day filled with love, laughter, memories, and celebrations. Here is how we will journey through our wedding day together."
      narrow
    >
      {timelineItems}
    </Section>
  );
}
