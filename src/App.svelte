<script>
  import ImageCard from "./lib/ImageCard.svelte";
  import { DB } from "../db.ts"
  import { addFolder, fetchEmbedding } from "./api.js"

  let db = DB({ method: "GET" });
  let folderPath = ""; // only available at first initialization. state mgmt?
  let searchQuery = ""; // New variable for search query
  let tokenEmbeddings = [];

  async function handleAddFolder() {
    await addFolder(folderPath);
    db = DB({ method: "GET" });
  }

  function handleSearch() {
    // Implement search logic here if needed
    console.log("Search query:", searchQuery);
  }

  async function updateImageDescriptions(dataBase) {
    const tokens = dataBase.map(metaData => metaData.description);
    const embeddings = await Promise.all(tokens.map(async (token) => {
      try {
        const response = await fetchEmbedding(token);
        console.log('Fetched embedding for search string:', token, response);
        if (response && response.embedding) {
          return response.embedding;  // Access the embedding from the structured response
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error(`Error fetching embedding for token "${token}":`, error);
        return null;
      }
    }));

    tokenEmbeddings = embeddings.filter(embedding => embedding !== null);
    console.log("Valid embeddings:", tokenEmbeddings);
  }
</script>

<header>
  <h1>Images Gallery with Tags and Description and suggested Title</h1>
  <input bind:value={searchQuery} type="text" placeholder="Search images..." on:input={handleSearch} />
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
        {updateImageDescriptions(db)}
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
    height: 100vh; /* Set the height to the viewport height */
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto; /* Enable vertical scrolling */
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  header input {
    padding: 5px;
    font-size: 1rem;
  }
</style>
