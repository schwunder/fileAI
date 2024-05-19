import processImage from "../processImage";

export async function handleProcessImage(
  request: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const { imgPath } = await request.json();
  await processImage(imgPath);
  return new Response(null, {
    headers: corsHeaders,
  });
}
