import { serve } from "bun";
import { glob } from "glob";
import { readFile } from "fs/promises";
import processImage from "./processImage";
import mutateImageData from "./mutateImageData";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = serve({
  port: 3000,
  async fetch(req: Request) {
    const { method, url } = req;
    const path = new URL(url).pathname;

    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (method === "GET" && path === "/db") {
      const files = await glob("./db/testJsons/*.json");
      const jsonData = await Promise.all(
        files.map(async (file) => JSON.parse(await readFile(file, "utf8")))
      );
      return new Response(JSON.stringify(jsonData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (method === "GET" && path.startsWith("/testImages/")) {
      const filePath = `.${path}`;
      const file = await readFile(filePath);
      return new Response(file, {
        headers: { ...corsHeaders, "Content-Type": "image/png" },
      });
    }

    if (method === "POST" && path === "/processImage") {
      const { imgPath } = await req.json();
      await processImage(imgPath);
      return new Response(null, { headers: corsHeaders });
    }

    if (method === "POST" && path === "/mutateImageData") {
      const { absPath, comment, tags } = await req.json();
      await mutateImageData(absPath, comment, tags);
      return new Response(
        JSON.stringify({ message: "Data written successfully" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log(`Listening on localhost:${server.port}`);
