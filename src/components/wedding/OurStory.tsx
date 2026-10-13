"use client";

import { useRef } from "react";
import { useScrollLinkedProgress } from "@/lib/motion";
import { storyMoments } from "@/lib/wedding";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { StorySlideshow } from "./StorySlideshow";

export function OurStory() {
  const railRef = useRef<HTMLOListElement>(null);
  useScrollLinkedProgress(railRef);

  return (
    <Section
      id="story"
      tone="dark"
      eyebrow="Our story"
      title="From rumor to forever"
      intro="A childhood rumor, a journey across the miles, and a promise for a lifetime."
    >
      <ol ref={railRef} className="story-journey m-0 list-none p-0">
        {storyMoments.map((moment, index) => (
          <li key={moment.label} className="story-moment">
            <span className="story-marker" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Reveal delay={index * 55} className="story-moment-content">
              <div className="story-moment-heading">
                <p className="label eyebrow">{moment.label}</p>
                <h3 className="display story-moment-title">{moment.title}</h3>
                {moment.date ? <p className="story-date">{moment.date}</p> : null}
              </div>
              <div className="story-paragraphs">
                {moment.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className={
                      paragraph.includes("Gago ka!")
                        ? "story-paragraph story-gago-moment"
                        : "story-paragraph"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="story-ending">
        <svg
          className="story-ending-route"
          viewBox="0 0 180 34"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M2 26C38 3 60 32 91 15S139 3 178 15" />
          <path d="m166 10 12 5-10 8" />
        </svg>
        <p className="display story-ending-line story-ending-first">
          The self-proclaimed crush finally got her husband!
        </p>
        <p className="display story-ending-line story-ending-second">
          Fritz and Princess—soon to be Mr. &amp; Mrs. Empleo!
        </p>
      </Reveal>
      <StorySlideshow />
    </Section>
  );
}
