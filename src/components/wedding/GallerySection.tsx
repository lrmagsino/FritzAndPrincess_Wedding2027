"use client";

import { useRef, useState } from "react";
import { gallery } from "@/lib/wedding";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { GalleryArt } from "./GalleryArt";

export function GallerySection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  const item = gallery[active];

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setActive((i) => (i + delta + gallery.length) % gallery.length);

  return (
    <Section
      id="gallery"
      tone="light"
      eyebrow="Gallery"
      title="Moments along the way"
      intro="Photographs will be added as we collect them. Illustrated placeholders hold the places for now."
    >
      <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 md:gap-6">
        {gallery.map((g, i) => (
          <li key={g.id}>
            <Reveal delay={(i % 3) * 70}>
              <button
                type="button"
                className="tile"
                onClick={() => open(i)}
                aria-label={`${g.title}. ${g.description} Open larger view.`}
              >
                <GalleryArt art={g.art} />
                <span className="tile-caption" aria-hidden="true">
                  <span className="display text-xl">{g.title}</span>
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-labelledby="lightbox-title"
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="aspect-[4/5] w-full overflow-hidden border border-silver-400/30">
          <GalleryArt art={item.art} />
        </div>
        <h3 id="lightbox-title" className="display mt-4 text-2xl">
          {item.title}
        </h3>
        <p className="mt-1 text-silver-300">{item.description}</p>
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <div className="flex gap-3">
            <button type="button" className="btn px-4" onClick={() => step(-1)}>
              Previous
            </button>
            <button type="button" className="btn px-4" onClick={() => step(1)}>
              Next
            </button>
          </div>
          <button
            type="button"
            className="btn btn-solid px-4"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </Section>
  );
}
