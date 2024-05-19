import { handleStyles, handleScript, handleOptions } from "./routes/static";
import { handleImageRoutes, handleImageFile } from "./routes/images";
import { handleJsonFile } from "./routes/json";
import { handleProcessImage } from "./routes/methods";
import { getTestImages } from "./utils";

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const { method, url } = request;
    const requestUrl = new URL(url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (method === "OPTIONS") {
      return handleOptions(corsHeaders);
    }

    if (requestUrl.pathname === "/styles.css") {
      return handleStyles(corsHeaders);
    }

    if (requestUrl.pathname === "/script.js") {
      return handleScript(corsHeaders);
    }

    if (requestUrl.pathname === "/testImages") {
      return handleImageRoutes(corsHeaders);
    }

    if (requestUrl.pathname.startsWith("/testImages/") && method === "GET") {
      return handleImageFile(requestUrl, corsHeaders);
    }

    if (requestUrl.pathname === "/processImage" && method === "POST") {
      return handleProcessImage(request, corsHeaders);
    }

    if (
      requestUrl.pathname.startsWith("/db/testImages/") &&
      requestUrl.pathname.endsWith(".json")
    ) {
      return handleJsonFile(requestUrl, corsHeaders);
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`Listening on localhost:${server.port}`);
console.log("Available images:", getTestImages());
