import { Section } from "./Section";
import { Reveal } from "./Reveal";

const RSVP_URL = process.env.NEXT_PUBLIC_RSVP_FORM_URL || "https://forms.gle/qqcTjS8X8AhS7Vbe9";
const RSVP_EMBED_URL =
  process.env.NEXT_PUBLIC_RSVP_EMBED_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSdfjFmsCtfLXTcq96DChlf0-A3s1eAneHLOFg47Dbboylpk3Q/viewform?embedded=true";

export function RSVPSection() {
  return (
    <Section
      id="rsvp"
      tone="dark"
      eyebrow="Kindly reply"
      title="RSVP"
      intro="Kindly RSVP by March 23, 2027. Please confirm your attendance through our RSVP form."
      narrow
    >
      <Reveal>
        <div className="card rsvp-card">
          <p className="muted rsvp-fallback rsvp-fallback-top">
            If the embedded form does not appear, use this direct link:
          </p>
          <a
            className="btn btn-solid rsvp-direct-link"
            href={RSVP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open RSVP form <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <iframe
            className="rsvp-form-embed"
            src={RSVP_EMBED_URL}
            title="Fritz and Princess Wedding RSVP form"
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </Reveal>
    </Section>
  );
}
