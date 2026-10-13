import { AnimatedCompass } from "../hero/AnimatedCompass";
import { AnimatedGlobe } from "../hero/AnimatedGlobe";
import { FlyingAirplane } from "../hero/FlyingAirplane";

/** Placeholder artwork used until real photographs are supplied. Decorative: alt text lives on the button. */
export function GalleryArt({ art }: { art: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="500" fill="#4a0e1e" />
      <rect
        x="14"
        y="14"
        width="372"
        height="472"
        fill="none"
        stroke="#bdbfc4"
        strokeOpacity="0.3"
      />
      {art === "globe" ? <AnimatedGlobe cx={200} cy={250} r={110} /> : null}
      {art === "compass" ? <AnimatedCompass cx={200} cy={250} r={105} /> : null}
      {art === "plane" ? (
        <g>
          <path
            d="M60 380C140 300 240 320 340 130"
            fill="none"
            stroke="#bdbfc4"
            strokeWidth="1.4"
            strokeDasharray="2 8"
            strokeLinecap="round"
          />
          <FlyingAirplane x={340} y={130} scale={2.4} />
        </g>
      ) : null}
      {art === "route" ? (
        <path
          d="M50 400C120 460 280 440 320 330S350 150 330 100"
          fill="none"
          stroke="#d6d7da"
          strokeWidth="1.5"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />
      ) : null}
      {art === "heart" ? (
        <g fill="none" stroke="#f4ede3" strokeWidth="2" strokeLinecap="round">
          <path d="M200 340C150 295 120 260 120 220a40 40 0 0 1 80-14 40 40 0 0 1 80 14c0 40-30 75-80 120Z" />
          <circle cx="200" cy="228" r="11" />
        </g>
      ) : null}
      {art === "monogram" ? (
        <text
          x="200"
          y="290"
          textAnchor="middle"
          fill="#f4ede3"
          fontSize="150"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
        >
          F
          <tspan fill="#bdbfc4" fontStyle="italic">
            &amp;
          </tspan>
          P
        </text>
      ) : null}
    </svg>
  );
}
