"use client";

import { useEffect, useState } from "react";
import { Section } from "./Section";
import { BoardingSoon } from "./BoardingSoon";

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const weddingStart = () => new Date(2027, 3, 23, 0, 0, 0, 0).getTime();

function getCountdown(now: number): CountdownParts | null {
  const target = weddingStart();
  const remaining = target - now;
  if (remaining <= 0) return null;

  const seconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3_600),
    minutes: Math.floor((seconds % 3_600) / 60),
    seconds: seconds % 60,
  };
}

const format = (value: number) => String(value).padStart(2, "0");

export function WeddingCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = now === null ? null : getCountdown(now);
  const completed = now !== null && countdown === null;
  const values: Array<[keyof CountdownParts, string]> = [
    ["days", "Days"],
    ["hours", "Hours"],
    ["minutes", "Minutes"],
    ["seconds", "Seconds"],
  ];

  return (
    <Section
      id="countdown"
      tone="dark"
      eyebrow="Our wedding day"
      title="The days until forever"
      intro="April 23, 2027 · Antipolo, Rizal"
    >
      {completed ? (
        <p className="display countdown-today" role="status">
          Today is the day!
        </p>
      ) : (
        <dl className="countdown-grid" aria-label="Countdown to April 23, 2027">
          {values.map(([key, label]) => (
            <div
              key={key}
              className={`countdown-unit${key === "seconds" ? " countdown-unit-seconds" : ""}`}
            >
              <dt className="label">{label}</dt>
              <dd className="countdown-value">
                <time aria-label={countdown ? `${countdown[key]} ${label}` : "Loading"}>
                  {countdown ? format(countdown[key]) : "--"}
                </time>
              </dd>
            </div>
          ))}
        </dl>
      )}
      <BoardingSoon />
    </Section>
  );
}
