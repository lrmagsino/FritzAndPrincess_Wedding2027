import { Section } from "@/components/wedding/Section";
import { Reveal } from "@/components/wedding/Reveal";
import { WishesForm } from "./WishesForm";
import { WishesList } from "./WishesList";

export function WishesSection() {
  return (
    <Section
      id="wishes"
      tone="dark"
      eyebrow="A note for the journey"
      title="Wishes & Prayers"
      intro="Leave a message, wish, or prayer for the couple as they begin their journey together."
    >
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal>
          <WishesForm />
        </Reveal>
        <Reveal delay={100}>
          <WishesList />
        </Reveal>
      </div>
    </Section>
  );
}
