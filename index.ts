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

    const url2 = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (method === "OPTIONS") {
      return handleOptions(corsHeaders);
    }

    if (url2.pathname === "/styles.css") {
      return handleStyles(corsHeaders);
    }

    if (url2.pathname === "/script.js") {
      return handleScript(corsHeaders);
    }

    if (url2.pathname === "/testImages") {
      return handleImageRoutes(corsHeaders);
    }

    if (url2.pathname.startsWith("/testImages/")) {
      return handleImageFile(url2, corsHeaders);
    }

    if (url2.pathname === "/db") {
      return handleJsonFile(url2, corsHeaders);
    }

    if (url2.pathname === "/processImage" && method === "POST") {
      return handleProcessImage(request, corsHeaders);
    }

    if (
      url2.pathname.startsWith("/db/testImages/") &&
      url2.pathname.endsWith(".json")
    ) {
      const filePath = `.${url2.pathname}`;
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

    if (url2.pathname === "/" || url2.pathname === "/index.html") {
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
