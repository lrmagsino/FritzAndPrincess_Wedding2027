import { couple } from "@/lib/wedding";
import { WeddingLogo } from "../hero/WeddingLogo";

export function WeddingFooter() {
  return (
    <footer className="tone-dark border-t border-silver-400/25 px-5 py-16 text-center">
      <WeddingLogo variant="full" tone="light" className="mx-auto h-auto w-56" />
      <p className="display mt-8 text-2xl uppercase">{couple.names}</p>
      <p className="label mt-3 text-silver-300">{couple.dateLong}</p>
      <p className="display mx-auto mt-6 max-w-md text-xl text-silver-200 italic">
        {couple.tagline}
      </p>
      <p className="mx-auto mt-4 max-w-md text-silver-300">
        Thank you for being part of the beginning of our journey. We cannot wait to celebrate with
        you.
      </p>
      <a
        href="#top"
        className="label mt-8 inline-block min-h-11 px-4 py-3 text-silver-200 underline underline-offset-8"
      >
        Back to top
      </a>
      <p className="label mt-10 text-xs tracking-[0.14em] text-silver-300">
        Created by Lenj Magsino
      </p>
    </footer>
  );
}
