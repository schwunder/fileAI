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
