import { readdirSync } from "fs";
import processImage from "./processImage"; // Make sure to import the processImage function
import { handleImageRoutes, handleImageFile } from "./routes/images";
import { handleJsonFile } from "./routes/json";
import { handleStyles, handleScript, handleOptions } from "./routes/static";
import { handleProcessImage } from "./routes/methods";

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

    if (requestUrl.pathname === "/testImages") {
      return handleImageRoutes(corsHeaders);
    }

    if (requestUrl.pathname.startsWith("/testImages/")) {
      return handleImageFile(requestUrl, corsHeaders);
    }

    if (requestUrl.pathname === "/db") {
      return handleJsonFile(requestUrl, corsHeaders);
    }

    if (requestUrl.pathname === "/processImage" && method === "POST") {
      return handleProcessImage(request, corsHeaders);
    }

    if (
      requestUrl.pathname.startsWith("/db/testImages/") &&
      requestUrl.pathname.endsWith(".json")
    ) {
      const filePath = `.${requestUrl.pathname}`;
      console.log("Handling request for:", filePath);
      try {
        const file = await Bun.file(filePath).text();
        return new Response(file, {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching file:", error);
        return new Response("File not found", {
          status: 404,
          headers: corsHeaders,
        });
      }
    }

    if (method === "POST") {
      const body = await request.json();
      console.log("Handling POST request with body:", body);
      return new Response(`Welcome to Bun! ${body}`, { headers: corsHeaders });
    }

    if (requestUrl.pathname === "/" || requestUrl.pathname === "/index.html") {
      console.log("Handling / or /index.html request");
      try {
        const file = await Bun.file("index.html").text();
        return new Response(file, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/html",
          },
        });
      } catch (error) {
        console.error("Error fetching index.html:", error);
        return new Response("File not found", {
          status: 404,
          headers: corsHeaders,
        });
      }
    }

    console.log("Unhandled request");
    return new Response("no post", { headers: corsHeaders });
  },
});

console.log(`Listening on localhost:${server.port}`);
console.log("Available images:", getTestImages());
