import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "./defaults.js";

const ContentContext = createContext(DEFAULT_CONTENT);

/** Same shape as `v`, but every string is empty and every list is empty. */
export function blankLike(v) {
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).map((k) => [k, blankLike(v[k])]));
  return typeof v === "string" ? "" : v;
}

/**
 * Combine saved content with the defaults.
 * - Objects: any key missing from `saved` falls back to the default.
 * - Lists: the saved list wins (so items can be added and removed). Each saved item is
 *   completed from the default item at the same position, or from a blank item of the same shape.
 */
export function mergeContent(base, saved) {
  if (saved === undefined || saved === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(saved)) return base;
    // Nothing to compare against (e.g. a column added in the editor): keep what was saved.
    if (!base.length) return saved;
    const template = blankLike(base[0]);
    return saved.map((item, i) => mergeContent(i < base.length ? base[i] : template, item));
  }
  if (base && typeof base === "object") {
    if (typeof saved !== "object" || Array.isArray(saved)) return base;
    const out = {};
    for (const k of Object.keys(base)) out[k] = mergeContent(base[k], saved[k]);
    return out;
  }
  return typeof saved === typeof base ? saved : base;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    let alive = true;
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : null))
      .then((saved) => {
        if (alive && saved) setContent(mergeContent(DEFAULT_CONTENT, saved));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Browser tab title + search description
  useEffect(() => {
    if (content.siteTitle) document.title = content.siteTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = content.siteDescription;
  }, [content.siteTitle, content.siteDescription]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);

/** Brand logo (image if one was uploaded, otherwise the built-in blob is used by the caller). */
export const logoSrc = (c, area) => (area === "footer" ? c.footer.logo || c.logo : c.logo);
