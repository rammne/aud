// Describes the form on the /content page. Each field is bound to a path in the content object.
//   field types: "text" (default) | "long" (multi-line) | "image" (upload; alt text stored at `altPath`)
//   list: a repeatable set of items with Add / Remove / Move buttons.
//         `fields(prefix)` returns the nodes (fields or nested lists) for one item, prefix = "path.index".
const t = (path, label, hint) => ({ path, label, hint });
const long = (path, label, hint) => ({ path, label, hint, type: "long" });
const link = (path, label = "Link address") => ({ path, label, hint: "Use #games / #how / #squad / #join to scroll on this page, or a full address like https://…" });
const img = (path, label, hint, altPath) => ({ path, label, hint, type: "image", altPath: altPath || `${path}Alt` });
const list = (path, itemLabel, fields, opts = {}) => ({ type: "list", path, itemLabel, fields, min: 0, ...opts });
const group = (title, ...nodes) => ({ title, nodes });

export const SECTIONS = [
  {
    id: "general",
    title: "Brand & Navigation",
    blurb: "The logo, name and top menu.",
    groups: [
      group(
        "Brand",
        t("brand", "Brand name"),
        img("logo", "Logo", "Square works best. Shown in the top bar (and the footer unless you set a separate footer logo). Leave empty to use the built-in blob."),
      ),
      group(
        "Browser tab & search results",
        t("siteTitle", "Page title", "Shown on the browser tab and in Google"),
        long("siteDescription", "Page description", "One or two sentences shown in Google results"),
      ),
      group(
        "Top menu",
        list("nav.links", "Menu link", (p) => [t(`${p}.label`, "Text"), link(`${p}.href`)]),
        t("nav.cta", "Top-right button text"),
        link("nav.ctaHref", "Top-right button link"),
      ),
    ],
  },
  {
    id: "hero",
    title: "Hero (top of page)",
    blurb: "The first thing visitors see.",
    groups: [
      group(
        "Headline",
        t("hero.sticker", "Sticker above headline"),
        t("hero.titleLine1", "Headline — line 1"),
        t("hero.titleLine2", "Headline — line 2 (highlighted)"),
        long("hero.lede", "Intro sentence"),
      ),
      group(
        "Buttons",
        t("hero.primaryCta", "Main button text"),
        link("hero.primaryHref", "Main button link"),
        t("hero.secondaryCta", "Second button text"),
        link("hero.secondaryHref", "Second button link"),
      ),
      group("Trust points (under the buttons)", list("hero.trust", "Trust point", (p) => [t(p, "Text")])),
      group(
        "Party lobby card — labels",
        t("hero.lobbyTitle", "Card title"),
        t("hero.lobbyReadyWord", "Counter word (e.g. READY → “3/4 READY”)"),
        t("hero.lobbyNowPlaying", "“Now playing” label"),
        t("hero.lobbyGame", "Game name"),
        t("hero.lobbySticker", "Sticker text"),
        t("hero.lobbyTapText", "Player button — not ready"),
        t("hero.lobbyReadyText", "Player button — ready"),
        t("hero.lobbyWaiting", "Status — waiting"),
        t("hero.lobbyGo", "Status — everyone ready"),
      ),
      group(
        "Party lobby card — players",
        list(
          "hero.players",
          "Player",
          (p) => [t(`${p}.name`, "Name"), img(`${p}.image`, "Avatar image", "Optional. Replaces the built-in blob.", `${p}.imageAlt`)],
          { min: 1 },
        ),
      ),
      group("Mascot", img("hero.image", "Hero mascot image (e.g. Chiikawa)", "Square, ~128×128 px or larger")),
    ],
  },
  {
    id: "ticker",
    title: "Scrolling banner",
    blurb: "The moving strip under the hero.",
    groups: [group("Banner items", list("ticker", "Item", (p) => [t(p, "Word or phrase")], { min: 1 }))],
  },
  {
    id: "games",
    title: "Games section",
    blurb: "“Stage 01” — the game cards.",
    groups: [
      group(
        "Section heading",
        t("games.tag", "Small label"),
        t("games.headingA", "Heading — first part"),
        t("games.headingB", "Heading — highlighted part"),
        long("games.lede", "Intro text"),
        img("games.image", "Section mascot image", "Square, ~140×140 px or larger"),
      ),
      group(
        "Game cards",
        list("games.items", "Game", (p) => [
          t(`${p}.name`, "Game name"),
          t(`${p}.tag`, "Badge (e.g. BUILD)"),
          long(`${p}.desc`, "Description"),
          img(`${p}.icon`, "Custom icon", "Optional. Replaces the built-in icon. Square works best.", `${p}.iconAlt`),
        ]),
      ),
      group("“More games” card", t("games.moreTitle", "Title"), long("games.moreText", "Text")),
    ],
  },
  {
    id: "how",
    title: "How it works",
    blurb: "The steps and the feature spotlight.",
    groups: [
      group("Steps", list("how.steps", "Step", (p) => [t(`${p}.title`, "Title"), long(`${p}.desc`, "Description")])),
      group(
        "Spotlight",
        t("how.spotlightHeadline", "Headline"),
        long("how.spotlightText", "Text"),
        list("how.points", "Bullet point", (p) => [t(p, "Text")]),
        t("how.buttonLabel", "Button text"),
        link("how.buttonHref", "Button link"),
      ),
      group(
        "Spotlight images",
        img("how.mascotImage", "Mascot image", "Portrait, ~200×260 px or larger"),
        img("how.productImage", "Product screenshot", "Any landscape or square image"),
      ),
    ],
  },
  {
    id: "squad",
    title: "Community (Squad)",
    blurb: "“Stage 02” — party sizes, stats, quotes and clips.",
    groups: [
      group(
        "Section heading",
        t("squad.tag", "Small label"),
        t("squad.headingA", "Heading — first part"),
        t("squad.headingB", "Heading — highlighted part"),
        long("squad.lede", "Intro text"),
        img("squad.image", "Section mascot image", "Square, ~140×140 px or larger"),
      ),
      group("Party sizes", list("squad.sizes", "Party size", (p) => [t(`${p}.title`, "Title"), long(`${p}.desc`, "Description")])),
      group("Stats", list("squad.stats", "Stat", (p) => [t(`${p}.value`, "Number / value"), t(`${p}.label`, "Label")])),
      group(
        "Player quotes",
        list("squad.testimonials", "Quote", (p) => [
          t(`${p}.game`, "Game label"),
          long(`${p}.quote`, "Quote"),
          t(`${p}.handle`, "Gamertag"),
          t(`${p}.meta`, "Details (squad size · platform)"),
        ]),
      ),
      group(
        "Clips & screenshots",
        t("squad.clipsTitle", "Gallery title"),
        list("squad.clips", "Image", (p) => [img(`${p}.image`, "Image", "Landscape works best", `${p}.alt`)]),
      ),
    ],
  },
  {
    id: "join",
    title: "Sign-up (final section)",
    blurb: "The email sign-up card.",
    groups: [
      group(
        "Text",
        t("join.tag", "Small label"),
        t("join.headingA", "Heading — first part"),
        t("join.headingB", "Heading — highlighted part"),
        long("join.lede", "Offer text"),
      ),
      group(
        "Form",
        t("join.emailLabel", "Email box label"),
        t("join.emailPlaceholder", "Email box placeholder"),
        t("join.buttonLabel", "Button text"),
        t("join.note", "Reassurance line under the button"),
      ),
      group("After sign-up message", t("join.successTitle", "Title"), t("join.successText", "Text (the email is added at the end)")),
      group("Mascot", img("join.image", "Mascot image", "Square, ~120×120 px or larger")),
    ],
  },
  {
    id: "footer",
    title: "Footer",
    blurb: "Bottom of the page.",
    groups: [
      group(
        "Footer text",
        t("footer.tagline", "Brand line"),
        t("footer.copyright", "Copyright line"),
        t("footer.signoff", "Sign-off (pink)"),
        img("footer.logo", "Footer logo", "Optional. If empty, the main logo is used."),
      ),
      group(
        "Footer columns",
        list("footer.columns", "Column", (p) => [
          t(`${p}.title`, "Column title"),
          list(`${p}.links`, "Link", (q) => [t(`${q}.label`, "Text"), link(`${q}.href`)]),
        ]),
      ),
    ],
  },
];
