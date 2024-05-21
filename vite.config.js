import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
