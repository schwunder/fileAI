<script>
  import Component from "./IComponent.svelte";
  export let jsons = [];
</script>

<div class="container">
  {#each jsons as json}
    <Component data={json} />
  {/each}
</div>

<style>
  .container {
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
