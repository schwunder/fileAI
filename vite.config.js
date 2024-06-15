import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  // server: {
  //   proxy: {
  //     "/processImage": {
  //       target: "http://localhost:3000",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/processImage/, "/processImage"),
  //     },
  //     "/mutateImageData": {
  //       target: "http://localhost:3000",
  //       changeOrigin: true,
  //       rewrite: (path) =>
  //         path.replace(/^\/mutateImageData/, "/mutateImageData"),
  //     },
  //   },
  // },
});
