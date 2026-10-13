interface FlyingAirplaneProps {
  x: number;
  y: number;
  scale?: number;
  ref?: React.Ref<SVGGElement>;
}

/** SVG airplane pointing along +x. Position and rotation are set by the hero from the route path. */
export function FlyingAirplane({ x, y, scale = 1.4, ref }: FlyingAirplaneProps) {
  return (
    <g ref={ref} transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        fill="#f4ede3"
        d="M22 0c0-2-2-3-4-3H4L-8-18h-5l6 15h-10l-4-6h-3l3 9-3 9h3l4-6h10l-6 15h5L4 3h14c2 0 4-1 4-3Z"
      />
      <path d="M-18 0H14" stroke="#a3304a" strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}
