import { readdirSync } from "fs";
import processImage from "./processImage";
import mutateImageData from "./mutateImageData";

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

    if (requestUrl.pathname === "/processImage" && method === "POST") {
      const { imgPath } = await request.json();
      await processImage(imgPath);
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (requestUrl.pathname === "/mutateImageData" && method === "POST") {
      const { absPath, comment, tags } = await request.json();
      console.log("Received data:", { absPath, comment, tags });
      await mutateImageData(absPath, comment, tags);
      return new Response(
        JSON.stringify({ message: "Data written successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (requestUrl.pathname === "/db/") {
      try {
        const files = readdirSync("./db/testImages").filter((file: string) =>
          file.endsWith(".json")
        );
        const jsonData = await Promise.all(
          files.map(async (file) => {
            const filePath = `./db/testImages/${file}`;
            const fileContent = await Bun.file(filePath).text();
            return JSON.parse(fileContent);
          })
        );
        return new Response(JSON.stringify(jsonData), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error fetching JSON files:", error);
        return new Response("Error fetching JSON files", {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    if (requestUrl.pathname.startsWith("/testImages/")) {
      const filePath: string = `.${requestUrl.pathname}`;
      try {
        const file: ArrayBuffer = await Bun.file(filePath).arrayBuffer();
        return new Response(file, {
          headers: {
            ...corsHeaders,
            "Content-Type": "image/png",
          },
        });
      } catch (error) {
        return new Response(`Error fetching file: ${filePath} not found`, {
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
