import { readdirSync } from "fs";
import { handleImageRoutes, handleImageFile } from "./routes/images";
import { handleJsonFileRequest } from "./routes/json";
import { handlePostRequest } from "./routes/post";
import {
  handleStyles,
  handleScript,
  handleOptions,
  handleIndexRequest,
  handleScriptComponent,
  handleScriptFetch,
  handleScriptUtils,
  handleSirenSound, // Added this line
} from "./routes/static";
import { handleProcessImage, handleMutateImageData } from "./routes/methods";

function getTestImages() {
  const images = readdirSync("./testImages").map(
    (file) => `/testImages/${file}`
  );
  console.log("Fetched test images:", images);
  return images;
}

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const { method, url, headers } = request;
    console.log("Received request:", { method, url, headers });

    const requestUrl = new URL(request.url);
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

    if (requestUrl.pathname === "/components.js") {
      return handleScriptComponent(corsHeaders);
    }

    if (requestUrl.pathname === "/fetch.js") {
      return handleScriptFetch(corsHeaders);
    }

    if (requestUrl.pathname === "/utilsFrontend.js") {
      return handleScriptUtils(corsHeaders);
    }

    if (requestUrl.pathname === "/fOff.mp3") {
      return handleSirenSound(corsHeaders); // Added this line
    }

    if (requestUrl.pathname === "/siren.wav") {
      return handleSirenSound(corsHeaders); // Added this line
    }

    if (requestUrl.pathname === "/testImages") {
      return handleImageRoutes(corsHeaders);
    }

    if (requestUrl.pathname.startsWith("/testImages/")) {
      return handleImageFile(requestUrl, corsHeaders);
    }

    if (requestUrl.pathname === "/processImage" && method === "POST") {
      return handleProcessImage(request, corsHeaders);
    }

    if (requestUrl.pathname === "/mutateImageData" && method === "POST") {
      return handleMutateImageData(request, corsHeaders);
    }

    if (
      requestUrl.pathname.startsWith("/db/testImages/") &&
      requestUrl.pathname.endsWith(".json")
    ) {
      return handleJsonFileRequest(requestUrl, corsHeaders);
    }

    if (method === "POST") {
      return handlePostRequest(request, corsHeaders);
    }

    if (requestUrl.pathname === "/" || requestUrl.pathname === "/index.html") {
      return handleIndexRequest(corsHeaders);
    }

    console.log("Unhandled request");
    return new Response("no post", { headers: corsHeaders });
  },
});

console.log(`Listening on localhost:${server.port}`);
console.log("Available images:", getTestImages());
