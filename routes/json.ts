export async function handleJsonFile(
  requestUrl: URL,
  corsHeaders: Record<string, string>
) {
  const filePath = `.${requestUrl.pathname}`;
  try {
    const file = await Bun.file(filePath).text();
    return new Response(file, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error fetching file: ${filePath} not found`, {
      status: 404,
      headers: corsHeaders,
    });
  }
}
