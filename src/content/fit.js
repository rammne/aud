// Headline sizing. `mode` is the editor's "Text size" choice:
//   "auto" (default) shrinks long text so it still fits, "small" / "normal" / "large" are fixed.
// Returns a style object that sets --fit, which styles.css multiplies into the font size.
const FIXED = { small: 0.8, normal: 1, large: 1.2 };

export function fitStyle(text, mode = "auto", softLimit = 26) {
  if (mode in FIXED) return { "--fit": FIXED[mode] };
  const len = String(text || "").length;
  const scale = len > softLimit ? Math.max(0.55, softLimit / len) : 1;
  return { "--fit": Number(scale.toFixed(2)) };
}
