import { asset } from "@/lib/assets";

interface WeddingLogoProps {
  /** `monogram` is the F&P mark with compass, globe and airplane; `full` includes the wordmark. */
  variant?: "monogram" | "full";
  /** `light` artwork is for burgundy backgrounds, `default` for ivory backgrounds. */
  tone?: "light" | "default";
  className?: string;
  style?: React.CSSProperties;
}

const sources = {
  "monogram-light": { src: "/brand/princess-fritz-monogram-light.png", w: 1164, h: 613 },
  "full-light": { src: "/brand/princess-fritz-logo-light.png", w: 1164, h: 901 },
  "full-default": { src: "/brand/princess-fritz-logo.png", w: 1164, h: 901 },
  "monogram-default": { src: "/brand/princess-fritz-logo.png", w: 1164, h: 901 },
} as const;

export function WeddingLogo({
  variant = "full",
  tone = "light",
  className,
  style,
}: WeddingLogoProps) {
  const s = sources[`${variant}-${tone}`];
  const alt =
    variant === "monogram"
      ? "F and P monogram with a compass, globe and airplane"
      : "Fritz & Princess Wedding logo: F and P monogram with a compass, globe and airplane";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(s.src)}
      width={s.w}
      height={s.h}
      alt={alt}
      className={className}
      style={style}
      decoding="async"
    />
  );
}
