import { Reveal } from "./Reveal";

interface SectionProps {
  id: string;
  tone: "dark" | "light";
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  narrow?: boolean;
}

export function Section({ id, tone, eyebrow, title, intro, children, narrow }: SectionProps) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className={`tone-${tone} px-5 py-20 md:py-28`}
    >
      <div className={`mx-auto w-full ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>
        <Reveal className="mb-12 text-center">
          <p className="label eyebrow mb-4">{eyebrow}</p>
          <h2 id={`${id}-title`} className="display text-4xl md:text-6xl">
            {title}
          </h2>
          <hr className="rule mx-auto mt-6 w-24" />
          {intro ? <p className="muted mx-auto mt-6 max-w-2xl text-lg">{intro}</p> : null}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
