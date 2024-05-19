const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const { method, url, headers } = request;
    const url2 = new URL(request.url);
    if (url2.pathname === "/db") {
      const file = await Bun.file("db/db2.json").text();
      return new Response(file);
    }
    if (method == "POST") {
      const body = await request.json();
      console.log(body);
      return new Response(`Welcome to Bun! ${body}`);
    }
    return new Response("no post");
  },
});

console.log(`Listening on localhost:${server.port}`);
