export async function handleJsonFileRequest(
  requestUrl: URL,
  corsHeaders: Record<string, string>
): Promise<Response> {
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
