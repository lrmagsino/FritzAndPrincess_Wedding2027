interface TravelRouteProps {
  d: string;
  ref?: React.Ref<SVGPathElement>;
}

/** The curved journey. A faint dotted guide stays visible as the solid route fades in with scroll. */
export function TravelRoute({ d, ref }: TravelRouteProps) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#bdbfc4" strokeWidth="1" strokeDasharray="1.5 9" opacity="0.28" />
      <path ref={ref} d={d} stroke="#d6d7da" strokeWidth="1.5" style={{ opacity: 0 }} />
    </g>
  );
}
