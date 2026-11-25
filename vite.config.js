import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { apiMiddleware } from "./server/api.js";

// Runs the content API inside `npm run dev` and `npm run preview`.
const contentApi = () => ({
  name: "content-api",
  // Braces matter: returning the connect app would make Vite treat it as a post-hook.
  configureServer(server) {
    server.middlewares.use(apiMiddleware);
  },
  configurePreviewServer(server) {
    server.middlewares.use(apiMiddleware);
  },
});

export default defineConfig({ plugins: [react(), contentApi()] });
