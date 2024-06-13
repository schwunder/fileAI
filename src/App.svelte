<script>
  import ImageCard from "./lib/ImageCard.svelte";
  import Tsne from "./lib/Tsne.svelte";
  import { DB } from "../db.ts";
  import { addFolder } from "./api.js";
  import { calculateSimilarities } from './utilities'; 
  import { fetchEmbedding } from "./api.js";

  let folderPath = "";
  let searchQuery = "";
  let metaDataArray = [];
  let sortedMetaDataArray = [];
  let isayso = false;

  async function loadData() {
    try {
      const data = await DB({ method: "GET" });
      metaDataArray = data;
      sortedMetaDataArray = [...metaDataArray];
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const handleAddFolder = async () => {
    await addFolder(folderPath);
    await loadData();
  };

  const handleSearch = async () => {
    try {
      const response = await fetchEmbedding(searchQuery);
      const searchEmbedding = response.embedding;
      if (!Array.isArray(searchEmbedding)) {
        throw new Error("Invalid search embedding");
      }
      const similarities = calculateSimilarities(searchEmbedding, metaDataArray);
      sortedMetaDataArray = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .map(item => item.token);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  };

  // Load data initially
  loadData();
</script>

<header>
  <h1>Images Gallery with Tags and Description and suggested Title</h1>
  <button on:click={() => { isayso = !isayso; }}>{isayso ? "Show Images" : "Show TSNE"}</button>
  <input bind:value={searchQuery} type="text" placeholder="Search images..." on:keydown={(event) => { if (event.key === 'Enter') handleSearch(); }} />
</header>

<main>
  {#if isayso}
    <Tsne />
  {:else}
    {#if sortedMetaDataArray.length > 0}
      <div class="container">
        {#each sortedMetaDataArray as metaData}
          <ImageCard metaData={metaData} folderPath={folderPath} />
        {/each}
      </div>
    {:else}
      <p>add a folder path please then press the button to add it</p>
      <input bind:value={folderPath} type="text" placeholder="Enter folder path here" />
      <button on:click={handleAddFolder}>Add</button>    
    {/if}
  {/if}
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
    overflow-y: auto;
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
  header button {
    margin-right: 10px;
    padding: 5px 10px;
    font-size: 1rem;
  }
</style>
