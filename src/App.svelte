<script>
  import { onMount } from "svelte";
  import Grid from "./lib/IGrid.svelte";
  import { fetchJsons } from "./fetch";

  let jsons = [];

  onMount(async () => {
    jsons = await fetchJsons();
  });
</script>

<body>
  <header>
    <h1>Images Gallery with Tags and Description and suggested Title</h1>
  </header>
  <main>
    {#if jsons.length > 0}
      <Grid {jsons} />
    {:else}
      <p>Loading images...</p>
    {/if}
  </main>
  <footer>
    <p>&copy; 2023 Sample HTML Page. All rights reserved.</p>
  </footer>
</body>

<style>
  body {
    font-family: Arial, sans-serif;
  }
</style>
