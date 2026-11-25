# Party site (React + Vite)

Two pages:

- `/` — the website
- `/content` — the **content editor** where the copywriter / website manager types the text and uploads the images

```bash
npm install
npm run dev                                   # local dev (site + editor + API)

# production
npm run build
EDITOR_PASSWORD=your-secret npm start         # serves dist/ + editor on :3000 (PowerShell: $env:EDITOR_PASSWORD="your-secret"; npm start)
```

## For the copywriter / site manager

1. Open `/content` and sign in with the editor password.
2. Pick a section on the left, edit the boxes, upload images (PNG, JPG, GIF, WEBP, SVG — max 8 MB) and add alt text.
3. Press **Save changes**. The home page updates immediately — no developer needed.

Anything left empty keeps showing its placeholder; images that haven't been uploaded show the dashed placeholder box.

## How it works

- Editable copy defaults: `src/content/defaults.js`. Saved edits are written to `data/content.json`; uploaded images go to `data/uploads/`. **Back up / persist the `data/` folder** on your host.
- The form is generated from `src/content/schema.js`. To make a new piece of text editable: add it to `defaults.js`, use it in the component via `useContent()`, and add a field for it in `schema.js`.
- API: `server/api.js` (zero dependencies). Writes require the `EDITOR_PASSWORD` env var (defaults to `party123` if unset — **always set it in production**).
- Counts are fixed (4 games, 3 steps, 3 quotes, 4 clips…) because the layout and colors are designed around them.
- Colors and fonts are tokens at the top of `src/styles.css`.
- Signup form: add your backend / mailing-list call in `src/components/JoinCta.jsx` (see the TODO).

Note: hosting must run `server.js` (a Node host). A purely static host (Netlify/GitHub Pages) can show the site but cannot save edits.
