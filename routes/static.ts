export async function handleFOffSound(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const file = await Bun.file("fOff.mp3").arrayBuffer(); // Update file name and extension
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg", // Update MIME type for MP3
      },
    });
  } catch (error) {
    return new Response("Error fetching fOff.mp3: File not found", {
      // Update error message
      status: 404,
      headers: corsHeaders,
    });
  }
}

export async function handleSirenSound(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const file = await Bun.file("siren.wav").arrayBuffer();
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "wav",
      },
    });
  } catch (error) {
    return new Response("Error fetching siren.wav: File not found", {
      status: 404,
      headers: corsHeaders,
    });
  }
}
