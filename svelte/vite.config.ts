import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte({ emitCss: false })],
  build: {
    outDir: path.resolve(__dirname, "../src/compiled-fw"),
    rollupOptions: {
      input: "/src/main.ts",
      output: {
        entryFileNames: `main.js`,
      },
    },
  },
});
