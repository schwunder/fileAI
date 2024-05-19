export async function handlePostRequest(
  request: Request,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  console.log("Handling POST request with body:", body);
  return new Response(`Welcome to Bun! ${body}`, { headers: corsHeaders });
}
