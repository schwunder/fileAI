<script>
  import ImageCard from "./lib/ImageCard.svelte";
  import { DB } from "../db.ts";
  import { addFolder, fetchEmbedding } from "./api.js";
  import { findClosestToken, calculateSimilarities } from './utilities'; // Import necessary functions

  let db;
  let folderPath = "";
  let searchQuery = "";
  let metaDataArray = [];
  let sortedMetaDataArray = [];

  async function loadData() {
    try {
      const data = await DB({ method: "GET" });
      metaDataArray = data;
      sortedMetaDataArray = [...metaDataArray];
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  async function handleAddFolder() {
    await addFolder(folderPath);
    await loadData();
  }

  async function handleSearch() {
    if (searchQuery.length <= 3) {
      return;
    }

    console.log("Search query:", searchQuery);
    try {
      const response = await fetchEmbedding(searchQuery);
      console.log("Embedding response:", response); // Log the response
      const searchEmbedding = response.embedding; // Adjust this line based on the actual response structure
      if (!Array.isArray(searchEmbedding)) {
        throw new Error("Invalid search embedding");
      }
      const similarities = calculateSimilarities(searchEmbedding, metaDataArray);
      sortedMetaDataArray = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .map(item => item.token);
      console.log("Sorted metadata array:", sortedMetaDataArray);
    } catch (error) {
      console.error("Error in handleSearch:", error);
    }
  }

  // Load data initially
  loadData();
</script>

<header>
  <h1>Images Gallery with Tags and Description and suggested Title</h1>
  <input bind:value={searchQuery} type="text" placeholder="Search images..." on:input={handleSearch} />
</header>

<main>
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
</style>
