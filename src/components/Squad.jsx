import Blob from "./Blob.jsx";
import ChiikawaSlot from "./ChiikawaSlot.jsx";
import { SIZE_STYLES, STAT_COLORS, TESTIMONIAL_STYLES } from "../data.js";
import { useContent } from "../content/ContentContext.jsx";

export default function Squad() {
  const { squad } = useContent();
  return (
    <section id="squad" className="squad on-dark">
      <div className="wrap section">
        <div className="section__head">
          <div className="section__intro">
            <span className="tag tag--mango tag--onDark">{squad.tag}</span>
            <h2 className="h2">
              {squad.headingA} <span className="text-pink">{squad.headingB}</span>
            </h2>
            <p className="lede">{squad.lede}</p>
          </div>
          <ChiikawaSlot className="slot--onDark" width={140} height={140} rotate={-5} src={squad.image} alt={squad.imageAlt} />
        </div>

        <div className="size-grid">
          {squad.sizes.map((p, i) => {
            const s = SIZE_STYLES[i % SIZE_STYLES.length];
            return (
              <div key={i} className={`card card--${s.bg} card--onDark size size--${s.shadow}`}>
                <div className="size__blobs">
                  {s.blobs.map((f, j) => (
                    <Blob key={j} fill={f} size={s.blobs.length > 2 ? 44 : 52} />
                  ))}
                  {s.more && <b className="size__plus">+</b>}
                </div>
                <span className="size__title">{p.title}</span>
                <span className="size__desc">{p.desc}</span>
              </div>
            );
          })}
        </div>

        <dl className="stats">
          {squad.stats.map((s, i) => (
            <div key={i} className="stat">
              <dd className={`stat__value text-${STAT_COLORS[i % STAT_COLORS.length]}`}>{s.value}</dd>
              <dt className="stat__label">{s.label}</dt>
            </div>
          ))}
        </dl>

        <div className="chat-grid">
          {squad.testimonials.map((t, i) => {
            const s = TESTIMONIAL_STYLES[i % TESTIMONIAL_STYLES.length];
            return (
              <figure key={i} className="chat">
                <blockquote className={`bubble bubble--${s.bg} bubble--sh-${s.shadow}`}>
                  <span className="bubble__game">{t.game}</span>
                  <p>“{t.quote}”</p>
                </blockquote>
                <figcaption className="chat__who">
                  <span className={`avatar avatar--${s.avatar}`} />
                  <span>
                    <b>{t.handle}</b>
                    <span className="chat__meta">{t.meta}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="clips">
          <span className="clips__title">{squad.clipsTitle}</span>
          <div className="clips__grid">
            {squad.clips.map((c, i) =>
              c.image ? (
                <img key={i} className="clip clip--img" src={c.image} alt={c.alt} />
              ) : (
                <div key={i} className="clip">[CLIP / SCREENSHOT]</div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
