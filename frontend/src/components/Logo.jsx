export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-label="NipunAI logo">
      <rect x="2" y="2" width="36" height="36" rx="11" fill="#26386f" />
      <path
        d="M13 27 V13 L27 27 V13"
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29.5 8 l1.1 2.6 2.6 1.1 -2.6 1.1 -1.1 2.6 -1.1 -2.6 -2.6 -1.1 2.6 -1.1 Z"
        fill="#9db2e6"
      />
    </svg>
  );
}