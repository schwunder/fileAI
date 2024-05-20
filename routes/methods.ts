import processImage from "../processImage";
import mutateImageData from "../mutateImageData";

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

export async function handleMutateImageData(
  request: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
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
