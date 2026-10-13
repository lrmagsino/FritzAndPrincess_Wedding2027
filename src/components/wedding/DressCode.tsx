import { attire, palette } from "@/lib/wedding";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

function AttireIcon({ id }: { id: string }) {
  if (id === "ninong") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="m17 7 7 4 7-4 9 7-5 8-4-3v22H17V19l-4 3-5-8 9-7Z" />
        <path d="m20 9 4 6 4-6m-4 6v26m-7-18h14" />
      </svg>
    );
  }

  if (id === "ninang") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="m18 8 6 4 6-4 4 8 8 26H6l8-26 4-8Z" />
        <path d="m18 8 6 11 6-11m-6 11-8 23m8-23 8 23" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d="m15 8 9 5 9-5 8 8-6 7-4-3v18H17V20l-4 3-6-7 8-8Z" />
      <path d="m19 9 5 7 5-7m-5 7v17m-7-13h14" />
    </svg>
  );
}

export function DressCode() {
  return (
    <Section
      id="dress-code"
      tone="dark"
      eyebrow="Dress code"
      title="Dress Code"
      intro="Come dressed comfortably and celebrate with us in style."
    >
      <div className="dress-code-theme" aria-label="Wedding theme colours">
        <span className="label dress-code-theme-label">Wedding theme colours</span>
        <ul className="dress-code-swatches">
          {palette.map((colour) => (
            <li key={colour.name} className="dress-code-swatch">
              <span
                className="dress-code-swatch-chip"
                style={{ backgroundColor: colour.hex }}
                role="img"
                aria-label={`${colour.name} swatch`}
              />
              <span>{colour.name}</span>
            </li>
          ))}
        </ul>
        <p className="muted dress-code-theme-note">
          These are our wedding colours, not a required dress palette. Guests may wear any colour.
        </p>
      </div>
      <div className="dress-code-grid">
        {attire.map((item, index) => (
          <Reveal key={item.id} delay={index * 90}>
            <article className={`card dress-code-card dress-code-card-${item.id}`}>
              <span className="dress-code-icon">
                <AttireIcon id={item.id} />
              </span>
              <h3 className="label eyebrow dress-code-card-title">{item.title}</h3>
              <p className="display dress-code-recommendation">{item.recommendation}</p>
              {item.note ? <p className="dress-code-note">{item.note}</p> : null}
              <p className="muted dress-code-description">{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
