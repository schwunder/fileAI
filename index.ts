import { readdirSync } from "fs";
import processImage from "./processImage";
import mutateImageData from "./mutateImageData";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const createResponse = (
  body: any,
  status: number = 200,
  headers: Record<string, string> = {}
): Response =>
  new Response(body, { status, headers: { ...corsHeaders, ...headers } });

type RouteHandler = (requestUrl: URL, request: Request) => Promise<Response>;

const routes: Record<string, RouteHandler> = {
  "POST /processImage": async (requestUrl, request) => {
    const { imgPath }: { imgPath: string } = await request.json();
    await processImage(imgPath);
    return createResponse(null);
  },
  "POST /mutateImageData": async (requestUrl, request) => {
    const {
      absPath,
      comment,
      tags,
    }: { absPath: string; comment: string; tags: string[] } =
      await request.json();
    console.log("Received data:", { absPath, comment, tags });
    await mutateImageData(absPath, comment, tags);
    return createResponse(
      JSON.stringify({ message: "Data written successfully" }),
      200,
      { "Content-Type": "application/json" }
    );
  },
  "GET /db/": async () => {
    try {
      const files: string[] = readdirSync("./db/testJsons").filter((file) =>
        file.endsWith(".json")
      );
      const jsonData = await Promise.all(
        files.map(async (file) => {
          const filePath = `./db/testJsons/${file}`;
          const fileContent = await Bun.file(filePath).text();
          return JSON.parse(fileContent);
        })
      );
      return createResponse(JSON.stringify(jsonData), 200, {
        "Content-Type": "application/json",
      });
    } catch (error) {
      console.error("Error fetching JSON files:", error);
      return createResponse("Error fetching JSON files", 500);
    }
  },
  "GET /testImages/*": async (requestUrl) => {
    const filePath = `.${requestUrl.pathname}`;
    try {
      const file = await Bun.file(filePath).arrayBuffer();
      return createResponse(file, 200, { "Content-Type": "image/png" });
    } catch (error) {
      return createResponse(`Error fetching file: ${filePath} not found`, 404);
    }
  },
};

const server = Bun.serve({
  port: 3000,
  async fetch(request: Request): Promise<Response> {
    const { method, url } = request;
    console.log("Received request:", { method, url });

    const requestUrl = new URL(request.url);
    const routeKey = `${method} ${requestUrl.pathname}`;

    if (method === "OPTIONS") {
      return createResponse(null, 204);
    }

    for (const [route, handler] of Object.entries(routes)) {
      const [routeMethod, routePath] = route.split(" ");
      if (
        method === routeMethod &&
        (routePath === requestUrl.pathname || routePath.endsWith("*"))
      ) {
        return handler(requestUrl, request);
      }
    }

    console.log("Unhandled request");
    return createResponse("no post");
  },
});

console.log(`Listening on localhost:${server.port}`);
