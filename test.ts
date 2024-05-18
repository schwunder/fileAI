import { $ } from "bun";

//const result = await $`exa -la`.nothrow();
Bun.serve({
  fetch(req) {
    console.log(req.url);
    return new Response("Hello, world!");
  },
});
