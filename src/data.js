// Design-only data (colors, icons, layout). All editable copy lives in
// src/content/defaults.js and is edited by the team at /content.
export const PLAYERS = [
  { id: "p1", fill: "paper", bg: "mango" },
  { id: "p2", fill: "mango", bg: "pink" },
  { id: "p3", fill: "paper2", bg: "pink" },
  { id: "p4", fill: "pink", bg: "mango" },
];

export const GAME_STYLES = [
  { icon: "cube", bg: "mango" },
  { icon: "bricks", bg: "pink" },
  { icon: "crosshair", bg: "paper2" },
  { icon: "mountain", bg: "mango" },
];

export const STEP_COLORS = ["pink", "mango", "pink"];

export const SIZE_STYLES = [
  { bg: "mango", shadow: "pink", blobs: ["paper", "pink"] },
  { bg: "pink", shadow: "mango", blobs: ["mango", "paper", "mango", "paper"] },
  { bg: "paper", shadow: "pink", blobs: ["pink", "mango", "pink", "mango"], more: true },
];

export const STAT_COLORS = ["mango", "pink", "mango"];

export const TESTIMONIAL_STYLES = [
  { bg: "mango", shadow: "pink", avatar: "pink" },
  { bg: "pink", shadow: "mango", avatar: "mango" },
  { bg: "paper", shadow: "mango", avatar: "pink" },
];
