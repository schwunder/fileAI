<script>
  import "./app.css";
  import Tsne from "./lib/Tsne.svelte";
  import { DB } from "../db.ts";
  import { addFolder } from "./api.js";
  import { calculateSimilarities } from "./utilities";
  import { fetchEmbedding } from "./api.js";
  import CardCarousel from "./lib/CardCarousel.svelte";
  
  let folderPath = "";
  let searchQuery = "";
  let metaDataArray = [];
  let sortedMetaDataArray = [];
  let isayso = false;

  // Ensure sortedMetaDataArray is always an array
  $: sortedMetaDataArray = Array.isArray(sortedMetaDataArray) ? sortedMetaDataArray : [];

  async function loadData() {
      try {
          const data = await DB({
              method: "GET"
          });

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
          sortedMetaDataArray = similarities.sort((a, b) => b.similarity - a.similarity).map(item => item.token);
      } catch (error) {
          console.error("Error in handleSearch:", error);
      }
  };

  // Load data initially
  loadData();
</script>

<header class="bg-blue-500 text-white p-4 flex justify-between items-center">
  <h1 class="text-2xl font-bold">Images Gallery with Tags and Description and Suggested Title</h1>
  <button class="bg-white text-blue-500 px-4 py-2 rounded" on:click="{() => { isayso = !isayso; }}">
    {isayso ? "Show Images" : "Show TSNE"}
  </button>
  <input class="p-2 rounded border" bind:value="{searchQuery}" type="text" placeholder="Search images..." on:keydown="{(event) => { if (event.key === 'Enter') handleSearch(); }}" />
</header>

<main class="p-4">
  {#if isayso}
    <Tsne></Tsne>
  {:else}
    {#if sortedMetaDataArray.length > 0}
    <div class="container">
      <CardCarousel {sortedMetaDataArray} {folderPath}></CardCarousel>
    </div>
    {:else}
      <p class="text-red-500">Add a folder path please then press the button to add it</p>
      <input class="p-2 rounded border" bind:value="{folderPath}" type="text" placeholder="Enter folder path here" />
      <button class="bg-blue-500 text-white px-4 py-2 rounded mt-2" on:click="{handleAddFolder}">Add</button>    
    {/if}
  {/if}
</main>

<footer class="bg-gray-800 text-white p-4 text-center">
  <p>© 2023 Sample HTML Page. All rights reserved.</p>
</footer>

<style>
  :global(body) {
    font-family: Arial, sans-serif;
  }
</style>