import React from 'react';

export const ProjectLogo: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    role="img"
    aria-label="Farmer Scheme Assistance Platform Emblem"
  >
    <circle cx="50" cy="50" r="46" fill="#F5F8F5" stroke="#17613A" strokeWidth="3" />
    {/* Rising sun */}
    <path d="M26 58 A24 24 0 0 1 74 58 Z" fill="#F47721" opacity="0.9" />
    {/* Terraced green field arcs */}
    <path d="M12 64 Q50 52 88 64 L85 73 Q50 61 15 73 Z" fill="#207747" />
    <path d="M18 75 Q50 66 82 75 Q68 89 50 91 Q32 89 18 75 Z" fill="#17613A" />
    {/* Central sprout & wheat stalks */}
    <path d="M50 66 L50 26" stroke="#17613A" strokeWidth="3.5" strokeLinecap="round" />
    <path
      d="M50 50 C36 48 30 38 32 30 C41 31 48 39 50 50 Z"
      fill="#207747"
    />
    <path
      d="M50 43 C64 41 70 31 68 23 C59 24 52 32 50 43 Z"
      fill="#17613A"
    />
    <circle cx="50" cy="23" r="4" fill="#F47721" />
  </svg>
);

export const AgriculturalIllustration: React.FC<{ className?: string }> = ({
  className = 'w-16 h-16 sm:w-20 sm:h-20',
}) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    role="img"
    aria-label="Sustainable Agriculture Illustration"
  >
    <rect x="6" y="6" width="88" height="88" rx="44" fill="#F5F8F5" stroke="#E5E7EB" strokeWidth="2.5" />
    {/* Sun */}
    <circle cx="72" cy="28" r="9" fill="#F47721" />
    {/* Rolling green hills */}
    <path d="M12 66 Q38 46 66 64 Q80 72 88 64 L88 76 Q50 92 12 76 Z" fill="#207747" />
    <path d="M15 74 Q50 63 85 74 Q68 90 50 91 Q32 90 15 74 Z" fill="#17613A" />
    {/* Wheat sheaf / leaves */}
    <path d="M35 66 L35 32" stroke="#17613A" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="29" cy="40" rx="5" ry="2.8" transform="rotate(-30 29 40)" fill="#F47721" />
    <ellipse cx="41" cy="40" rx="5" ry="2.8" transform="rotate(30 41 40)" fill="#F47721" />
    <ellipse cx="29" cy="49" rx="5" ry="2.8" transform="rotate(-30 29 49)" fill="#207747" />
    <ellipse cx="41" cy="49" rx="5" ry="2.8" transform="rotate(30 41 49)" fill="#207747" />
    <path d="M56 64 L56 38" stroke="#17613A" strokeWidth="2.8" strokeLinecap="round" />
    <path d="M56 50 C48 48 45 41 47 36 C53 37 56 42 56 50 Z" fill="#207747" />
    <path d="M56 46 C64 44 67 37 65 32 C59 33 56 38 56 46 Z" fill="#17613A" />
  </svg>
);
