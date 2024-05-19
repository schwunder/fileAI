import { readdirSync } from "fs";
import processImage from "./processImage"; // Make sure to import the processImage function

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
      console.log("Handling OPTIONS request");
      return new Response(null, { headers: corsHeaders });
    }

    if (url2.pathname === "/styles.css") {
      console.log("Handling /styles.css request");
      try {
        const file = await Bun.file("styles.css").text();
        return new Response(file, {
          headers: {
            ...corsHeaders,
            "Content-Type": "text/css",
          },
        });
      } catch (error) {
        console.error("Error fetching styles.css:", error);
        return new Response("File not found", {
          status: 404,
          headers: corsHeaders,
        });
      }
    }

    if (url2.pathname === "/testImages") {
      console.log("Handling /testImages request");
      const images = getTestImages();
      return new Response(JSON.stringify(images), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (url2.pathname.startsWith("/testImages/")) {
      const filePath = `.${url2.pathname}`;
      console.log("Handling image request for:", filePath);
      try {
        const file = await Bun.file(filePath).arrayBuffer();
        return new Response(file, {
          headers: {
            ...corsHeaders,
            "Content-Type": "image/png",
          },
        });
      } catch (error) {
        console.error("Error fetching file:", error);
        return new Response("File not found", {
          status: 404,
          headers: corsHeaders,
        });
      }
    }

    if (url2.pathname === "/db") {
      console.log("Handling /db request");
      const file = await Bun.file("db/db.json").text();
      return new Response(file, { headers: corsHeaders });
    }

    if (url2.pathname === "/processImage" && method === "POST") {
      const { imgPath } = await request.json();
      console.log("Processing image:", imgPath);
      await processImage(imgPath);
      return new Response("Image processed successfully", {
        headers: corsHeaders,
      });
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
