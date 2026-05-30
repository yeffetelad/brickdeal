export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brick logo"
    >
      {/* Studs (top) */}
      <circle cx="13" cy="12" r="5.5" fill="#f59e0b" />
      <circle cx="27" cy="12" r="5.5" fill="#f59e0b" />
      {/* Stud faces */}
      <circle cx="13" cy="10.5" r="5.5" fill="#fbbf24" />
      <circle cx="27" cy="10.5" r="5.5" fill="#fbbf24" />
      {/* Brick body */}
      <rect x="3" y="14" width="34" height="20" rx="4" fill="#fbbf24" />
      {/* Top edge shadow for depth */}
      <rect x="3" y="14" width="34" height="5" rx="4" fill="#f59e0b" />
    </svg>
  );
}
