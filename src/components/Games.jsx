import ChiikawaSlot from "./ChiikawaSlot.jsx";
import { GAME_STYLES } from "../data.js";
import { GAME_ICONS, Plus } from "./Icons.jsx";
import { fitStyle } from "../content/fit.js";
import { useContent } from "../content/ContentContext.jsx";

export default function Games() {
  const { games } = useContent();
  return (
    <section id="games" className="wrap section section--tight-bottom">
      <div className="section__head">
        <div className="section__intro">
          <span className="tag tag--pink">{games.tag}</span>
          <h2 className="h2" style={fitStyle(games.headingA + games.headingB, games.headingSize)}>
            {games.headingA} <span className="mark mark--mango">{games.headingB}</span>
          </h2>
          <p className="lede">{games.lede}</p>
        </div>
        <ChiikawaSlot width={140} height={140} rotate={5} src={games.image} alt={games.imageAlt} />
      </div>

      <div className="game-grid">
        {games.items.map((g, i) => {
          const style = GAME_STYLES[i % GAME_STYLES.length];
          const Icon = GAME_ICONS[style.icon];
          return (
            <article key={i} className={`card card--${style.bg} game`}>
              <div className="game__top">
                <span className={`chip ${style.bg === "paper2" ? "chip--mango" : "chip--paper"}`}>{g.tag}</span>
                {g.icon ? <img className="game-icon-img" src={g.icon} alt={g.iconAlt} /> : <Icon />}
              </div>
              <h3 className="h3">{g.name}</h3>
              <p className="card__text">{g.desc}</p>
            </article>
          );
        })}
        <article className="card card--dashed game game--more">
          <Plus />
          <h3 className="h3">{games.moreTitle}</h3>
          <p className="card__text">{games.moreText}</p>
        </article>
      </div>
    </section>
  );
}
