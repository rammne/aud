import ChiikawaSlot from "./ChiikawaSlot.jsx";
import { Arrow, Check, Sparkle } from "./Icons.jsx";
import { STEP_COLORS } from "../data.js";
import { useContent } from "../content/ContentContext.jsx";

export default function HowItWorks() {
  const { how } = useContent();
  return (
    <section id="how" className="wrap section section--tight-top">
      <ol className="steps">
        {how.steps.map((s, i) => (
          <li key={i} className="card card--paper2 step">
            <span className={`step__num step__num--${STEP_COLORS[i % STEP_COLORS.length]}`}>{i + 1}</span>
            <h3 className="h3">{s.title}</h3>
            <p className="card__text">{s.desc}</p>
          </li>
        ))}
      </ol>

      <div className="spotlight">
        <div className="spotlight__text">
          <h3 className="h2 h2--sm">{how.spotlightHeadline}</h3>
          <p className="lede lede--ink">{how.spotlightText}</p>
          <ul className="checks">
            {how.points.map((p, i) => (
              <li key={i}><Check />{p}</li>
            ))}
          </ul>
          <a className="btn btn--mango" href={how.buttonHref}>{how.buttonLabel} <Arrow size={18} /></a>
        </div>
        <div className="spotlight__visual">
          <ChiikawaSlot width={200} height={260} src={how.mascotImage} alt={how.mascotImageAlt} />
          {how.productImage ? (
            <img className="slot slot--flat slot--filled" src={how.productImage} alt={how.productImageAlt} />
          ) : (
            <div className="slot slot--flat">[PRODUCT<br />SHOT]</div>
          )}
          <Sparkle className="spotlight__sparkle" size={44} fill="#F4EDDC" />
        </div>
      </div>
    </section>
  );
}
