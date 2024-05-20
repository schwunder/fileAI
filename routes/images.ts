import { readdirSync } from "fs";

export async function handleImageFile(
  requestUrl: URL,
  corsHeaders: Record<string, string>
): Promise<Response> {
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

export async function handleAllImageFiles(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const files = readdirSync("./testImages").filter((file: string) =>
      file.endsWith(".png")
    );
    const imageData = await Promise.all(
      files.map(async (file) => {
        const filePath = `./testImages/${file}`;
        const fileContent = await Bun.file(filePath).arrayBuffer();
        return {
          fileName: file,
          content: fileContent,
        };
      })
    );
    return new Response(JSON.stringify(imageData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching image files:", error);
    return new Response("Error fetching image files", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
