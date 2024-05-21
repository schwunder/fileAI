import { readdirSync } from "fs";

export async function handleAllJsonFilesRequest(
  corsHeaders: Record<string, string>
): Promise<Response> {
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
