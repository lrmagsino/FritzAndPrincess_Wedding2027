import { WeddingNavigation } from "@/components/wedding/WeddingNavigation";
import { WeddingHero } from "@/components/hero/WeddingHero";
import { PersonalizedGreeting } from "@/components/wedding/PersonalizedGreeting";
import { OurStory } from "@/components/wedding/OurStory";
import { EventDetailsSection } from "@/components/wedding/EventDetailsSection";
import { Entourage } from "@/components/wedding/Entourage";
import { WeddingCountdown } from "@/components/wedding/WeddingCountdown";
import { WeddingCalendar } from "@/components/wedding/WeddingCalendar";
import { WishesSection } from "@/components/wishes/WishesSection";
import { RSVPSection } from "@/components/wedding/RSVPSection";
import { GallerySection } from "@/components/wedding/GallerySection";
import { WeddingFooter } from "@/components/wedding/WeddingFooter";
import { FriendlyReminders } from "@/components/wedding/FriendlyReminders";
import { JourneyAtmosphere } from "@/components/wedding/JourneyAtmosphere";

export default function Home() {
  return (
    <>
      <a href="#welcome" className="skip-link">
        Skip to invitation
      </a>
      <WeddingNavigation />
      <main id="main">
        <WeddingHero />
        <JourneyAtmosphere />
        <PersonalizedGreeting />
        <WeddingCountdown />
        <WeddingCalendar />
        <OurStory />
        <Entourage />
        <EventDetailsSection />
        <FriendlyReminders />
        <WishesSection />
        <GallerySection />
        <RSVPSection />
      </main>
      <WeddingFooter />
    </>
  );
}
