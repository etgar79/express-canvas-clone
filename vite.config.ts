import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// In dev, index.html must load the TSX entry directly.
// In production it loads the built /assets/index.js + /assets/index.css,
// which lets GitHub Pages serve the repo root as a static site.
const devEntry = (): Plugin => ({
  name: "dev-entry-rewrite",
  apply: "serve",
  transformIndexHtml(html) {
    return html
      .replace(
        /<link rel="stylesheet" href="\/assets\/index\.css"\s*\/?>\s*/,
        "",
      )
      .replace('src="/assets/index.js"', 'src="/src/main.tsx"');
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), devEntry(), mode === "development" && componentTagger()].filter(Boolean),
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
