export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BrickDeal logo"
    >
      {/* ── Isometric 2×1 brick ── */}

      {/* Top face */}
      <polygon points="26,3 48,14 48,14 26,25 4,14" fill="#fde68a" />
      {/* Top face inner shading */}
      <polygon points="26,6 45,15 26,22 7,15" fill="#fbbf24" />

      {/* Left face */}
      <polygon points="4,14 4,28 26,39 26,25" fill="#d97706" />
      {/* Left face highlight */}
      <polygon points="4,14 4,20 26,31 26,25" fill="#e9a80b" opacity="0.5" />

      {/* Right face */}
      <polygon points="26,25 26,39 48,28 48,14" fill="#b45309" />
      {/* Right face highlight strip */}
      <polygon points="26,25 48,14 48,18 26,29" fill="#c96a0c" opacity="0.4" />

      {/* ── Studs (2 studs on top face) ── */}

      {/* Stud 1 — left stud */}
      {/* Stud cylinder back */}
      <ellipse cx="15" cy="11" rx="5.5" ry="3" fill="#e9a50b" />
      {/* Stud cylinder body */}
      <path d="M9.5,11 L9.5,16.5 Q9.5,19.5 15,21 Q20.5,19.5 20.5,16.5 L20.5,11" fill="#d97706" />
      {/* Stud cylinder front ellipse */}
      <ellipse cx="15" cy="16.5" rx="5.5" ry="3" fill="#e9a50b" />
      {/* Stud top highlight */}
      <ellipse cx="15" cy="11" rx="5.5" ry="3" fill="#fef3c7" />
      <ellipse cx="14" cy="10" rx="2.5" ry="1.2" fill="white" opacity="0.4" />

      {/* Stud 2 — right stud */}
      <ellipse cx="37" cy="11" rx="5.5" ry="3" fill="#e9a50b" />
      <path d="M31.5,11 L31.5,16.5 Q31.5,19.5 37,21 Q42.5,19.5 42.5,16.5 L42.5,11" fill="#d97706" />
      <ellipse cx="37" cy="16.5" rx="5.5" ry="3" fill="#e9a50b" />
      <ellipse cx="37" cy="11" rx="5.5" ry="3" fill="#fef3c7" />
      <ellipse cx="36" cy="10" rx="2.5" ry="1.2" fill="white" opacity="0.4" />

      {/* ── Deal tag (bottom-right badge) ── */}
      <circle cx="41" cy="40" r="9" fill="#10b981" />
      <text
        x="41" y="44"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        %
      </text>
    </svg>
  );
}
