const FILLS = { paper: "#F4EDDC", paper2: "#FFFBF0", mango: "#FFC531", pink: "#FF2E93" };

// Original placeholder mascot. Swap for licensed character art when ready.
export default function Blob({ fill = "paper", size = 64 }) {
  const color = FILLS[fill];
  const blush = fill === "pink" ? "#F4EDDC" : "#FF2E93";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M16 20L12 6l14 6zM48 20l4-14-14 6z" fill={color} stroke="#111111" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 40C8 22 20 12 32 12s24 10 24 28c0 12-10 16-24 16S8 52 8 40z" fill={color} stroke="#111111" strokeWidth="3" />
      <circle cx="23" cy="34" r="3" fill="#111111" />
      <circle cx="41" cy="34" r="3" fill="#111111" />
      <ellipse cx="17" cy="42" rx="4" ry="2.5" fill={blush} />
      <ellipse cx="47" cy="42" rx="4" ry="2.5" fill={blush} />
      <path d="M28 41q4 4 8 0" fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
