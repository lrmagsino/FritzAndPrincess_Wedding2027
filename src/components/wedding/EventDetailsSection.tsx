"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { weddingEvents } from "@/lib/wedding";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { AirplaneFlightOverlay } from "./AirplaneFlightOverlay";
import { WeddingTimeline } from "./WeddingTimeline";

type WeddingEvent = (typeof weddingEvents)[number];

function getValidMapUrl(value: string) {
  const mapUrl = value.trim();
  if (!mapUrl) return null;

  try {
    const parsed = new URL(mapUrl);
    return parsed.protocol === "https:" &&
      (parsed.hostname === "google.com" ||
        parsed.hostname.endsWith(".google.com") ||
        parsed.hostname === "maps.app.goo.gl")
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}

function EventImage({ event, large = false }: { event: WeddingEvent; large?: boolean }) {
  return (
    <div className={`event-image${large ? " event-image-large" : ""}`}>
      {event.imageSrc ? (
        <Image
          src={asset(event.imageSrc)}
          alt={event.imageAlt}
          width={1200}
          height={800}
          sizes={large ? "(max-width: 768px) 100vw, 48rem" : "(max-width: 768px) 100vw, 50vw"}
        />
      ) : (
        <div className="event-image-placeholder" role="img" aria-label={event.imageAlt}>
          <svg viewBox="0 0 240 160" aria-hidden="true" focusable="false">
            <rect x="28" y="25" width="184" height="110" rx="2" />
            <circle cx="120" cy="79" r="23" />
            <path d="M104 79h32m-16-16v32M50 114l38-34 24 20 18-15 60 43" />
            <path d="M62 47h30" />
          </svg>
          <span className="label">Photo to be added</span>
        </div>
      )}
      {!large ? (
        <span className="event-image-pin" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}

function EventDetailsModal({
  event,
  dialogRef,
  onRequestClose,
  onClosed,
}: {
  event: WeddingEvent;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onRequestClose: () => void;
  onClosed: () => void;
}) {
  const validMapUrl = getValidMapUrl(event.mapUrl);

  return (
    <dialog
      ref={dialogRef}
      className="event-dialog"
      aria-labelledby="event-dialog-title"
      data-lenis-prevent
      onClose={onClosed}
      onCancel={(keyboardEvent) => {
        keyboardEvent.preventDefault();
        onRequestClose();
      }}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Escape") {
          keyboardEvent.preventDefault();
          onRequestClose();
        }
      }}
      onClick={(eventClick) => {
        if (eventClick.target === dialogRef.current) onRequestClose();
      }}
    >
      <div className="event-dialog-inner">
        <EventImage event={event} large />
        <div className="event-dialog-content">
          <p className="label eyebrow">Wedding day · {event.title}</p>
          <h3 id="event-dialog-title" className="display" tabIndex={-1}>
            {event.title}
          </h3>
          <p className="event-dialog-description">{event.description}</p>
          <dl className="event-facts">
            <div>
              <dt>Venue</dt>
              <dd>{event.venue}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{event.address}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{event.location}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{event.date}</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>{event.time}</dd>
            </div>
            <div>
              <dt>Additional notes</dt>
              <dd>{event.notes}</dd>
            </div>
          </dl>
          <div className="event-dialog-actions">
            {validMapUrl ? (
              <a
                className="btn btn-solid"
                href={validMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${event.title} location in Google Maps (opens in a new tab)`}
              >
                Open in Google Maps
              </a>
            ) : (
              <>
                <button type="button" className="btn btn-solid" disabled>
                  Google Maps link to be added
                </button>
                <p className="event-map-note" role="status">
                  {event.mapUrl.trim()
                    ? "The Google Maps link is not a valid HTTPS Google Maps URL yet."
                    : "Google Maps directions will be added once the location is confirmed."}
                </p>
              </>
            )}
            <button type="button" className="btn" onClick={onRequestClose}>
              Close details
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function EventDetailsSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeEvent, setActiveEvent] = useState<WeddingEvent | null>(null);
  const [flight, setFlight] = useState<
    | { direction: "forward"; action: "open"; event: WeddingEvent }
    | { direction: "reverse"; action: "close" }
    | null
  >(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeEvent && dialog && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("#event-dialog-title")?.focus({ preventScroll: true });
    }
  }, [activeEvent]);

  const openDetails = (event: WeddingEvent) => {
    if (flight || activeEvent) return;
    setFlight({ direction: "forward", action: "open", event });
  };

  const closeDetails = () => {
    if (flight || !activeEvent) return;
    setFlight({ direction: "reverse", action: "close" });
  };

  const finishFlight = () => {
    const completedFlight = flight;
    setFlight(null);
    if (completedFlight?.action === "open") {
      setActiveEvent(completedFlight.event);
    } else if (completedFlight?.action === "close") {
      dialogRef.current?.close();
    }
  };

  const clearActiveEvent = () => setActiveEvent(null);

  return (
    <Section
      id="details"
      tone="dark"
      eyebrow="The celebration"
      title="Ceremony & Reception"
      intro="Find our ceremony and reception venues below. We look forward to celebrating with you."
    >
      <div className="event-card-grid">
        {weddingEvents.map((event, index) => {
          const mapUrl = getValidMapUrl(event.mapUrl);
          return (
            <Reveal key={event.id} delay={index * 90}>
              <article className="event-card-wrap">
                <button
                  type="button"
                  className="event-card"
                  onClick={() => openDetails(event)}
                  disabled={Boolean(flight) || Boolean(activeEvent)}
                  aria-label={`View ${event.title} details`}
                >
                  <EventImage event={event} />
                  <span className="event-card-content">
                    <span className="label eyebrow">{event.date}</span>
                    <span className="display event-card-title">{event.title}</span>
                    <span className="event-card-venue">{event.venue}</span>
                    <span className="event-card-description">{event.description}</span>
                    <span className="event-card-summary">
                      <span className="event-card-address">{event.address}</span>
                      <span className="event-card-location">{event.location}</span>
                      <span className="event-card-time">Begins at {event.time}</span>
                    </span>
                    <span className="event-card-action">
                      <span>View event details</span>
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </span>
                  </span>
                </button>
                {mapUrl ? (
                  <a
                    className="btn btn-solid event-map-action"
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${event.title} in Google Maps (opens in a new tab)`}
                  >
                    View Map <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="btn event-map-action" aria-disabled="true">
                    Map link to be announced
                  </span>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
      <WeddingTimeline embedded />
      {activeEvent ? (
        <EventDetailsModal
          event={activeEvent}
          dialogRef={dialogRef}
          onRequestClose={closeDetails}
          onClosed={clearActiveEvent}
        />
      ) : null}
      {flight ? (
        <AirplaneFlightOverlay direction={flight.direction} onComplete={() => finishFlight()} />
      ) : null}
    </Section>
  );
}
