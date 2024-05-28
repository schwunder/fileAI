<script>
  import ImageCard from "./lib/ImageCard.svelte";
  import { DB } from "../db.ts"
  import { addFolder } from "./api.js"

  let db = DB({ method: "GET" });
  let folderPath = ""; // only available at first initialization

  async function handleAddFolder() {
    await addFolder(folderPath);
    db = DB({ method: "GET" });
  }
</script>

<header>
  <h1>Images Gallery with Tags and Description and suggested Title</h1>
</header>
<main>
  {#await db}
    <p>Loading images...</p>
  {:then db}
    {#if db.length > 0}
      <div class="container">
        {#each db as metaData}
          <ImageCard metaData={metaData} folderPath={folderPath} />
        {/each}
      </div>
    {:else}
      <p>add a folder path please the press the button to add it</p>
      <input bind:value={folderPath} type="text" placeholder="Enter folder path here" />
      <button on:click={handleAddFolder}>Add</button>    
    {/if}
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
