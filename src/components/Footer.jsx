import Blob from "./Blob.jsx";
import { logoSrc, useContent } from "../content/ContentContext.jsx";

export default function Footer() {
  const content = useContent();
  const { brand, footer } = content;
  const logo = logoSrc(content, "footer");
  return (
    <footer className="footer on-dark">
      <div className="wrap footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo-row">
              <span className="footer__logo">
                {logo ? <img className="logo-img" src={logo} alt={footer.logo ? footer.logoAlt : content.logoAlt} /> : <Blob fill="paper" size={32} />}
              </span>
              <span className="nav__name">{brand}</span>
            </div>
            <span>{footer.tagline}</span>
          </div>
          <div className="footer__cols">
            {footer.columns.map((c, i) => (
              <div key={i} className="footer__col">
                <b>{c.title}</b>
                {c.links.map((l, j) => (
                  <a key={j} href={l.href}>{l.label}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="footer__bottom">
          <span>{footer.copyright}</span>
          <span className="text-pink">{footer.signoff}</span>
        </div>
      </div>
    </footer>
  );
}
