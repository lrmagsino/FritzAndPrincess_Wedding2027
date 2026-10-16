import { WeddingLogo } from "./WeddingLogo";

export function SplashLogoArtwork() {
  return (
    <span className="splash-logo-scene">
      <WeddingLogo variant="full" tone="light" className="splash-logo" />
      <svg
        className="splash-logo-effects"
        viewBox="0 0 1164 901"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <path
            id="splash-orbit-route"
            d="M 322 497 C 245 561 121 467 210 376 S 499 307 658 248 S 840 162 950 78"
          />
          <radialGradient id="splash-globe-light">
            <stop offset="0" stopColor="#f4ede3" stopOpacity=".26" />
            <stop offset="1" stopColor="#f4ede3" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g className="splash-globe-detail" fill="none" stroke="#d6d7da">
          <circle cx="712" cy="265" r="145" />
          <circle cx="712" cy="265" r="133" />
          <ellipse cx="712" cy="265" rx="62" ry="133" />
          <ellipse cx="712" cy="265" rx="116" ry="133" />
          <path d="M581 265h262M598 210c74 25 154 25 228 0M598 320c74-25 154-25 228 0" />
          <circle
            className="splash-destination-glow"
            cx="755"
            cy="243"
            r="38"
            fill="url(#splash-globe-light)"
            stroke="none"
          />
          <circle
            className="splash-destination-pin"
            cx="755"
            cy="243"
            r="4"
            fill="#f4ede3"
            stroke="none"
          />
        </g>
        <g className="splash-compass-detail" fill="none" stroke="#d6d7da">
          <circle cx="336" cy="376" r="126" />
          <circle cx="336" cy="376" r="112" />
          <circle cx="336" cy="376" r="98" strokeDasharray="2 8" />
          <g className="splash-compass-needle">
            <path d="m336 278 17 98-17 98-17-98Z" fill="#d6d7da" fillOpacity=".12" />
            <path d="m336 278 17 98h-17Z" fill="#a3304a" fillOpacity=".42" stroke="none" />
          </g>
          <circle cx="336" cy="376" r="5" fill="#f4ede3" stroke="none" />
        </g>
        <path
          className="splash-orbit-guide"
          d="M 322 497 C 245 561 121 467 210 376 S 499 307 658 248 S 840 162 950 78"
        />
        <path
          className="splash-orbit-glow"
          d="M 322 497 C 245 561 121 467 210 376 S 499 307 658 248 S 840 162 950 78"
        />
        <g className="splash-orbit-plane">
          <path d="M22 0c0-2-2-3-4-3H4L-8-18h-5l6 15h-10l-4-6h-3l3 9-3 9h3l4-6h10l-6 15h5L4 3h14c2 0 4-1 4-3Z" />
        </g>
        <g className="splash-logo-heart">
          <path d="M582 861c-12-10-20-17-20-27a11 11 0 0 1 20-7 11 11 0 0 1 20 7c0 10-8 17-20 27Z" />
          <circle cx="582" cy="833" r="3" />
        </g>
      </svg>
    </span>
  );
}

export function SplashAtmosphere() {
  return (
    <div className="splash-atmosphere" aria-hidden="true">
      <svg viewBox="0 0 1000 700" preserveAspectRatio="none" focusable="false">
        <path
          className="splash-background-route"
          d="M-40 530C160 470 98 270 302 228S700 310 1040 82"
        />
        <path
          className="splash-background-route splash-background-route-secondary"
          d="M-40 148C220 235 318 74 520 112S812 205 1040 360"
        />
        {[
          [88, 103],
          [212, 183],
          [390, 76],
          [627, 174],
          [815, 91],
          [905, 472],
          [728, 604],
          [301, 589],
        ].map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            className="splash-star"
            style={{ "--star-delay": `${index * -0.8}s` } as React.CSSProperties}
            cx={cx}
            cy={cy}
            r={index % 3 === 0 ? 1.8 : 1.1}
          />
        ))}
      </svg>
    </div>
  );
}
