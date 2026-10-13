"use client";

import { useGuestName } from "@/lib/use-guest-name";
import { couple } from "@/lib/wedding";
import { scrollToId } from "@/lib/scroll";
import { Reveal } from "./Reveal";
import { HeartPin } from "../hero/HeartPin";

export function PersonalizedGreeting() {
  const guest = useGuestName();
  return (
    <section
      id="welcome"
      tabIndex={-1}
      aria-labelledby="welcome-title"
      className="tone-light px-5 py-24 md:py-32"
    >
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="label eyebrow mb-6">You are invited</p>
        <h2 id="welcome-title" className="display text-4xl md:text-6xl">
          {guest ? `Dear ${guest},` : "Dear family and friends,"}
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg">
          With full hearts, we invite you to celebrate the beginning of our lifelong journey
          together.
        </p>
        <HeartPin className="mx-auto my-8 h-6 w-44 text-burgundy-700" />
        <p className="display text-3xl uppercase md:text-4xl">{couple.names}</p>
        <p className="label mt-5 text-burgundy-700">{couple.dateLong}</p>
        <p className="muted mt-2">{couple.location}</p>
        <button type="button" className="btn mt-10" onClick={() => scrollToId("story")}>
          Read our story
        </button>
      </Reveal>
    </section>
  );
}
