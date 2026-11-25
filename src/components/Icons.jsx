const base = { fill: "none", stroke: "#111111", strokeWidth: 2, strokeLinejoin: "round", "aria-hidden": true };

export function Cube({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" fill="#F4EDDC" />
      <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
    </svg>
  );
}

export function Bricks({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <rect x="4" y="4" width="13" height="13" transform="rotate(12 10 10)" fill="#F4EDDC" />
      <rect x="8" y="9" width="5" height="5" transform="rotate(12 10 10)" fill="#FFC531" />
      <rect x="14" y="16" width="6" height="5" fill="#FFC531" />
    </svg>
  );
}

export function Crosshair({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeLinecap="square">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.5" fill="#FF2E93" />
      <path d="M12 1v5M12 18v5M1 12h5M18 12h5" />
    </svg>
  );
}

export function Mountain({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
      <path d="M2 20l7-12 4 6 3-4 6 10z" fill="#F4EDDC" />
      <path d="M9 8l-1.6 2.8L9 10.5l1.5.8z" fill="#FF2E93" />
    </svg>
  );
}

export function Plus({ size = 46 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={3} strokeLinecap="square">
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export function Arrow({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={3} strokeLinecap="square">
      <path d="M4 12h15M13 5l7 7-7 7" />
    </svg>
  );
}

export function Play({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#111111" aria-hidden="true">
      <path d="M6 3l15 9-15 9z" />
    </svg>
  );
}

export function Check({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth={3.5} strokeLinecap="square">
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

export function Sparkle({ size = 36, fill = "#FFC531", className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill={fill} stroke="#111111" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export const GAME_ICONS = { cube: Cube, bricks: Bricks, crosshair: Crosshair, mountain: Mountain };
