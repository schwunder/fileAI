export async function handleStyles(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const file = await Bun.file("styles.css").text();
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/css",
      },
    });
  } catch (error) {
    return new Response("Error fetching styles.css: File not found", {
      status: 404,
      headers: corsHeaders,
    });
  }
}

export async function handleScript(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const file = await Bun.file("script.js").text();
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    return new Response("Error fetching script.js: File not found", {
      status: 404,
      headers: corsHeaders,
    });
  }
}

export async function handleScriptComponent(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const file = await Bun.file("components.js").text();
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    return new Response("Error fetching components.js: File not found", {
      status: 404,
      headers: corsHeaders,
    });
  }
}

export async function handleScriptFetch(
  corsHeaders: Record<string, string>
): Promise<Response> {
  try {
    const file = await Bun.file("fetch.js").text();
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/javascript",
      },
    });
  } catch (error) {
    return new Response("Error fetching fetch.js: File not found", {
      status: 404,
      headers: corsHeaders,
    });
  }
}

export async function handleIndexRequest(
  corsHeaders: Record<string, string>
): Promise<Response> {
  console.log("Handling / or /index.html request");
  try {
    const file = await Bun.file("index.html").text();
    return new Response(file, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error fetching index.html:", error);
    return new Response("File not found", {
      status: 404,
      headers: corsHeaders,
    });
  }
}

export function handleOptions(corsHeaders: Record<string, string>): Response {
  return new Response(null, { headers: corsHeaders });
}
