import { useState } from "react";
import Blob from "./Blob.jsx";
import ChiikawaSlot from "./ChiikawaSlot.jsx";
import { Arrow, Play, Sparkle } from "./Icons.jsx";
import { PLAYERS } from "../data.js";
import { useContent } from "../content/ContentContext.jsx";

function Lobby() {
  const { hero } = useContent();
  const total = hero.players.length;
  // Everyone except the last player starts ready; tapping toggles.
  const [toggled, setToggled] = useState({});
  const isReady = (i) => (i in toggled ? toggled[i] : i < total - 1);
  const count = hero.players.filter((_, i) => isReady(i)).length;
  const allReady = total > 0 && count === total;

  const toggle = (i) => setToggled((t) => ({ ...t, [i]: !isReady(i) }));

  return (
    <div className="lobby">
      <div className="lobby__screen">
        <div className="lobby__top">
          <span>{hero.lobbyTitle}</span>
          <span className="lobby__count" aria-live="polite">{count}/{total} {hero.lobbyReadyWord}</span>
        </div>
        <div className="lobby__grid">
          {hero.players.map((pl, i) => {
            const p = PLAYERS[i % PLAYERS.length];
            return (
              <button
                key={i}
                type="button"
                className={`lobby__player lobby__player--${p.bg} ${isReady(i) ? "is-ready" : ""}`}
                aria-pressed={isReady(i)}
                onClick={() => toggle(i)}
              >
                {pl.image ? <img className="avatar-img" src={pl.image} alt={pl.imageAlt} /> : <Blob fill={p.fill} size={84} />}
                <span className="lobby__name">{pl.name}</span>
                <span className="lobby__status">{isReady(i) ? hero.lobbyReadyText : hero.lobbyTapText}</span>
              </button>
            );
          })}
        </div>
        <div className="lobby__bottom">
          <span>{hero.lobbyNowPlaying} {hero.lobbyGame}</span>
          <span className={`lobby__go ${allReady ? "is-on" : ""}`}>{allReady ? hero.lobbyGo : hero.lobbyWaiting}</span>
        </div>
      </div>
      <span className="sticker lobby__sticker">{hero.lobbySticker}</span>
      <ChiikawaSlot className="lobby__slot" width={128} height={128} rotate={-6} src={hero.image} alt={hero.imageAlt} />
      <Sparkle className="lobby__sparkle lobby__sparkle--a" size={40} fill="#FFC531" />
      <Sparkle className="lobby__sparkle lobby__sparkle--b" size={28} fill="#FF2E93" />
    </div>
  );
}

export default function Hero() {
  const { hero } = useContent();
  const dots = ["pink", "mango", "ink"];
  return (
    <section id="top" className="wrap hero">
      <div className="hero__text">
        <span className="sticker sticker--tilt">{hero.sticker}</span>
        <h1 className="hero__title">
          {hero.titleLine1}
          <br />
          <span className="hero__mark">{hero.titleLine2}</span>
        </h1>
        <p className="hero__lede">{hero.lede}</p>
        <div className="hero__actions">
          <a className="btn btn--pink btn--lg" href={hero.primaryHref}>{hero.primaryCta} <Arrow /></a>
          <a className="btn btn--paper btn--lg" href={hero.secondaryHref}><Play /> {hero.secondaryCta}</a>
        </div>
        <ul className="hero__trust">
          {hero.trust.map((t, i) => (
            <li key={i}><i className={`dot dot--${dots[i % dots.length]}`} />{t}</li>
          ))}
        </ul>
      </div>
      <Lobby />
    </section>
  );
}
