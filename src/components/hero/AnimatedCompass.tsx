interface AnimatedCompassProps {
  cx: number;
  cy: number;
  r: number;
}

const polar = (radius: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return {
    x: Math.round(radius * Math.cos(a) * 1000) / 1000,
    y: Math.round(radius * Math.sin(a) * 1000) / 1000,
  };
};

/** Silver and ivory compass. Rotates slightly with scroll and sits at its own parallax depth. */
export function AnimatedCompass({ cx, cy, r }: AnimatedCompassProps) {
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const long = i % 6 === 0;
    const a = polar(r * (long ? 0.86 : 0.92), i * 5);
    const b = polar(r * 0.98, i * 5);
    return { i, a, b, long };
  });
  const star = (len: number, wid: number) => `M0 ${-len}L${wid} 0L0 ${len}L${-wid} 0Z`;
  return (
    <g className="layer-compass">
      <g transform={`translate(${cx} ${cy})`} fill="none" strokeLinecap="round">
        <circle r={r} stroke="#bdbfc4" strokeWidth="1.3" opacity="0.7" />
        <circle r={r * 0.82} stroke="#bdbfc4" strokeWidth="0.8" opacity="0.4" />
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.a.x}
            y1={t.a.y}
            x2={t.b.x}
            y2={t.b.y}
            stroke="#f4ede3"
            strokeWidth={t.long ? 1.1 : 0.6}
            opacity={t.long ? 0.6 : 0.35}
          />
        ))}
        <path
          d={star(r * 0.72, r * 0.09)}
          stroke="#bdbfc4"
          strokeWidth="1"
          fill="#bdbfc4"
          fillOpacity="0.16"
        />
        <path
          d={star(r * 0.72, r * 0.09)}
          stroke="#bdbfc4"
          strokeWidth="1"
          fill="#bdbfc4"
          fillOpacity="0.16"
          transform="rotate(90)"
        />
        <path
          d={star(r * 0.46, r * 0.06)}
          stroke="#bdbfc4"
          strokeWidth="0.8"
          opacity="0.7"
          transform="rotate(45)"
        />
        <path
          d={star(r * 0.46, r * 0.06)}
          stroke="#bdbfc4"
          strokeWidth="0.8"
          opacity="0.7"
          transform="rotate(-45)"
        />
        {/* burgundy accent: north point */}
        <path d={`M0 ${-r * 0.72}L${r * 0.09} 0H${-r * 0.09}Z`} fill="#a3304a" stroke="none" />
        <circle r={r * 0.04} fill="#f4ede3" stroke="none" />
        {(
          [
            ["N", 0],
            ["E", 90],
            ["S", 180],
            ["W", 270],
          ] as const
        ).map(([letter, deg]) => {
          const p = polar(r * 1.15, deg);
          return (
            <text
              key={letter}
              x={p.x}
              y={p.y}
              fill="#bdbfc4"
              stroke="none"
              fontSize={r * 0.16}
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {letter}
            </text>
          );
        })}
      </g>
    </g>
  );
}
