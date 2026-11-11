/** Round award stamp. The ring text sits on a circle of radius 68 inside a 200 by 200 box. */
export default function Seal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Most Valuable Project, 1 of 16 intern groups, United Wholesale Mortgage"
      className={`seal inked thunk ${className}`}
    >
      <defs>
        <path id="seal-ring" d="M 32 100 a 68 68 0 1 1 136 0 a 68 68 0 1 1 -136 0" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="96" strokeWidth="4" />
        <circle cx="100" cy="100" r="88.5" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="59" strokeWidth="1.5" />
      </g>
      <g fill="currentColor" fontWeight="800">
        <text fontSize="13.5">
          <textPath href="#seal-ring" textLength="421" lengthAdjust="spacing">
            MOST VALUABLE PROJECT • 1 OF 16 INTERN GROUPS •
          </textPath>
        </text>
        <text x="100" y="111" textAnchor="middle" fontSize="42" fontWeight="900" letterSpacing="-1.5">
          MVP
        </text>
        <text x="101" y="130" textAnchor="middle" fontSize="11" letterSpacing="3">
          UWM
        </text>
      </g>
    </svg>
  );
}

/** Roughens stamp edges and knocks out specks, the way a rubber stamp never inks evenly. */
export function InkFilter() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <filter id="ink" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 3.5" result="specks" />
        <feComposite in="SourceGraphic" in2="specks" operator="in" result="worn" />
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="1" seed="9" result="wobble" />
        <feDisplacementMap in="worn" in2="wobble" scale="1.4" />
      </filter>
    </svg>
  );
}
