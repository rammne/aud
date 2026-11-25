import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Ticker from "./components/Ticker.jsx";
import Games from "./components/Games.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Squad from "./components/Squad.jsx";
import JoinCta from "./components/JoinCta.jsx";
import Footer from "./components/Footer.jsx";
import Editor from "./pages/Editor.jsx";
import { ContentProvider } from "./content/ContentContext.jsx";

function HomePage() {
  return (
    <ContentProvider>
      <div className="page">
        <Nav />
        <main>
          {/* Attention */}
          <Hero />
          <Ticker />
          {/* Interest */}
          <Games />
          <HowItWorks />
          {/* Desire */}
          <Squad />
          {/* Action */}
          <JoinCta />
        </main>
        <Footer />
      </div>
    </ContentProvider>
  );
}

export default function App() {
  // Two pages: "/" is the website, "/content" is the editor for the copywriter / site manager.
  const isEditor = window.location.pathname.replace(/\/+$/, "") === "/content";
  return isEditor ? <Editor /> : <HomePage />;
}
