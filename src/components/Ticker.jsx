import { useContent } from "../content/ContentContext.jsx";

export default function Ticker() {
  const { ticker } = useContent();
  // The list is repeated so the marquee loops without a gap.
  const items = [...ticker, ...ticker, ...ticker, ...ticker];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {items.map((t, i) => (
          <span key={i} className="ticker__item">
            {t}
            <b className="ticker__sep">◆</b>
          </span>
        ))}
      </div>
    </div>
  );
}
