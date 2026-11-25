import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CONTENT } from "../content/defaults.js";
import { blankLike, mergeContent } from "../content/ContentContext.jsx";
import { SECTIONS } from "../content/schema.js";
import "./editor.css";

const getIn = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

function setIn(obj, path, value) {
  const keys = path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = clone;
  let src = obj;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      cur[k] = value;
    } else {
      const child = src[k];
      cur[k] = Array.isArray(child) ? [...child] : { ...child };
      cur = cur[k];
      src = child;
    }
  });
  return clone;
}

const PW_KEY = "content-editor-pw";
const readPw = () => {
  try { return sessionStorage.getItem(PW_KEY) || ""; } catch { return ""; }
};

function Login({ onDone }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/check", { headers: { "x-editor-password": pw } });
      if (!r.ok) throw new Error(r.status === 401 ? "That password isn't right." : "Can't reach the server.");
      try { sessionStorage.setItem(PW_KEY, pw); } catch { /* ignore */ }
      onDone(pw);
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Can't reach the server." : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="ed ed--center">
      <form className="ed-card ed-login" onSubmit={submit}>
        <h1>Content editor</h1>
        <p>Enter the editor password to update the website.</p>
        <label className="ed-field">
          <span className="ed-label">Password</span>
          <input className="ed-input" type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        {error && <p className="ed-error" role="alert">{error}</p>}
        <button className="ed-btn ed-btn--primary" disabled={busy || !pw}>{busy ? "Checking…" : "Sign in"}</button>
        <a className="ed-link" href="/">← Back to website</a>
      </form>
    </main>
  );
}

function ImageField({ field, content, onChange, upload }) {
  const src = getIn(content, field.path);
  const alt = getIn(content, field.altPath) ?? "";
  const [state, setState] = useState({ busy: false, error: "" });
  const input = useRef(null);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setState({ busy: true, error: "" });
    try {
      onChange(field.path, await upload(file));
      setState({ busy: false, error: "" });
    } catch (err) {
      setState({ busy: false, error: err.message });
    }
  };

  return (
    <div className="ed-field">
      <span className="ed-label">{field.label}</span>
      {field.hint && <span className="ed-hint">{field.hint}</span>}
      <div className="ed-image">
        <div className="ed-image__preview">
          {src ? <img src={src} alt="" /> : <span>No image yet</span>}
        </div>
        <div className="ed-image__controls">
          <input ref={input} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml" hidden onChange={pick} />
          <div className="ed-row">
            <button type="button" className="ed-btn" disabled={state.busy} onClick={() => input.current.click()}>
              {state.busy ? "Uploading…" : src ? "Replace image" : "Upload image"}
            </button>
            {src && (
              <button type="button" className="ed-btn ed-btn--ghost" onClick={() => onChange(field.path, "")}>Remove</button>
            )}
          </div>
          <label className="ed-field ed-field--tight">
            <span className="ed-hint">Describe the image for screen readers (alt text)</span>
            <input className="ed-input" value={alt} onChange={(e) => onChange(field.altPath, e.target.value)} />
          </label>
          {state.error && <p className="ed-error" role="alert">{state.error}</p>}
        </div>
      </div>
    </div>
  );
}

const templateFor = (path) => {
  // "footer.columns.2.links" -> default item shape at "footer.columns.0.links.0"
  const generic = path.replace(/\.\d+(?=\.|$)/g, ".0");
  const arr = getIn(DEFAULT_CONTENT, generic);
  return blankLike(Array.isArray(arr) && arr.length ? arr[0] : "");
};

function ListEditor({ node, content, onChange, upload }) {
  const items = getIn(content, node.path) || [];
  const set = (next) => onChange(node.path, next);
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
  };
  const remove = (i) => {
    if (window.confirm(`Remove ${node.itemLabel.toLowerCase()} ${i + 1}?`)) set(items.filter((_, k) => k !== i));
  };

  return (
    <div className="ed-list">
      {items.map((_, i) => (
        <div key={i} className="ed-item">
          <div className="ed-item__head">
            <strong>{node.itemLabel} {i + 1}</strong>
            <div className="ed-row">
              <button type="button" className="ed-btn ed-btn--sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${node.itemLabel} ${i + 1} up`}>↑</button>
              <button type="button" className="ed-btn ed-btn--sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${node.itemLabel} ${i + 1} down`}>↓</button>
              <button type="button" className="ed-btn ed-btn--sm ed-btn--danger" onClick={() => remove(i)} disabled={items.length <= node.min}>Remove</button>
            </div>
          </div>
          {node.fields(`${node.path}.${i}`).map((n) => (
            <Node key={n.path} node={n} content={content} onChange={onChange} upload={upload} />
          ))}
        </div>
      ))}
      <button type="button" className="ed-btn" onClick={() => set([...items, templateFor(node.path)])}>+ Add {node.itemLabel.toLowerCase()}</button>
    </div>
  );
}

function Node(props) {
  return props.node.type === "list" ? <ListEditor {...props} /> : <Field {...props} field={props.node} />;
}

function Field({ field, content, onChange, upload }) {
  if (field.type === "image") return <ImageField {...{ field, content, onChange, upload }} />;
  const value = getIn(content, field.path) ?? "";
  if (field.type === "select") {
    return (
      <label className="ed-field">
        <span className="ed-label">{field.label}</span>
        {field.hint && <span className="ed-hint">{field.hint}</span>}
        <select className="ed-input" value={value || field.options[0][0]} onChange={(e) => onChange(field.path, e.target.value)}>
          {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
    );
  }
  const Tag = field.type === "long" ? "textarea" : "input";
  return (
    <label className="ed-field">
      <span className="ed-label">{field.label}</span>
      {field.hint && <span className="ed-hint">{field.hint}</span>}
      <Tag
        className={`ed-input ${field.type === "long" ? "ed-input--long" : ""}`}
        rows={field.type === "long" ? 3 : undefined}
        value={value}
        onChange={(e) => onChange(field.path, e.target.value)}
      />
    </label>
  );
}

export default function Editor() {
  const [pw, setPw] = useState(readPw);
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(!!readPw());
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [saved, setSaved] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(SECTIONS[0].id);
  const [status, setStatus] = useState({ kind: "", msg: "" });

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);

  // Restore a previous sign-in for this browser tab.
  useEffect(() => {
    if (!pw) return;
    fetch("/api/check", { headers: { "x-editor-password": pw } })
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!authed) return;
    fetch("/api/content")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((data) => {
        const merged = mergeContent(DEFAULT_CONTENT, data);
        setContent(merged);
        setSaved(merged);
        setLoaded(true);
      });
  }, [authed]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onChange = (path, value) => {
    setContent((c) => setIn(c, path, value));
    setStatus({ kind: "", msg: "" });
  };

  const upload = async (file) => {
    const r = await fetch(`/api/upload?name=${encodeURIComponent(file.name)}`, {
      method: "POST",
      headers: { "x-editor-password": pw },
      body: file,
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(body.error || "Upload failed.");
    return body.url;
  };

  const save = async () => {
    setStatus({ kind: "", msg: "Saving…" });
    try {
      const r = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-editor-password": pw },
        body: JSON.stringify(content),
      });
      if (!r.ok) {
        const body = await r.json().catch(() => ({}));
        throw new Error(body.error || "Save failed.");
      }
      setSaved(content);
      setStatus({ kind: "ok", msg: "Saved — the website is updated." });
    } catch (err) {
      setStatus({ kind: "error", msg: err.message });
    }
  };

  const signOut = () => {
    try { sessionStorage.removeItem(PW_KEY); } catch { /* ignore */ }
    setPw("");
    setAuthed(false);
    setLoaded(false);
  };

  if (checking) return <main className="ed ed--center"><p>Loading…</p></main>;
  if (!authed) return <Login onDone={(p) => { setPw(p); setAuthed(true); }} />;

  const section = SECTIONS.find((s) => s.id === active);

  return (
    <div className="ed">
      <header className="ed-top">
        <div>
          <strong>Content editor</strong>
          <span className="ed-top__sub">Edit text and images, then press Save.</span>
        </div>
        <div className="ed-row">
          <a className="ed-btn ed-btn--ghost" href="/" target="_blank" rel="noreferrer">View website ↗</a>
          <button className="ed-btn ed-btn--ghost" onClick={signOut}>Sign out</button>
          <button className="ed-btn ed-btn--primary" onClick={save} disabled={!dirty || !loaded}>
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>
      <div className="ed-status" role="status" aria-live="polite">
        {status.msg && <span className={status.kind === "error" ? "ed-error" : status.kind === "ok" ? "ed-ok" : ""}>{status.msg}</span>}
        {!status.msg && dirty && <span className="ed-warn">You have unsaved changes.</span>}
      </div>

      <div className="ed-body">
        <nav className="ed-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button key={s.id} className={s.id === active ? "is-active" : ""} onClick={() => { setActive(s.id); window.scrollTo(0, 0); }}>
              {s.title}
            </button>
          ))}
        </nav>

        <main className="ed-main">
          <h1>{section.title}</h1>
          <p className="ed-blurb">{section.blurb}</p>
          {!loaded ? (
            <p>Loading content…</p>
          ) : (
            section.groups.map((g) => (
              <fieldset key={g.title} className="ed-card">
                <legend>{g.title}</legend>
                {g.nodes.map((n) => (
                  <Node key={n.path} node={n} content={content} onChange={onChange} upload={upload} />
                ))}
              </fieldset>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
