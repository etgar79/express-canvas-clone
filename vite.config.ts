import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// index.html references the built /assets/index.js + /assets/index.css so the
// repo root can be served as a plain static site (GitHub Pages).
// Both in dev and during the build the entry is rewritten back to the TSX source.
const sourceEntry = (): Plugin => ({
  name: "source-entry-rewrite",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      return html
        .replace(/<link rel="stylesheet" href="\/assets\/index\.css"\s*\/?>\s*/, "")
        .replace('src="/assets/index.js"', 'src="/src/main.tsx"');
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), sourceEntry(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: (assetInfo) =>
          assetInfo.name && assetInfo.name.endsWith(".css")
            ? "assets/index.css"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
