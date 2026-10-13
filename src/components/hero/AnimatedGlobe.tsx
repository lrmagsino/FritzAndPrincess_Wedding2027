interface AnimatedGlobeProps {
  cx: number;
  cy: number;
  r: number;
}

const MERIDIANS = 6;
const LATITUDES = [-62, -34, 0, 34, 62];

/** Silver-gray line-art globe. Meridians sweep slowly; the whole group drifts with scroll. */
export function AnimatedGlobe({ cx, cy, r }: AnimatedGlobeProps) {
  return (
    <g className="layer-globe" fill="none" stroke="#bdbfc4" strokeLinecap="round">
      <g transform={`translate(${cx} ${cy})`}>
        <circle r={r} strokeWidth="1.4" opacity="0.55" />
        <circle r={r + 14} strokeWidth="0.8" opacity="0.28" />
        {LATITUDES.map((lat) => {
          const rad = (lat * Math.PI) / 180;
          const y = r * Math.sin(rad);
          const w = r * Math.cos(rad);
          return (
            <path
              key={lat}
              d={`M${-w} ${y} Q0 ${y + w * 0.2} ${w} ${y}`}
              strokeWidth="0.9"
              opacity="0.32"
            />
          );
        })}
        {Array.from({ length: MERIDIANS }, (_, i) => (
          <circle
            key={i}
            r={r}
            className="meridian"
            strokeWidth="0.9"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
            style={{ animationDelay: `${-(120 / MERIDIANS) * i}s` }}
          />
        ))}
        <path
          d={`M0 ${-r - 24}V${r + 24}`}
          strokeWidth="0.8"
          opacity="0.22"
          transform="rotate(23)"
        />
      </g>
    </g>
  );
}
