// Simple Husky logo: a paw print on a gold badge, replacing the generic
// 🐾 emoji (which renders inconsistently across platforms) in the header
// and auth screens. Plain SVG shapes rather than an image asset so it
// stays crisp at any size.
function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Husky logo">
      <defs>
        <linearGradient id="husky-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c68a3a" />
          <stop offset="100%" stopColor="#936923" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#husky-logo-gradient)" />
      <g fill="#fffaf2">
        <ellipse cx="24" cy="30.5" rx="9.5" ry="7.5" />
        <ellipse cx="13.5" cy="18.5" rx="4.2" ry="5.4" transform="rotate(-22 13.5 18.5)" />
        <ellipse cx="20.5" cy="12.5" rx="4.4" ry="5.6" transform="rotate(-8 20.5 12.5)" />
        <ellipse cx="27.5" cy="12.5" rx="4.4" ry="5.6" transform="rotate(8 27.5 12.5)" />
        <ellipse cx="34.5" cy="18.5" rx="4.2" ry="5.4" transform="rotate(22 34.5 18.5)" />
      </g>
    </svg>
  )
}

export default Logo
