<script>
  import ImageCard from "./lib/ImageCard.svelte";
  import { getDB } from "./api";

  let db = getDB();
</script>

<header>
  <h1>Images Gallery with Tags and Description and suggested Title</h1>
</header>
<main>
  {#await db}
    <p>Loading images...</p>
  {:then db}
    <div class="container">
      {#each db as metaData}
        <ImageCard {metaData} />
      {/each}
    </div>
  {:catch someError}
    <p>System error: {someError.message}.</p>
  {/await}
</main>
<footer>
  <p>&copy; 2023 Sample HTML Page. All rights reserved.</p>
</footer>

<style>
  :global(body) {
    font-family: Arial, sans-serif;
  }
  .container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    width: 100%;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
  }
</style>
