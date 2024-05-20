import { readdirSync } from "fs";
import { handleAllImageFiles, handleImageFile } from "./routes/images";
import { handleAllJsonFilesRequest } from "./routes/json";
import { handleSirenSound, handleFOffSound } from "./routes/static";
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
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (requestUrl.pathname === "/fOff.mp3") {
      return handleFOffSound(corsHeaders);
    }

    if (requestUrl.pathname === "/siren.wav") {
      return handleSirenSound(corsHeaders);
    }

    if (requestUrl.pathname === "/processImage" && method === "POST") {
      return handleProcessImage(request, corsHeaders);
    }

    if (requestUrl.pathname === "/mutateImageData" && method === "POST") {
      return handleMutateImageData(request, corsHeaders);
    }

    if (requestUrl.pathname === "/db/testImages/all") {
      return handleAllJsonFilesRequest(corsHeaders);
    }

    if (requestUrl.pathname === "/testImages/all") {
      return handleAllImageFiles(corsHeaders);
    }

    if (requestUrl.pathname.startsWith("/testImages/")) {
      return handleImageFile(requestUrl, corsHeaders);
    }

    console.log("Unhandled request");
    return new Response("no post", { headers: corsHeaders });
  },
});

console.log(`Listening on localhost:${server.port}`);
console.log("Available images:", getTestImages());
