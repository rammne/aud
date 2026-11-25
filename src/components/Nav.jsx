import Blob from "./Blob.jsx";
import { useContent } from "../content/ContentContext.jsx";

export default function Nav() {
  const { brand, logo, logoAlt, nav } = useContent();
  return (
    <header className="wrap nav">
      <a className="nav__brand" href="#top">
        <span className="nav__logo">
          {logo ? <img className="logo-img" src={logo} alt={logoAlt} /> : <Blob fill="paper" size={36} />}
        </span>
        <span className="nav__name">{brand}</span>
      </a>
      <nav className="nav__links" aria-label="Main">
        {nav.links.map((l, i) => (
          <a key={i} className="nav__link" href={l.href}>{l.label}</a>
        ))}
        <a className="btn btn--pink btn--sm" href={nav.ctaHref}>{nav.cta}</a>
      </nav>
    </header>
  );
}
