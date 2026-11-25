import { useState } from "react";
import ChiikawaSlot from "./ChiikawaSlot.jsx";
import { Arrow } from "./Icons.jsx";
import { useContent } from "../content/ContentContext.jsx";

export default function JoinCta() {
  const { join } = useContent();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: send `email` to your backend or mailing-list provider here.
    setDone(true);
  };

  return (
    <section id="join" className="join">
      <div className="wrap join__wrap">
        <div className="join__card">
          <ChiikawaSlot className="join__slot" width={120} height={120} rotate={6} src={join.image} alt={join.imageAlt} />
          <div className="join__text">
            <span className="tag tag--mango">{join.tag}</span>
            <h2 className="h2 h2--xl">
              {join.headingA} <span className="mark mark--mango">{join.headingB}</span>
            </h2>
            <p className="lede lede--ink">{join.lede}</p>
          </div>

          {done ? (
            <div className="join__done" role="status">
              <span className="join__done-title">{join.successTitle}</span>
              <span>{join.successText} {email}.</span>
            </div>
          ) : (
            <form className="join__form" onSubmit={onSubmit}>
              <label className="join__label" htmlFor="email">{join.emailLabel}</label>
              <input
                id="email"
                className="join__input"
                type="email"
                required
                autoComplete="email"
                placeholder={join.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn--pink btn--xl">
                {join.buttonLabel} <Arrow />
              </button>
              <span className="join__note">{join.note}</span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
