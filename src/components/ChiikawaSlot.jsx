/**
 * Drop-in slot for licensed Chiikawa artwork.
 * Pass `src` once you have the approved asset; until then it shows a labelled placeholder.
 */
export default function ChiikawaSlot({ width = 128, height = 128, rotate = 0, src, alt = "", className = "", children }) {
  const style = { width, height, transform: rotate ? `rotate(${rotate}deg)` : undefined };
  if (src) {
    return <img className={`slot slot--filled ${className}`} style={style} src={src} alt={alt} />;
  }
  return (
    <div className={`slot ${className}`} style={style} role="img" aria-label="Placeholder for Chiikawa artwork">
      {children || (
        <>
          [CHIIKAWA
          <br />
          ART
          <br />
          {width}×{height}]
        </>
      )}
    </div>
  );
}
