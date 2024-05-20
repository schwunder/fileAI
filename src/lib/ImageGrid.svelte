<script>
  import ImageComponent from "./ImageComponent.svelte";
  export let imageProps = [];
</script>

<div class="grid-container">
  {#each imageProps as prop}
    <ImageComponent imageData={prop} />
  {/each}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    height: 100vh;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto; /* Add scroll if needed */
  }
</style>
