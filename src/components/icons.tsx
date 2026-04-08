export function TattooMachine({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Machine body */}
      <rect x="18" y="12" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <rect x="22" y="16" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="22" y="24" width="20" height="4" rx="1" stroke="currentColor" strokeWidth="1" />
      {/* Grip */}
      <rect x="28" y="32" width="8" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="37" x2="36" y2="37" stroke="currentColor" strokeWidth="0.75" />
      <line x1="28" y1="42" x2="36" y2="42" stroke="currentColor" strokeWidth="0.75" />
      {/* Needle */}
      <line
        x1="32"
        y1="50"
        x2="32"
        y2="60"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Coils */}
      <circle cx="24" cy="10" r="3" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy="10" r="3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function RoseOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Petals */}
      <path
        d="M60 25c-8 0-18 8-20 20s4 22 20 30c16-8 22-18 20-30s-12-20-20-20z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M60 30c-6 2-12 10-10 18s8 14 10 16c2-2 8-8 10-16s-4-16-10-18z"
        stroke="currentColor"
        strokeWidth="0.75"
      />
      <path
        d="M60 38c-3 2-6 6-5 10s4 8 5 9c1-1 4-5 5-9s-2-8-5-10z"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      {/* Stem */}
      <path
        d="M60 75c0 0-2 10-3 20s-1 15-1 15"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path d="M57 85c-10-2-16 2-18 8s2 8 18-8z" stroke="currentColor" strokeWidth="0.75" />
      <path d="M59 95c8-4 14 0 15 6s-2 6-15-6z" stroke="currentColor" strokeWidth="0.75" />
      {/* Thorns */}
      <path d="M58 80l-3-2" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
      <path d="M57 90l-2-1" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
    </svg>
  );
}

export function SnakeIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 20c-20 0-35 15-35 35s15 35 35 35 35-15 35-35-15-35-35-35z"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <path
        d="M70 55c0 0 10 30 5 55s-15 40-15 55 10 20 25 15 20-20 25-40 5-35 0-55-10-35-10-35"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Head */}
      <ellipse cx="70" cy="52" rx="6" ry="4" stroke="currentColor" strokeWidth="1" />
      <circle cx="68" cy="51" r="1" fill="currentColor" />
      {/* Tongue */}
      <path
        d="M64 53l-4 2m0 0l-1-2m1 2l1 2"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      {/* Scales pattern */}
      <path d="M72 70c2 3 3 6 2 9" stroke="currentColor" strokeWidth="0.5" />
      <path d="M69 80c2 3 3 6 2 9" stroke="currentColor" strokeWidth="0.5" />
      <path d="M67 95c1 4 1 7-1 10" stroke="currentColor" strokeWidth="0.5" />
      <path d="M70 110c2 4 2 7 0 10" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  );
}

export function DaggerIllustration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blade */}
      <path
        d="M30 10L38 70H22L30 10z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Center line */}
      <line x1="30" y1="18" x2="30" y2="65" stroke="currentColor" strokeWidth="0.5" />
      {/* Guard */}
      <path
        d="M14 70h32c2 0 3 1 3 3v4c0 2-1 3-3 3H14c-2 0-3-1-3-3v-4c0-2 1-3 3-3z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {/* Guard ornament */}
      <circle cx="20" cy="75" r="2" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="40" cy="75" r="2" stroke="currentColor" strokeWidth="0.75" />
      <circle cx="30" cy="75" r="1.5" fill="currentColor" opacity="0.3" />
      {/* Grip */}
      <path d="M24 80h12v30H24z" stroke="currentColor" strokeWidth="1.2" />
      {/* Grip wrapping */}
      <line x1="24" y1="86" x2="36" y2="84" stroke="currentColor" strokeWidth="0.5" />
      <line x1="24" y1="92" x2="36" y2="90" stroke="currentColor" strokeWidth="0.5" />
      <line x1="24" y1="98" x2="36" y2="96" stroke="currentColor" strokeWidth="0.5" />
      <line x1="24" y1="104" x2="36" y2="102" stroke="currentColor" strokeWidth="0.5" />
      {/* Pommel */}
      <circle cx="30" cy="116" r="6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="30" cy="116" r="2.5" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="15" x2="170" y2="15" stroke="currentColor" strokeWidth="0.5" />
      <line x1="230" y1="15" x2="400" y2="15" stroke="currentColor" strokeWidth="0.5" />
      {/* Center diamond */}
      <path d="M200 5l10 10-10 10-10-10z" stroke="currentColor" strokeWidth="1" />
      <path d="M200 9l6 6-6 6-6-6z" stroke="currentColor" strokeWidth="0.5" />
      {/* Side dots */}
      <circle cx="175" cy="15" r="2" fill="currentColor" />
      <circle cx="225" cy="15" r="2" fill="currentColor" />
      {/* Ornamental curves */}
      <path d="M178 15c4-6 10-8 16-8" stroke="currentColor" strokeWidth="0.75" />
      <path d="M178 15c4 6 10 8 16 8" stroke="currentColor" strokeWidth="0.75" />
      <path d="M222 15c-4-6-10-8-16-8" stroke="currentColor" strokeWidth="0.75" />
      <path d="M222 15c-4 6-10 8-16 8" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}
