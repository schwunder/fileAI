import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      "/db": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/db/, "/db"),
      },
      "/testImages": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/testImages/, "/testImages"),
      },
      "/processImage": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/processImage/, "/processImage"),
      },
      "/mutateImageData": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/mutateImageData/, "/mutateImageData"),
      },
    },
  },
});
