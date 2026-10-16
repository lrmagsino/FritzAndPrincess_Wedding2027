import { friendlyReminders } from "@/lib/wedding";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { GiftSection } from "./GiftSection";

export function FriendlyReminders() {
  return (
    <Section
      id="reminders"
      tone="light"
      eyebrow="A note for our guests"
      title="Friendly Reminders"
      intro="A few thoughtful notes to help everyone feel comfortable and enjoy the celebration."
    >
      <div className="friendly-reminder-grid">
        <Reveal>
          <article className="friendly-reminder-card">
            <h3 className="display">Adults-Only Affair</h3>
            <p>{friendlyReminders.adultsOnly}</p>
          </article>
        </Reveal>
        <Reveal delay={70}>
          <article className="friendly-reminder-card">
            <h3 className="display">Gifts</h3>
            <p>{friendlyReminders.gifts}</p>
            <div className="tone-light friendly-gift-details">
              <GiftSection inline />
            </div>
          </article>
        </Reveal>
        <Reveal delay={140}>
          <article className="friendly-reminder-card">
            <h3 className="display">Plus Ones</h3>
            <p>{friendlyReminders.plusOnes}</p>
          </article>
        </Reveal>
        <Reveal delay={210}>
          <article className="friendly-reminder-card">
            <h3 className="display">Dress Code &amp; Attire</h3>
            <div className="friendly-attire-group">
              <h4 className="label">Principal Sponsors</h4>
              {friendlyReminders.principalSponsors.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <div className="friendly-attire-group">
              <h4 className="label">Guests</h4>
              <p>{friendlyReminders.guests}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
