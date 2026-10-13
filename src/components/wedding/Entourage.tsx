"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { entourage } from "@/lib/wedding";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { AirplaneFlightOverlay } from "./AirplaneFlightOverlay";
import { useReducedMotion } from "@/lib/motion";

type EntourageCategoryData = (typeof entourage)[number];
type EntourageGroupData = EntourageCategoryData["groups"][number];

function EntourageGroup({ group }: { group: EntourageGroupData }) {
  return (
    <div className={`entourage-group${group.title ? " entourage-group-titled" : ""}`}>
      {group.title ? <h4 className="label entourage-subtitle">{group.title}</h4> : null}
      <ul className="entourage-list">
        {group.members.map((member, index) => (
          <li
            key={`${member.role ?? "member"}-${member.name}-${index}`}
            className={`entourage-person${member.role ? " entourage-person-with-role" : ""}`}
          >
            {member.role ? <span className="label entourage-role">{member.role}</span> : null}
            <span className="entourage-name">{member.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EntourageCategory({ category }: { category: EntourageCategoryData }) {
  return (
    <article className={`entourage-card entourage-card-${category.id}`}>
      <header className="entourage-card-heading">
        <span className="entourage-heading-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z" />
          </svg>
        </span>
        <h3 className="display">{category.title}</h3>
        <span className="entourage-heading-rule" aria-hidden="true" />
      </header>
      <div className="entourage-groups">
        {category.groups.map((group) => (
          <EntourageGroup key={`${category.id}-${group.title || category.id}`} group={group} />
        ))}
      </div>
    </article>
  );
}

export function Entourage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const [flight, setFlight] = useState<{
    direction: "forward" | "reverse";
    action: "open" | "close";
  } | null>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const categoryFrame = useRef<HTMLDivElement>(null);
  const categoryCard = useRef<HTMLDivElement>(null);
  const categoryBusy = useRef(false);
  const reducedMotion = useReducedMotion();
  const category = entourage[activeCategory];

  const finishFlight = () => {
    const action = flight?.action;
    setFlight(null);
    if (action === "open") {
      setIsOpen(true);
      requestAnimationFrame(() => closeButton.current?.focus());
    } else if (action === "close") {
      setIsOpen(false);
      requestAnimationFrame(() => openButton.current?.focus());
    }
  };

  const openList = () => {
    if (flight || isOpen) return;
    setFlight({ direction: "forward", action: "open" });
  };

  const closeList = () => {
    if (flight || !isOpen) return;
    setFlight({ direction: "reverse", action: "close" });
  };

  const showCategory = (index: number) => {
    if (categoryBusy.current || index === activeCategory || index < 0 || index >= entourage.length)
      return;

    categoryBusy.current = true;
    setIsChangingCategory(true);
    const frame = categoryFrame.current;
    const card = categoryCard.current;
    if (reducedMotion || !card || typeof card.animate !== "function") {
      setActiveCategory(index);
      categoryBusy.current = false;
      setIsChangingCategory(false);
      return;
    }

    const direction = index > activeCategory ? 1 : -1;
    const slideDistance = 3.5;
    const startHeight = frame?.getBoundingClientRect().height;
    if (frame && startHeight !== undefined) frame.style.height = `${startHeight}px`;
    const exit = card.animate(
      [
        { opacity: 1, transform: "translateX(0)" },
        { opacity: 0, transform: `translateX(${-direction * slideDistance}rem)` },
      ],
      { duration: 240, easing: "ease-in", fill: "forwards" },
    );
    exit.onfinish = () => {
      exit.cancel();
      setActiveCategory(index);
      requestAnimationFrame(() => {
        const nextCard = categoryCard.current;
        if (frame) frame.style.height = "auto";
        const nextHeight = nextCard?.getBoundingClientRect().height;
        if (frame && startHeight !== undefined) frame.style.height = `${startHeight}px`;
        const resize =
          frame && startHeight !== undefined && nextHeight !== undefined
            ? frame.animate([{ height: `${startHeight}px` }, { height: `${nextHeight}px` }], {
                duration: 360,
                easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
                fill: "forwards",
              })
            : null;
        let pendingAnimations = resize ? 1 : 0;
        const finishResize = () => {
          if (frame) frame.style.height = "auto";
          resize?.cancel();
          categoryBusy.current = false;
          setIsChangingCategory(false);
        };
        const finishAnimation = () => {
          pendingAnimations -= 1;
          if (pendingAnimations === 0) finishResize();
        };
        if (resize) resize.onfinish = finishAnimation;

        if (!nextCard || typeof nextCard.animate !== "function") {
          if (!resize) finishResize();
          return;
        }
        const enter = nextCard.animate(
          [
            { opacity: 0, transform: `translateX(${direction * slideDistance}rem)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 360, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
        );
        pendingAnimations += 1;
        enter.onfinish = () => {
          enter.cancel();
          finishAnimation();
        };
      });
    };
  };

  const handleCategoryKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" && activeCategory < entourage.length - 1) {
      event.preventDefault();
      showCategory(activeCategory + 1);
    } else if (event.key === "ArrowLeft" && activeCategory > 0) {
      event.preventDefault();
      showCategory(activeCategory - 1);
    }
  };

  return (
    <Section
      id="entourage"
      tone="dark"
      eyebrow="Entourage"
      title="The people beside us"
      intro="With love and gratitude, we honor the family and friends who will stand beside us."
    >
      <div className="entourage-folder">
        <button
          ref={openButton}
          type="button"
          className="entourage-folder-cover"
          aria-expanded={isOpen}
          aria-controls="entourage-listing"
          onClick={openList}
          disabled={Boolean(flight) || isOpen}
        >
          <span className="entourage-folder-art" aria-hidden="true">
            <svg viewBox="0 0 200 140" focusable="false">
              <path d="M22 40h54l12 13h90v62H22z" />
              <path d="M22 52h156l-12 53H22z" />
              <path className="entourage-folder-route" d="M48 82c18-24 36 21 55-2s31-10 48-5" />
              <path className="entourage-folder-plane" d="m150 67 17 8-17 8 4-8z" />
              <rect x="91" y="71" width="20" height="17" rx="2" />
              <path d="M96 71v-5a5 5 0 0 1 10 0v5" />
            </svg>
          </span>
          <span className="label entourage-folder-kicker">A place for our favorite people</span>
          <span className="display entourage-folder-title">The Wedding Entourage</span>
          <span className="entourage-folder-instruction">
            {flight?.action === "open"
              ? "Opening your invitation…"
              : "Open this to see the list of entourage"}
          </span>
          <span className="entourage-folder-action">Unlock the list</span>
        </button>

        <div id="entourage-listing" className="entourage-listing" hidden={!isOpen}>
          <div className="entourage-listing-topline">
            <p className="label">With gratitude, we introduce</p>
            <button
              ref={closeButton}
              type="button"
              className="entourage-close"
              onClick={closeList}
              disabled={Boolean(flight)}
            >
              <span aria-hidden="true">×</span>
              Close the list
            </button>
          </div>
          <div
            className="entourage-carousel"
            role="group"
            aria-roledescription="carousel"
            aria-label="Wedding entourage categories"
            onKeyDown={handleCategoryKeys}
          >
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {category.title}, category {activeCategory + 1} of {entourage.length}
            </p>
            <div ref={categoryFrame} className="entourage-slide-frame">
              <Reveal delay={0} className="entourage-reveal">
                <div
                  ref={categoryCard}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${category.title}, ${activeCategory + 1} of ${entourage.length}`}
                >
                  <EntourageCategory category={category} />
                </div>
              </Reveal>
            </div>

            <div className="entourage-carousel-controls">
              <button
                type="button"
                className="entourage-step-button"
                onClick={() => showCategory(activeCategory - 1)}
                disabled={activeCategory === 0 || isChangingCategory}
                aria-label="Previous entourage category"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m15 5-7 7 7 7" />
                </svg>
                <span>Previous</span>
              </button>
              <span className="label entourage-step-count">
                {String(activeCategory + 1).padStart(2, "0")} /{" "}
                {String(entourage.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                className="entourage-step-button"
                onClick={() => showCategory(activeCategory + 1)}
                disabled={activeCategory === entourage.length - 1 || isChangingCategory}
                aria-label="Next entourage category"
              >
                <span>Next</span>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m9 5 7 7-7 7" />
                </svg>
              </button>
            </div>
            <div
              className="entourage-pagination"
              role="group"
              aria-label="Choose entourage category"
            >
              {entourage.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className="entourage-pagination-dot"
                  aria-label={`Show ${item.title}`}
                  aria-current={index === activeCategory ? "true" : undefined}
                  disabled={isChangingCategory || index === activeCategory}
                  onClick={() => showCategory(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {flight ? (
        <AirplaneFlightOverlay direction={flight.direction} onComplete={() => finishFlight()} />
      ) : null}
    </Section>
  );
}
